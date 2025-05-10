import { Module } from '@nestjs/common';
import { ArticleImageService } from './article-image.service';
import { ArticleImage } from './entities/article-image.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from 'src/common/services/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleImage])],
  controllers: [],
  providers: [ArticleImageService, S3Service],
  exports: [ArticleImageService],
})
export class ArticleImageModule {}
