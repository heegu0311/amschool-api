import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { EntityType } from '../../comment/entities/comment.entity';

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
    example: EntityType.COMMENT,
    enum: EntityType,
    nullable: true,
  })
  @IsEnum(EntityType)
  targetType: EntityType;

  @ApiProperty({
    example: '1',
    nullable: true,
  })
  @IsString()
  entityId: number;

  @ApiProperty({
    example: EntityType.COMMENT,
    enum: EntityType,
    nullable: true,
  })
  @IsEnum(EntityType)
  entityType: EntityType;

  @ApiProperty({ example: false })
  @IsBoolean()
  isRead: boolean;
}
