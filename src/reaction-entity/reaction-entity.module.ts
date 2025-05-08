import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactionEntity } from './entities/reaction-entity.entity';
import { ReactionEntityController } from './reaction-entity.controller';
import { ReactionEntityService } from './reaction-entity.service';
import { ReactionService } from '../reaction/reaction.service';
import { Reaction } from '../reaction/entities/reaction.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ReactionEntity, Reaction])],
  controllers: [ReactionEntityController],
  providers: [ReactionEntityService, ReactionService],
  exports: [ReactionEntityService],
})
export class ReactionEntityModule {}
