import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { Reply } from './entities/reply.entity';
import { Comment } from '../entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reply, Comment])],
  controllers: [ReplyController],
  providers: [ReplyService],
})
export class ReplyModule {}
