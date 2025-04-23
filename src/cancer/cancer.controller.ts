import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { CancerService } from './cancer.service';
import { Cancer } from './entities/cancer.entity';

@ApiTags('cancers')
@Controller('cancers')
export class CancerController {
  constructor(private readonly cancerService: CancerService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '모든 암 종류 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '암 종류 목록 조회 성공',
    type: [Cancer],
  })
  findAll() {
    return this.cancerService.findAll();
  }
}
