import { Module } from '@nestjs/common';
import { SectionSecondaryService } from './section_secondary.service';
import { SectionSecondaryController } from './section_secondary.controller';

@Module({
  controllers: [SectionSecondaryController],
  providers: [SectionSecondaryService],
})
export class SectionSecondaryModule {}
