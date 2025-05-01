import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactionEntity } from './entities/reaction-entity.entity';
import { ReactionEntityController } from './reaction-entity.controller';
import { ReactionEntityService } from './reaction-entity.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReactionEntity])],
  controllers: [ReactionEntityController],
  providers: [ReactionEntityService],
  exports: [ReactionEntityService],
})
export class ReactionEntityModule {}
