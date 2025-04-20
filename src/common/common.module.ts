import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from './services/s3.service';
import { ImageService } from './services/image.service';
import { Image } from './entities/image.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Image])],
  providers: [S3Service, ImageService],
  exports: [S3Service, ImageService],
})
export class CommonModule {}
