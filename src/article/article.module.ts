import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleImageService } from 'src/article-image/article-image.service';
import { Image } from 'src/common/entities/image.entity';
import { ArticleImage } from '../article-image/entities/article-image.entity';
import { S3Service } from '../common/services/s3.service';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { Article } from './entities/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, ArticleImage, Image])],
  controllers: [ArticleController],
  providers: [ArticleService, ArticleImageService, S3Service],
})
export class ArticleModule {}
