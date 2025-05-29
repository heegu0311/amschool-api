import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactionEntityModule } from 'src/reaction-entity/reaction-entity.module';
import { Comment } from '../entities/comment.entity';
import { Reply } from './entities/reply.entity';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { Notification } from '../../notification/entities/notification.entity';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reply, Comment, Notification]),
    ReactionEntityModule,
  ],
  controllers: [ReplyController],
  providers: [ReplyService, NotificationService],
})
export class ReplyModule {}
