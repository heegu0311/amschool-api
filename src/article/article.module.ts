import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { ArticleImage } from 'src/article-image/entities/article-image.entity';
import { S3Service } from 'src/common/services/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([Article, ArticleImage])],
  controllers: [ArticleController],
  providers: [ArticleService, S3Service],
})
export class ArticleModule {}
