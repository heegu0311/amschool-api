import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from 'src/common/services/s3.service';
import { Repository } from 'typeorm';
import { ArticleImage } from './entities/article-image.entity';

@Injectable()
export class ArticleImageService {
  constructor(
    @InjectRepository(ArticleImage)
    private readonly articleImageRepository: Repository<ArticleImage>,
    private readonly s3Service: S3Service,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    entityType: string,
  ): Promise<string> {
    const filePath = await this.s3Service.uploadFile(file, entityType);

    return filePath;
  }

  async deleteImage(id: number): Promise<void> {
    const image = await this.articleImageRepository.findOne({ where: { id } });
    if (!image) return;

    await this.s3Service.deleteFile(image.filePath);
    await this.articleImageRepository.softDelete(id);
  }

  async findImagesByEntity(articleId: number): Promise<ArticleImage[]> {
    const images = await this.articleImageRepository.find({
      where: { articleId },
    });
    return images;
  }

  async deleteImagesByEntity(articleId: number): Promise<void> {
    const images = await this.findImagesByEntity(articleId);

    for (const image of images) {
      await this.s3Service.deleteFile(image.filePath);
    }

    await this.articleImageRepository.softDelete({ articleId });
  }
}
