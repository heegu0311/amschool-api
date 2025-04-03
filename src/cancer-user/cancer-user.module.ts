import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CancerUserService } from './cancer-user.service';
import { CancerUserController } from './cancer-user.controller';
import { CancerUser } from './entities/cancer-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CancerUser])],
  controllers: [CancerUserController],
  providers: [CancerUserService],
  exports: [CancerUserService],
})
export class CancerUserModule {}
