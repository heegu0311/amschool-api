import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CancerService } from './cancer.service';
import { CancerController } from './cancer.controller';
import { Cancer } from './entities/cancer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cancer])],
  controllers: [CancerController],
  providers: [CancerService],
  exports: [CancerService],
})
export class CancerModule {}
