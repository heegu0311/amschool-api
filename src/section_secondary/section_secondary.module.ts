import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionSecondary } from './entities/section_secondary.entity';
import { SectionSecondaryController } from './section_secondary.controller';
import { SectionSecondaryService } from './section_secondary.service';

@Module({
  imports: [TypeOrmModule.forFeature([SectionSecondary])],
  controllers: [SectionSecondaryController],
  providers: [SectionSecondaryService],
})
export class SectionSecondaryModule {}
