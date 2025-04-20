import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../entities/image.entity';
import { S3Service } from './s3.service';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly s3Service: S3Service,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    entityType: string,
    entityId: number,
  ): Promise<Image> {
    const url = await this.s3Service.uploadFile(file, entityType);

    const image = this.imageRepository.create({
      url,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      entityType,
      entityId,
    });

    return await this.imageRepository.save(image);
  }

  async deleteImage(id: number): Promise<void> {
    const image = await this.imageRepository.findOne({ where: { id } });
    if (!image) return;

    await this.s3Service.deleteFile(image.url);
    await this.imageRepository.softDelete(id);
  }

  async findImagesByEntity(
    entityType: string,
    entityId: number,
  ): Promise<Image[]> {
    return await this.imageRepository.find({
      where: { entityType, entityId },
    });
  }

  async deleteImagesByEntity(
    entityType: string,
    entityId: number,
  ): Promise<void> {
    const images = await this.findImagesByEntity(entityType, entityId);

    for (const image of images) {
      await this.s3Service.deleteFile(image.url);
    }

    await this.imageRepository.softDelete({ entityType, entityId });
  }
}
