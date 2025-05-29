import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { Reply } from 'src/comment/reply/entities/reply.entity';
import { Diary } from 'src/diary/entities/diary.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { NotificationService } from 'src/notification/notification.service';
import { Post } from 'src/post/entities/post.entity';
import { Reaction } from '../reaction/entities/reaction.entity';
import { ReactionService } from '../reaction/reaction.service';
import { ReactionEntity } from './entities/reaction-entity.entity';
import { ReactionEntityController } from './reaction-entity.controller';
import { ReactionEntityService } from './reaction-entity.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReactionEntity,
      Reaction,
      Notification,
      Diary,
      Post,
      Comment,
      Reply,
    ]),
  ],
  controllers: [ReactionEntityController],
  providers: [ReactionEntityService, ReactionService, NotificationService],
  exports: [ReactionEntityService],
})
export class ReactionEntityModule {}
