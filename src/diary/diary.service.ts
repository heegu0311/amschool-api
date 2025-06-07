import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Image } from '../common/entities/image.entity';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { ImageService } from '../common/services/image.service';
import { ReactionEntityService } from '../reaction-entity/reaction-entity.service';
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
    private readonly reactionEntityService: ReactionEntityService,
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
      const imageEntities = await Promise.all(
        images.map(async (image, index) => {
          const uploadedImageUrl = await this.imageService.uploadImage(
            image,
            'diary',
          );

          return this.imageRepository.create({
            url: uploadedImageUrl,
            originalName: image.originalname,
            mimeType: image.mimetype,
            size: image.size,
            entityType: 'diary',
            entityId: savedDiary.id,
            order: index,
          });
        }),
      );

      await this.imageRepository.save(imageEntities);
    }

    return savedDiary;
  }

  async findAll(
    paginationDto: PaginationDto,
    userId?: number,
  ): Promise<PaginatedResponse<Diary>> {
    const { page = 1, limit = 10 } = paginationDto;

    const [items, totalItems] = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.author', 'author')
      .leftJoinAndSelect('diary.images', 'images')
      .leftJoinAndSelect(
        'comment',
        'comments',
        'comments.entity_id = diary.id AND comments.entity_type = :entityType',
        { entityType: 'diary' },
      )
      .where(
        userId
          ? 'diary.accessLevel IN (:...accessLevels)'
          : 'diary.accessLevel = :accessLevel',
        userId
          ? { accessLevels: ['public', 'member'] }
          : { accessLevel: 'public' },
      )
      .orderBy('diary.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

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

  async findAllWithMoreInfo(
    paginationDto: PaginationDto,
    userId?: number,
    keyword?: string,
  ): Promise<PaginatedResponse<Diary>> {
    const { page = 1, limit = 10 } = paginationDto;

    const queryBuilder = this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.author', 'author')
      .leftJoinAndSelect('diary.images', 'images')
      .leftJoinAndSelect('diary.comments', 'comments')
      .where(
        userId
          ? 'diary.accessLevel IN (:...accessLevels)'
          : 'diary.accessLevel = :accessLevel',
        userId
          ? { accessLevels: ['public', 'member'] }
          : { accessLevel: 'public' },
      );

    if (keyword) {
      queryBuilder.andWhere('(diary.content LIKE :keyword)', {
        keyword: `%${keyword}%`,
      });
    }

    const [items, totalItems] = await queryBuilder
      .orderBy('diary.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    // 다이어리 ID 목록 추출
    const diaryIds = items.map((diary) => diary.id);

    // 여러 다이어리의 공감을 한 번에 조회
    const diaryReactions =
      await this.reactionEntityService.getReactionsForMultipleEntities(
        'diary',
        diaryIds,
        userId,
      );

    // 공감 정보를 각 엔티티에 매핑
    const diariesWithReactions = items.map((diary) => {
      const diaryWithReactions = {
        ...diary,
        reactions: diaryReactions[diary.id]?.reactions || [],
        userReactions: diaryReactions[diary.id]?.userReactions || [],
        comments: diary.comments || [],
        commentsCount: diary.comments?.length || 0,
      };
      return diaryWithReactions;
    });

    return {
      items: diariesWithReactions,
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
        limit: 1000, // 충분히 큰 수로 설정하여 모든 유사 사용자를 가져옴
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
    const [items, totalItems] = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.author', 'author')
      .leftJoinAndSelect('diary.images', 'images')
      .leftJoinAndSelect('diary.comments', 'comments')
      .where('diary.authorId IN (:...similarUserIds)', { similarUserIds })
      .andWhere(
        userId
          ? 'diary.accessLevel IN (:...accessLevels)'
          : 'diary.accessLevel = :accessLevel',
        userId
          ? { accessLevels: ['public', 'member'] }
          : { accessLevel: 'public' },
      )
      .orderBy('diary.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    // 다이어리 ID 목록 추출
    const diaryIds = items.map((diary) => diary.id);

    // 여러 다이어리의 공감을 한 번에 조회
    const diaryReactions =
      await this.reactionEntityService.getReactionsForMultipleEntities(
        'diary',
        diaryIds,
        userId,
      );

    // 공감 정보를 각 엔티티에 매핑
    const diariesWithReactions = items.map((diary) => {
      const diaryWithReactions = {
        ...diary,
        reactions: diaryReactions[diary.id]?.reactions || [],
        userReactions: diaryReactions[diary.id]?.userReactions || [],
        comments: diary.comments || [],
        commentsCount: diary.comments?.length || 0,
      };
      return diaryWithReactions;
    });

    return {
      items: diariesWithReactions,
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
    const diary = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.images', 'images')
      .leftJoinAndSelect(
        'comment',
        'comments',
        'comments.entity_id = diary.id AND comments.entity_type = :entityType',
        { entityType: 'diary' },
      )
      .where('diary.id = :id', { id })
      .getOne();

    if (diary?.accessLevel === 'private' && diary?.authorId !== userId) {
      throw new ForbiddenException('비공개 글은 작성자만 볼 수 있습니다.');
    }

    if (diary?.accessLevel === 'member' && !userId) {
      throw new NotFoundException(`Diary #${id} has member type`);
    }

    if (!diary) {
      throw new NotFoundException(`Diary #${id} not found`);
    }

    return diary;
  }

  async findOneWithMoreInfo(id: number, userId?: number): Promise<Diary> {
    // 댓글 수 조회
    const commentsCount = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.comments', 'comments')
      .select('COUNT(comments.id)', 'count')
      .where('diary.id = :id', { id })
      .getRawOne();

    // 일기 정보 조회
    const diary = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.author', 'author')
      .leftJoinAndSelect('author.cancerUsers', 'cancerUsers')
      .leftJoinAndSelect('cancerUsers.cancer', 'cancer')
      .leftJoinAndSelect('diary.images', 'images')
      .leftJoinAndSelect('diary.comments', 'comments')
      .where('diary.id = :id', { id })
      .getOne();

    if (!diary) {
      throw new NotFoundException(`Diary #${id} not found`);
    }

    if (diary.accessLevel === 'private' && diary.authorId !== userId) {
      throw new ForbiddenException('비공개 글은 작성자만 볼 수 있습니다.');
    }

    if (diary.accessLevel === 'member' && !userId) {
      throw new NotFoundException(`Diary #${id} has member type`);
    }

    // 이전글/다음글 조회
    const [prevDiary, nextDiary] = await Promise.all([
      this.findPrevDiary(id),
      this.findNextDiary(id),
    ]);

    // 일기 공감 조회
    const diaryReactions =
      await this.reactionEntityService.getReactionsForMultipleEntities(
        'diary',
        [diary.id],
        userId,
      );

    // 공감 정보를 엔티티에 매핑
    const diaryWithReactions = {
      ...diary,
      reactions: diaryReactions[diary.id]?.reactions || [],
      userReactions: diaryReactions[diary.id]?.userReactions || [],
      comments: diary.comments || [],
      commentsCount: Number(commentsCount?.count) || 0,
      prevDiary,
      nextDiary,
    };

    return diaryWithReactions as Diary;
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
    await this.diaryRepository.save(diary);

    // 기존 이미지 삭제 처리
    if (
      updateDiaryDto.deletedImageIds &&
      updateDiaryDto.deletedImageIds.length > 0
    ) {
      for (const deletedImageId of updateDiaryDto.deletedImageIds) {
        const imageToDelete = await this.imageRepository.findOne({
          where: { id: deletedImageId },
        });
        if (imageToDelete) {
          await this.imageService.deleteImage(imageToDelete.id);
          await this.imageRepository.remove(imageToDelete);
        }
      }
    }

    // 이미지 업데이트 처리
    if (updateDiaryDto.imageUpdates && updateDiaryDto.imageUpdates.length > 0) {
      // 기존 이미지 업데이트 처리
      for (const imageUpdate of updateDiaryDto.imageUpdates) {
        if (imageUpdate.id) {
          // 기존 이미지 업데이트
          const existingImage = await this.imageRepository.findOne({
            where: { id: imageUpdate.id },
          });
          if (existingImage) {
            existingImage.order = imageUpdate.order;
            await this.imageRepository.save(existingImage);
          }
        } else {
          // 신규 이미지 업로드 처리
          if (images && images.length > 0) {
            if (!imageUpdate || imageUpdate.id) continue; // 기존 이미지는 건너뛰기

            const uploadedImageUrl = await this.imageService.uploadImage(
              images[imageUpdate.order],
              'diary',
            );

            const imageEntity = this.imageRepository.create({
              url: uploadedImageUrl,
              originalName: images[imageUpdate.order].originalname,
              mimeType: images[imageUpdate.order].mimetype,
              size: images[imageUpdate.order].size,
              entityType: 'diary',
              entityId: id,
              order: imageUpdate.order,
            });

            await this.imageRepository.save(imageEntity);
          }
        }
      }
    }

    // entityType이 'diary'인 images만 포함해서 다시 조회
    const updatedDiary = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect(
        'diary.images',
        'image',
        'image.entityType = :entityType',
        { entityType: 'diary' },
      )
      .where('diary.id = :id', { id })
      .getOne();

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

    return await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.emotion', 'emotion')
      .leftJoinAndSelect('diary.author', 'author')
      .leftJoinAndSelect('diary.subEmotion', 'subEmotion')
      .select([
        'diary.id',
        'diary.content',
        'diary.createdAt',
        'diary.updatedAt',
        'emotion.id',
        'emotion.name',
        'author.id',
        'author.username',
        'author.profileImage',
        'subEmotion.id',
        'subEmotion.name',
      ])
      .where('diary.authorId = :userId', { userId })
      .andWhere('diary.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('diary.createdAt', 'DESC')
      .getMany();
  }

  async findByAuthorId(
    authorId: number,
    paginationDto: PaginationDto,
    currentUserId?: number,
  ): Promise<PaginatedResponse<Diary>> {
    const { page = 1, limit = 10 } = paginationDto;
    const [items, totalItems] = await this.diaryRepository
      .createQueryBuilder('diary')
      .leftJoinAndSelect('diary.author', 'author')
      .leftJoinAndSelect('diary.images', 'images')
      .leftJoinAndSelect(
        'comment',
        'comments',
        'comments.entity_id = diary.id AND comments.entity_type = :entityType',
        { entityType: 'diary' },
      )
      .where('diary.authorId = :authorId', { authorId })
      .andWhere('diary.accessLevel IN (:...accessLevels)', {
        accessLevels: ['public', 'member'],
      })
      .andWhere('diary.deletedAt IS NULL')
      .orderBy('diary.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    // 다이어리 ID 목록 추출
    const diaryIds = items.map((diary) => diary.id);

    // 여러 다이어리의 공감을 한 번에 조회
    const diaryReactions =
      await this.reactionEntityService.getReactionsForMultipleEntities(
        'diary',
        diaryIds,
        currentUserId,
      );

    // 공감 정보를 각 엔티티에 매핑
    const diariesWithReactions = items.map((diary) => {
      const diaryWithReactions = {
        ...diary,
        reactions: diaryReactions[diary.id]?.reactions || [],
        userReactions: diaryReactions[diary.id]?.userReactions || [],
        comments: diary.comments || [],
        commentsCount: diary.comments?.length || 0,
      };
      return diaryWithReactions;
    });

    return {
      items: diariesWithReactions,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  private async findPrevDiary(id: number): Promise<Diary | null> {
    return this.diaryRepository
      .createQueryBuilder('diary')
      .where('diary.id < :id', { id })
      .orderBy('diary.id', 'DESC')
      .getOne();
  }

  private async findNextDiary(id: number): Promise<Diary | null> {
    return this.diaryRepository
      .createQueryBuilder('diary')
      .where('diary.id > :id', { id })
      .orderBy('diary.id', 'ASC')
      .getOne();
  }
}
