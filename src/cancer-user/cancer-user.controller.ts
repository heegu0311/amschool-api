import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CancerUserService } from './cancer-user.service';
import { CreateCancerUserDto } from './dto/create-cancer-user.dto';
import { UpdateCancerUserDto } from './dto/update-cancer-user.dto';

@Controller('cancer-user')
export class CancerUserController {
  constructor(private readonly cancerUserService: CancerUserService) {}

  @Post()
  create(@Body() createCancerUserDto: CreateCancerUserDto) {
    return this.cancerUserService.create(createCancerUserDto);
  }

  @Get()
  findAll() {
    return this.cancerUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cancerUserService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCancerUserDto: UpdateCancerUserDto,
  ) {
    return this.cancerUserService.update(+id, updateCancerUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cancerUserService.remove(+id);
  }
}
