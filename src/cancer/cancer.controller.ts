import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { CancerService } from './cancer.service';

@ApiTags('cancers')
@Controller('cancers')
export class CancerController {
  constructor(private readonly cancerService: CancerService) {}

  @Public()
  @Get()
  findAll() {
    return this.cancerService.findAll();
  }
}
