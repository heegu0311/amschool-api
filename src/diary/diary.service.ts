import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Image } from '../common/entities/image.entity';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { ImageService } from '../common/services/image.service';
import { UsersService } from '../users/users.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { Diary } from './entities/diary.entity';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private diaryRepository: Repository<Diary>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    private readonly usersService: UsersService,
    private readonly imageService: ImageService,
  ) {}

  async create(
    userId: number,
    createDiaryDto: CreateDiaryDto,
    images?: Express.Multer.File[],
  ) {
    const diary = this.diaryRepository.create({
      authorId: userId,
      ...createDiaryDto,
    });
    const savedDiary = await this.diaryRepository.save(diary);

    if (images && images.length > 0) {
      const uploadPromises = images.map(async (image) => {
        const uploadedImage = await this.imageService.uploadImage(
          image,
          'diary',
          savedDiary.id,
        );

        const imageEntity = this.imageRepository.create({
          url: uploadedImage.url,
          originalName: image.originalname,
          mimeType: image.mimetype,
          size: image.size,
          entityType: 'diary',
          entityId: savedDiary.id,
        });

        const savedImage = await this.imageRepository.save(imageEntity);
        savedImage.diary = savedDiary;
        return this.imageRepository.save(savedImage);
      });

      await Promise.all(uploadPromises);
    }

    return savedDiary;
  }

  async findAll(
    paginationDto: PaginationDto,
    userId?: number,
  ): Promise<PaginatedResponse<Diary>> {
    const { page = 1, limit = 10 } = paginationDto;

    // userId가 없으면 public 일기만 조회
    // userId가 있으면 public 또는 member 일기 조회
    const where = userId
      ? { accessLevel: In(['public', 'member'] as const) }
      : { accessLevel: 'public' as const };

    const [items, totalItems] = await this.diaryRepository.findAndCount({
      where,
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        emotion: {
          id: true,
          name: true,
        },
        author: {
          id: true,
          username: true,
          profileImage: true,
        },
        subEmotion: {
          id: true,
          name: true,
        },
      },
      relations: ['emotion', 'author', 'subEmotion', 'images'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  async findSimilarUserDiaries(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Diary>> {
    const { page = 1, limit = 10 } = paginationDto;

    // 1. 유사 사용자 ID 목록 조회
    const similarUsersResponse = await this.usersService.findSimilarUsers(
      userId,
      {
        page: 1,
        limit: 100, // 충분히 큰 수로 설정하여 모든 유사 사용자를 가져옴
      },
    );
    const similarUserIds = similarUsersResponse.items.map((user) => user.id);

    if (similarUserIds.length === 0) {
      return {
        items: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: limit,
          totalPages: 0,
          currentPage: page,
        },
      };
    }

    // 2. 유사 사용자들의 오늘의나 조회
    const [items, totalItems] = await this.diaryRepository.findAndCount({
      where: {
        authorId: In(similarUserIds),
      },
      relations: ['emotion', 'author'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  async findOne(id: number, userId?: number) {
    const diary = await this.diaryRepository.findOne({
      where: { id },
      relations: ['images'],
    });

    if (diary?.accessLevel === 'private' && diary?.authorId !== userId) {
      throw new NotFoundException(`Diary #${id} has private type`);
    }

    if (diary?.accessLevel === 'member' && !userId) {
      throw new NotFoundException(`Diary #${id} has member type`);
    }

    if (!diary) {
      throw new NotFoundException(`Diary #${id} not found`);
    }

    return diary;
  }

  async update(
    id: number,
    userId: number,
    updateDiaryDto: UpdateDiaryDto,
    images?: Express.Multer.File[],
  ) {
    const diary = await this.findOne(id, userId);

    if (diary.authorId !== userId) {
      throw new UnauthorizedException('자신의 일지만 수정할 수 있습니다.');
    }

    Object.assign(diary, updateDiaryDto);
    const updatedDiary = await this.diaryRepository.save(diary);

    if (images && images.length > 0) {
      // 기존 이미지 삭제
      await this.imageService.deleteImagesByEntity('diary', id);

      // 새 이미지 업로드
      const uploadPromises = images.map(async (image) => {
        const uploadedImage = await this.imageService.uploadImage(
          image,
          'diary',
          id,
        );

        const imageEntity = this.imageRepository.create({
          url: uploadedImage.url,
          originalName: image.originalname,
          mimeType: image.mimetype,
          size: image.size,
          entityType: 'diary',
          entityId: id,
        });

        const savedImage = await this.imageRepository.save(imageEntity);
        savedImage.diary = updatedDiary;
        return this.imageRepository.save(savedImage);
      });

      await Promise.all(uploadPromises);
    }

    return updatedDiary;
  }

  async remove(id: number, userId: number) {
    const diary = await this.findOne(id, userId);
    await this.imageService.deleteImagesByEntity('diary', id);
    return await this.diaryRepository.softRemove(diary);
  }

  async findByMonth(userId: number, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return await this.diaryRepository.find({
      where: {
        authorId: userId,
        createdAt: Between(startDate, endDate),
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        emotion: {
          id: true,
          name: true,
        },
        author: {
          id: true,
          username: true,
          profileImage: true,
        },
        subEmotion: {
          id: true,
          name: true,
        },
      },
      relations: ['emotion', 'author', 'subEmotion', 'images'],
      order: { createdAt: 'DESC' },
    });
  }
}
