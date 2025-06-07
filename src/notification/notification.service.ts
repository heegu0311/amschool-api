import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationReadDto } from './dto/update-notification-read.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  // 알림 생성 메서드 수정
  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = new Notification();
    Object.assign(notification, {
      type: createNotificationDto.type,
      receiverUserId: createNotificationDto.receiverUserId,
      senderUserId: createNotificationDto.senderUserId,
      targetId: createNotificationDto.targetId,
      targetType: createNotificationDto.targetType,
      entityId: createNotificationDto.entityId,
      entityType: createNotificationDto.entityType,
      isRead: createNotificationDto.isRead,
      createdAt: new Date(),
    });

    return this.notificationRepository.save(notification);
  }

  // async findAll(
  //   userId: number,
  //   paginationDto: PaginationDto,
  // ): Promise<PaginatedResponse<Notification>> {
  //   const { page = 1, limit = 10 } = paginationDto;
  //   const oneMonthAgo = dayjs().subtract(1, 'month').toDate();

  //   const [items, totalItems] = await this.notificationRepository.findAndCount({
  //     where: {
  //       userId: userId,
  //       createdAt: MoreThanOrEqual(oneMonthAgo),
  //     },
  //     order: {
  //       createdAt: 'DESC',
  //     },
  //     skip: (page - 1) * limit,
  //     take: limit,
  //   });

  //   return {
  //     items,
  //     meta: {
  //       totalItems,
  //       itemCount: items.length,
  //       itemsPerPage: limit,
  //       totalPages: Math.ceil(totalItems / limit),
  //       currentPage: page,
  //     },
  //   };
  // }

  // 파티셔닝 성능 비교를 위한 예시 쿼리

  // 파티셔닝 키(createdAt)를 사용하지 않는 쿼리 (파티션 프루닝 효과 제한적)
  async findAllUserNotificationsWithoutPartitionKey(
    userId: number,
  ): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: {
        receiverUserId: userId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // 파티셔닝 키(createdAt)를 사용하는 쿼리 (파티션 프루닝 유도)
  async findAllUserNotificationsWithPartitionKey(
    userId: number,
    sinceDate: Date,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Notification>> {
    const { page = 1, limit = 10 } = paginationDto;

    const [items, totalItems] = await this.notificationRepository.findAndCount({
      where: {
        receiverUserId: userId,
        createdAt: MoreThanOrEqual(sinceDate),
      },
      relations: ['sender'],
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
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

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    console.log(updateNotificationDto);
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }

  // 과거 한 달 알림 조회 메서드
  async getPastMonthNotifications(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Notification>> {
    const { page = 1, limit = 10 } = paginationDto;
    const oneMonthAgo = dayjs().subtract(1, 'month').toDate();

    const [items, totalItems] = await this.notificationRepository.findAndCount({
      where: {
        receiverUserId: userId,
        createdAt: MoreThanOrEqual(oneMonthAgo),
      },
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
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

  async updateReadStatus(
    id: number,
    updateNotificationReadDto: UpdateNotificationReadDto,
  ): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`알림을 찾을 수 없습니다. (ID: ${id})`);
    }

    notification.isRead = updateNotificationReadDto.isRead;
    return await this.notificationRepository.save(notification);
  }

  // 최근 30일간의 읽지 않은 알림 수 조회
  async getUnreadNotificationCount(userId: number): Promise<number> {
    const thirtyDaysAgo = dayjs().subtract(30, 'day').toDate();

    return await this.notificationRepository.count({
      where: {
        receiverUserId: userId,
        isRead: false,
        createdAt: MoreThanOrEqual(thirtyDaysAgo),
      },
    });
  }
}
