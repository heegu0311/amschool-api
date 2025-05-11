import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateSectionSecondaryDto } from './dto/create-section_secondary.dto';
import { UpdateSectionSecondaryDto } from './dto/update-section_secondary.dto';
import { SectionSecondaryService } from './section_secondary.service';

@Controller('section-secondary')
export class SectionSecondaryController {
  constructor(
    private readonly sectionSecondaryService: SectionSecondaryService,
  ) {}

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
  update(
    @Param('id') id: string,
    @Body() updateSectionSecondaryDto: UpdateSectionSecondaryDto,
  ) {
    return this.sectionSecondaryService.update(+id, updateSectionSecondaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionSecondaryService.remove(+id);
  }
}
