import { Module } from '@nestjs/common';
import { SectionPrimaryService } from './section_primary.service';
import { SectionPrimaryController } from './section_primary.controller';

@Module({
  controllers: [SectionPrimaryController],
  providers: [SectionPrimaryService],
})
export class SectionPrimaryModule {}
