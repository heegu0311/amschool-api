import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

// entity_type에 허용되는 값 정의
export enum NotificationEntityType {
  DIARY = 'diary',
  POST = 'post',
  COMMENT = 'comment',
  REPLY = 'reply',
}

@Entity('notification')
export class Notification {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ example: 'new_comment' })
  @Column('varchar', { length: 255, name: 'type' })
  type: string;

  @ApiProperty({ example: 100000000 })
  @Column({ name: 'receiver_user_id' })
  receiverUserId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiver_user_id' })
  receiver: Relation<User>;

  @ApiProperty({ example: 100000000 })
  @Column({ name: 'sender_user_id' })
  senderUserId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_user_id' })
  sender: Relation<User>;

  @ApiProperty({
    example: 0,
  })
  @Column('varchar', { length: 36, nullable: true, name: 'target_id' })
  targetId: number;

  @Column({
    name: 'target_type',
  })
  targetType: 'diary' | 'post' | 'comment' | 'reply';

  @ApiProperty({
    example: 0,
  })
  @Column('varchar', { length: 36, nullable: true, name: 'entity_id' })
  entityId: number;

  @ApiProperty({
    example: 'comment',
  })
  @Column({
    name: 'entity_type',
  })
  entityType: 'diary' | 'post' | 'comment' | 'reply';

  @ApiProperty({ example: false })
  @Column({ default: false, name: 'is_read' })
  isRead: boolean;

  @ApiProperty({ example: '2023-10-27T10:00:00.000Z' })
  @PrimaryColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @ApiProperty({ example: '2023-10-27T10:30:00.000Z' })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ example: null, nullable: true })
  @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt: Date | null;
}
