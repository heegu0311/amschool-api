import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/notification/entities/notification.entity';
import { NotificationService } from 'src/notification/notification.service';
import { Post } from 'src/post/entities/post.entity';
import { Diary } from '../diary/entities/diary.entity';
import { ReactionEntityModule } from '../reaction-entity/reaction-entity.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { Reply } from './reply/entities/reply.entity';
import { ReplyModule } from './reply/reply.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Diary, Post, Reply, Notification]),
    ReplyModule,
    ReactionEntityModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, NotificationService],
  exports: [CommentService],
})
export class CommentModule {}
