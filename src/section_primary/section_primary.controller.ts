import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SectionPrimaryService } from './section_primary.service';
import { CreateSectionPrimaryDto } from './dto/create-section_primary.dto';
import { UpdateSectionPrimaryDto } from './dto/update-section_primary.dto';

@Controller('section-primary')
export class SectionPrimaryController {
  constructor(private readonly sectionPrimaryService: SectionPrimaryService) {}

  @Post()
  create(@Body() createSectionPrimaryDto: CreateSectionPrimaryDto) {
    return this.sectionPrimaryService.create(createSectionPrimaryDto);
  }

  @Get()
  findAll() {
    return this.sectionPrimaryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionPrimaryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSectionPrimaryDto: UpdateSectionPrimaryDto,
  ) {
    return this.sectionPrimaryService.update(+id, updateSectionPrimaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectionPrimaryService.remove(+id);
  }
}
