import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ example: 'comment' })
  @IsString()
  type: string;

  @ApiProperty({ example: 100000000 })
  @IsNumber()
  receiverUserId: number;

  @ApiProperty({ example: 100000000 })
  @IsNumber()
  senderUserId: number;

  @ApiProperty({
    example: '1',
    nullable: true,
  })
  @IsString()
  targetId: number;

  @ApiProperty({
    example: 'comment',
  })
  targetType: 'diary' | 'post' | 'comment' | 'reply';

  @ApiProperty({
    example: '1',
  })
  @IsString()
  entityId: number;

  @ApiProperty({
    example: 'comment',
  })
  entityType: 'diary' | 'post' | 'comment' | 'reply';

  @ApiProperty({ example: false })
  @IsBoolean()
  isRead: boolean;
}
