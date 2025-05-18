import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactionEntityModule } from 'src/reaction-entity/reaction-entity.module';
import { Comment } from '../entities/comment.entity';
import { Reply } from './entities/reply.entity';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reply, Comment]), ReactionEntityModule],
  controllers: [ReplyController],
  providers: [ReplyService],
})
export class ReplyModule {}
