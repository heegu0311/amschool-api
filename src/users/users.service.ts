import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CancerUserService } from 'src/cancer-user/cancer-user.service';
import { Image } from 'src/common/entities/image.entity';
import { ImageService } from 'src/common/services/image.service';
import { SurveyAnswerUserService } from 'src/survey-answer-user/survey-answer-user.service';
import { IsNull, Repository } from 'typeorm';
import { CancerUser } from '../cancer-user/entities/cancer-user.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Comment } from '../comment/entities/comment.entity';
import { Reply } from '../comment/reply/entities/reply.entity';
import { SurveyAnswerUser } from '../survey-answer-user/entities/survey-answer-user.entity';
import { RefreshToken } from '../auth/entities/refresh-token.entity';
import { Diary } from '../diary/entities/diary.entity';
import { Post } from '../post/entities/post.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(CancerUser)
    private cancerUserRepository: Repository<CancerUser>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    private cancerUserService: CancerUserService,
    private surveyAnswerUserService: SurveyAnswerUserService,
    private imageService: ImageService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    Object.assign(user, createUserDto);
    const savedUser = await this.usersRepository.save(user);

    // 선택된 암 정보가 있는 경우 cancer_user 테이블에 추가
    if (createUserDto.cancerIds && createUserDto.cancerIds.length > 0) {
      await Promise.all(
        createUserDto.cancerIds.map(async (cancerId) => {
          await this.cancerUserService.create({
            userId: savedUser.id,
            cancerId,
          });
        }),
      );
    }

    // 설문 응답이 있는 경우 survey_answer_users 테이블에 추가
    if (createUserDto.surveyAnswers && createUserDto.surveyAnswers.length > 0) {
      await Promise.all(
        createUserDto.surveyAnswers.map(async (surveyAnswerId) => {
          await this.surveyAnswerUserService.create(
            savedUser.id,
            surveyAnswerId,
          );
        }),
      );
    }

    return savedUser;
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['cancerUsers', 'cancerUsers.cancer', 'surveyAnswerUsers'],
    });

    return user;
  }

  findByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  findByEmailAndProvider(email: string, provider: string) {
    return this.usersRepository.findOneBy({ email, signinProvider: provider });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    images?: Express.Multer.File[],
  ) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      return null;
    }

    const { cancerIds, surveyAnswers, ...rest } = updateUserDto;

    // DTO에서 undefined가 아닌 값만 업데이트
    const updateData: any = Object.entries(rest).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    // 암 정보 업데이트
    if (cancerIds) {
      // 기존 암 정보 삭제
      const existingCancerUsers = await this.cancerUserService.findByUserId(id);
      await Promise.all(
        existingCancerUsers.map((cu) => this.cancerUserService.delete(cu.id)),
      );

      // 새로운 암 정보 추가
      if (cancerIds.length > 0) {
        await Promise.all(
          cancerIds.map(async (cancerId) => {
            await this.cancerUserService.create({
              userId: id,
              cancerId,
            });
          }),
        );
      }
    }

    // surveyAnswers가 있을 경우, 각 답변을 순회하며 업데이트
    if (surveyAnswers && Array.isArray(surveyAnswers)) {
      // 기존 답변 삭제
      const existingAnswers =
        await this.surveyAnswerUserService.findByUserId(id);
      await Promise.all(
        existingAnswers.map((answer) =>
          this.surveyAnswerUserService.delete(id, answer.surveyAnswerId),
        ),
      );

      // 새로운 답변 추가
      await Promise.all(
        surveyAnswers.map((answerId) =>
          this.surveyAnswerUserService.create(id, answerId),
        ),
      );
    }

    // 이미지 업로드 처리
    if (images && images.length > 0) {
      const image = images[0]; // 첫 번째 이미지만 사용
      const uploadedImageUrl = await this.imageService.uploadImage(
        image,
        'user',
      );

      // 새 이미지 정보 저장
      const imageEntity = this.imageRepository.create({
        url: uploadedImageUrl,
        originalName: image.originalname,
        mimeType: image.mimetype,
        size: image.size,
        entityType: 'user',
        entityId: id,
        order: 0,
      });

      await this.imageRepository.save(imageEntity);
      updateData.profileImage = uploadedImageUrl;
    }

    await this.usersRepository.update(id, updateData);
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new Error('User not found');
    }

    return this.usersRepository.manager.transaction(async (manager) => {
      // 익명 사용자 계정 찾기 또는 생성
      let anonymousUser = await manager.findOne(User, {
        where: { email: 'anonymous@system.com' },
      });

      if (!anonymousUser) {
        anonymousUser = await manager.save(User, {
          id: 1000000000,
          email: 'anonymous@system.com',
          username: '탈퇴한 사용자',
          userType: 'patient',
          profileType: 'default',
          profileImage: 'default-anonymous.png',
          intro: '탈퇴한 사용자입니다.',
          signinProvider: 'system',
          isActive: false,
        });
      }

      // 연관된 엔티티들의 작성자를 익명 사용자로 변경
      await manager.update(
        Comment,
        { authorId: id },
        {
          authorId: anonymousUser.id,
        },
      );
      await manager.update(
        Reply,
        { authorId: id },
        {
          authorId: anonymousUser.id,
        },
      );

      // Diary 작성자를 익명 사용자로 변경
      await manager.update(
        Diary,
        { authorId: id },
        {
          authorId: anonymousUser.id,
        },
      );

      // Post 작성자를 익명 사용자로 변경
      await manager.update(
        Post,
        { authorId: id },
        {
          authorId: anonymousUser.id,
        },
      );

      // 실제로 삭제해야 하는 연관 엔티티들만 삭제
      await manager.softDelete(RefreshToken, { userId: id });
      await manager.softDelete(SurveyAnswerUser, { userId: id });
      await manager.softDelete(CancerUser, { userId: id });

      // 마지막으로 사용자 삭제
      return manager.softRemove(user);
    });
  }

  async findUsersByCancer(
    cancerId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<User>> {
    const { page = 1, limit = 10 } = paginationDto;

    const [items, totalItems] = await this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.cancerUsers', 'cancerUser')
      .where('cancerUser.cancerId = :cancerId', { cancerId })
      .andWhere('user.isPublic = :isPublic', { isPublic: true })
      .orderBy('user.createdAt', 'ASC')
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

  async findSimilarUsers(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<User>> {
    const { page = 1, limit = 10 } = paginationDto;

    // 현재 사용자의 암 ID 목록 조회
    const userCancers = await this.cancerUserRepository.find({
      where: { userId },
      select: ['cancerId'],
    });
    const cancerIds = userCancers.map((cu) => cu.cancerId);

    if (cancerIds.length === 0) {
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

    // 같은 암을 가진 다른 사용자들 조회
    const [items, totalItems] = await this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.cancerUsers', 'cancerUser')
      .innerJoin('cancerUser.cancer', 'cancer')
      .leftJoinAndSelect('user.cancerUsers', 'userCancerUsers')
      .leftJoinAndSelect('userCancerUsers.cancer', 'userCancers')
      .where('cancerUser.cancerId IN (:...cancerIds)', { cancerIds })
      .andWhere('user.id != :userId', { userId })
      .andWhere('user.isPublic = :isPublic', { isPublic: true })
      .orderBy('user.createdAt', 'ASC')
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

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOneBy({
      email,
      signinProvider: 'email',
    });
    return !!user;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const user = await this.usersRepository.findOneBy({
      username: username ?? '',
    });
    return !!user;
  }
}
