import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CancerService } from './cancer.service';
import { CreateCancerDto } from './dto/create-cancer.dto';
import { UpdateCancerDto } from './dto/update-cancer.dto';

@Controller('cancer')
export class CancerController {
  constructor(private readonly cancerService: CancerService) {}

  @Post()
  create(@Body() createCancerDto: CreateCancerDto) {
    return this.cancerService.create(createCancerDto);
  }

  @Get()
  findAll() {
    return this.cancerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cancerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCancerDto: UpdateCancerDto) {
    return this.cancerService.update(+id, updateCancerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cancerService.remove(+id);
  }
}
