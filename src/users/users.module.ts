import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { CancerUser } from '../cancer-user/entities/cancer-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, CancerUser])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
