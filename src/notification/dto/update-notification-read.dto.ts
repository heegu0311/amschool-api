import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateNotificationReadDto {
  @ApiProperty({
    example: true,
    description: '알림 읽음 상태',
  })
  @IsBoolean()
  isRead: boolean;
}
