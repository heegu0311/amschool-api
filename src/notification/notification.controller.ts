import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import dayjs from 'dayjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationReadDto } from './dto/update-notification-read.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';
import { PartitionScheduler } from './partition.scheduler';

@Controller('notifications')
@ApiTags('Notification')
@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly partitionScheduler: PartitionScheduler,
  ) {}

  @Post()
  @ApiOperation({ summary: '새 알림 생성' })
  @ApiCreatedResponse({
    description: '알림이 성공적으로 생성됨',
    type: Notification,
  })
  @ApiResponse({ status: 400, description: '잘못된 요청 본문' })
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return await this.notificationService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 알림 조회 (인증된 사용자)' })
  @ApiOkResponse({ description: '알림 목록 반환', type: [Notification] })
  @ApiBearerAuth('accessToken')
  async findAll(@Req() req, @Query() paginationDto: PaginationDto) {
    const userId = req.user.id;
    const oneMonthAgo = dayjs().subtract(1, 'month').toDate();
    return await this.notificationService.findAllUserNotificationsWithPartitionKey(
      userId,
      oneMonthAgo,
      paginationDto,
    );
  }

  @Get('/past-month')
  @ApiOperation({ summary: '과거 한 달 알림 조회 (인증된 사용자)' })
  @ApiOkResponse({
    description: '과거 한 달 알림 목록 반환',
    type: [Notification],
  })
  async getPastMonthNotifications(
    @Req() req,
    @Query() paginationDto: PaginationDto,
  ) {
    const userId = req.user.id;
    const oneMonthAgo = dayjs().subtract(1, 'month').toDate();
    return await this.notificationService.findAllUserNotificationsWithPartitionKey(
      userId,
      oneMonthAgo,
      paginationDto,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 알림 조회 (ID)' })
  @ApiParam({ name: 'id', description: '알림 ID', type: String })
  @ApiOkResponse({ description: '알림 상세 정보 반환', type: Notification })
  @ApiResponse({ status: 404, description: '알림을 찾을 수 없음' })
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '알림 업데이트 (ID)' })
  @ApiParam({ name: 'id', description: '알림 ID', type: String })
  @ApiOkResponse({
    description: '알림이 성공적으로 업데이트됨',
    type: Notification,
  })
  @ApiResponse({ status: 400, description: '잘못된 요청 본문' })
  @ApiResponse({ status: 404, description: '알림을 찾을 수 없음' })
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '알림 삭제 (ID)' })
  @ApiParam({ name: 'id', description: '알림 ID', type: String })
  @ApiOkResponse({ description: '알림이 성공적으로 삭제됨' })
  @ApiResponse({ status: 404, description: '알림을 찾을 수 없음' })
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }

  @Get('/test/add-partition')
  @ApiOperation({ summary: '[개발용] 다음 달 파티션 수동 생성' })
  @ApiOkResponse({ description: '파티션 추가 시도 결과 메시지' })
  async testAddPartition() {
    await this.partitionScheduler.handleMonthlyPartitionCreation();
    return { message: 'Attempted to add next month notification partition.' };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: '알림 읽음 상태 업데이트' })
  @ApiParam({ name: 'id', description: '알림 ID', type: Number })
  @ApiOkResponse({
    description: '알림 읽음 상태가 성공적으로 업데이트됨',
    type: Notification,
  })
  @ApiResponse({ status: 400, description: '잘못된 요청 본문' })
  @ApiResponse({ status: 404, description: '알림을 찾을 수 없음' })
  async updateReadStatus(
    @Param('id') id: string,
    @Body() updateNotificationReadDto: UpdateNotificationReadDto,
  ) {
    return await this.notificationService.updateReadStatus(
      +id,
      updateNotificationReadDto,
    );
  }

  @Get('unread/count')
  @ApiOperation({ summary: '최근 30일간의 읽지 않은 알림 수 조회' })
  @ApiOkResponse({ description: '읽지 않은 알림 수 반환', type: Number })
  async getUnreadNotificationCount(@Req() req) {
    const userId = req.user.id;
    return await this.notificationService.getUnreadNotificationCount(userId);
  }
}
