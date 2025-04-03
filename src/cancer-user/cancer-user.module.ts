import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CancerUserService } from './cancer-user.service';
import { CancerUser } from './entities/cancer-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CancerUser])],
  providers: [CancerUserService],
  exports: [CancerUserService],
})
export class CancerUserModule {}
