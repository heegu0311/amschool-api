import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { CancerUserService } from 'src/cancer-user/cancer-user.service';
import { Image } from 'src/common/entities/image.entity';
import { ImageService } from 'src/common/services/image.service';
import { Notification } from 'src/notification/entities/notification.entity';
import { Question } from 'src/question/entities/question.entity';
import { SurveyAnswerUserService } from 'src/survey-answer-user/survey-answer-user.service';
import { IsNull, Repository } from 'typeorm';
import { RefreshToken } from '../auth/entities/refresh-token.entity';
import { CancerUser } from '../cancer-user/entities/cancer-user.entity';
import { Comment } from '../comment/entities/comment.entity';
import { Reply } from '../comment/reply/entities/reply.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { Diary } from '../diary/entities/diary.entity';
import { Post } from '../post/entities/post.entity';
import { SurveyAnswerUser } from '../survey-answer-user/entities/survey-answer-user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    Object.assign(user, createUserDto);
    const savedUser = await this.usersRepository.save(user);

    if (createUserDto.cancerIds?.length > 0) {
      await Promise.all(
        createUserDto.cancerIds.map((cancerId) =>
          this.cancerUserService.create({
            userId: savedUser.id,
            cancerId,
          }),
        ),
      );
    }

    if (createUserDto.surveyAnswers?.length > 0) {
      await Promise.all(
        createUserDto.surveyAnswers.map((surveyAnswerId) =>
          this.surveyAnswerUserService.create(savedUser.id, surveyAnswerId),
        ),
      );
    }

    const userAfterCreation = await this.findOne(savedUser.id);
    if (!userAfterCreation) throw new Error('User not found after creation');
    return userAfterCreation;
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find({
      relations: ['cancerUsers', 'cancerUsers.cancer', 'surveyAnswerUsers'],
    });
    return plainToInstance(User, users, { excludeExtraneousValues: true });
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['cancerUsers', 'cancerUsers.cancer', 'surveyAnswerUsers'],
    });
    return user
      ? plainToInstance(User, user, { excludeExtraneousValues: true })
      : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['cancerUsers', 'cancerUsers.cancer', 'surveyAnswerUsers'],
    });
    return user
      ? plainToInstance(User, user, { excludeExtraneousValues: true })
      : null;
  }

  async findByEmailAndProvider(
    email: string,
    provider: string,
  ): Promise<User[]> {
    const users = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.cancerUsers', 'cancerUsers')
      .leftJoinAndSelect('cancerUsers.cancer', 'cancer')
      .leftJoinAndSelect('user.surveyAnswerUsers', 'surveyAnswerUsers')
      .addSelect('user.password') // password 컬럼 명시적 select
      .andWhere('user.email = :email', { email })
      .andWhere('user.signinProvider = :provider', { provider })
      .withDeleted()
      .getMany();

    return users;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    images?: Express.Multer.File[],
  ): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      return null;
    }

    const { cancerIds, surveyAnswers, ...rest } = updateUserDto;
    const updateData = Object.entries(rest).reduce<Partial<User>>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value as User[keyof User];
        }
        return acc;
      },
      {},
    );

    if (cancerIds) {
      const existingCancerUsers = await this.cancerUserService.findByUserId(id);
      await Promise.all(
        existingCancerUsers.map((cu) => this.cancerUserService.delete(cu.id)),
      );

      if (cancerIds.length > 0) {
        await Promise.all(
          cancerIds.map((cancerId) =>
            this.cancerUserService.create({
              userId: id,
              cancerId,
            }),
          ),
        );
      }
    }

    if (surveyAnswers && surveyAnswers?.length > 0) {
      const existingAnswers =
        await this.surveyAnswerUserService.findByUserId(id);
      await Promise.all(
        existingAnswers.map((answer) =>
          this.surveyAnswerUserService.delete(id, answer.surveyAnswerId),
        ),
      );

      await Promise.all(
        surveyAnswers.map((answerId) =>
          this.surveyAnswerUserService.create(id, answerId),
        ),
      );
    }

    if (images && images.length > 0) {
      const image = images[0];
      const uploadedImageUrl = await this.imageService.uploadImage(
        image,
        'user',
      );
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
    return this.findOne(id);
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
          profileImage: '',
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

      // Question 작성자를 익명 사용자로 변경
      await manager.update(
        Question,
        { authorId: id },
        {
          authorId: anonymousUser.id,
        },
      );

      // Notification sender를 익명 사용자로 변경
      await manager.delete(Notification, { senderUserId: id });

      // 실제로 삭제해야 하는 연관 엔티티들만 삭제
      await manager.delete(RefreshToken, { userId: id });
      await manager.delete(SurveyAnswerUser, { userId: id });
      await manager.delete(CancerUser, { userId: id });

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
      .leftJoinAndSelect('user.cancerUsers', 'cancerUser')
      .leftJoinAndSelect('cancerUser.cancer', 'cancer')
      .leftJoinAndSelect('user.surveyAnswerUsers', 'surveyAnswerUser')
      .where('cancerUser.cancerId = :cancerId', { cancerId })
      .andWhere('user.isPublic = :isPublic', { isPublic: true })
      .orderBy('user.createdAt', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const transformedItems = plainToInstance(User, items, {
      excludeExtraneousValues: true,
    });

    return {
      items: transformedItems,
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

    const userCancers = await this.cancerUserRepository.find({
      where: { userId },
      relations: ['cancer'],
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

    const [items, totalItems] = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.cancerUsers', 'cancerUser')
      .leftJoinAndSelect('cancerUser.cancer', 'cancer')
      .leftJoinAndSelect('user.surveyAnswerUsers', 'surveyAnswerUser')
      .where('cancerUser.cancerId IN (:...cancerIds)', { cancerIds })
      .andWhere('user.id != :userId', { userId })
      .andWhere('user.isPublic = :isPublic', { isPublic: true })
      .orderBy('user.createdAt', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const transformedItems = plainToInstance(User, items, {
      excludeExtraneousValues: true,
    });

    return {
      items: transformedItems,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  async existsByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .withDeleted()
      .where('user.email = :email', { email })
      .andWhere('user.signinProvider = :provider', { provider: 'email' })
      .getOne();

    return user;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const user = await this.usersRepository.findOneBy({
      username: username ?? '',
    });
    return !!user;
  }
}
