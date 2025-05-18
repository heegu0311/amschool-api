import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from '../diary/entities/diary.entity';
import { ReactionEntityModule } from '../reaction-entity/reaction-entity.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { Reply } from './reply/entities/reply.entity';
import { ReplyModule } from './reply/reply.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Diary, Reply]),
    ReplyModule,
    ReactionEntityModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
