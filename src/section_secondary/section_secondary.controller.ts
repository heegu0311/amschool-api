import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SectionSecondaryService } from './section_secondary.service';
import { CreateSectionSecondaryDto } from './dto/create-section_secondary.dto';
import { UpdateSectionSecondaryDto } from './dto/update-section_secondary.dto';

@Controller('section-secondary')
export class SectionSecondaryController {
  constructor(private readonly sectionSecondaryService: SectionSecondaryService) {}

  @Post()
  create(@Body() createSectionSecondaryDto: CreateSectionSecondaryDto) {
    return this.sectionSecondaryService.create(createSectionSecondaryDto);
  }

  @Get()
  findAll() {
    return this.sectionSecondaryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionSecondaryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSectionSecondaryDto: UpdateSectionSecondaryDto) {
    return this.sectionSecondaryService.update(+id, updateSectionSecondaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionSecondaryService.remove(+id);
  }
}
