import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './entities/comment.entity';
import { Diary } from '../diary/entities/diary.entity';
import { ReplyModule } from './reply/reply.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Diary]), ReplyModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
