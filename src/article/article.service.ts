import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { ArticleImage } from '../article-image/entities/article-image.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(ArticleImage)
    private readonly articleImageRepository: Repository<ArticleImage>,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    userId: number,
    images?: Express.Multer.File[],
  ): Promise<Article> {
    const { images: _, ...articleData } = createArticleDto;
    const article = this.articleRepository.create({
      ...articleData,
      adminId: userId.toString(),
    });

    const savedArticle = await this.articleRepository.save(article);

    if (images && images.length > 0) {
      const articleImages = images.map((image, index) => {
        return this.articleImageRepository.create({
          articleId: savedArticle.id,
          fileName: image.originalname,
          filePath: image.path,
          imageExt: this.getImageExt(image.originalname),
          imageSort: index + 1,
          isFeatured: index === 0 ? 'Y' : 'N',
        });
      });
      await this.articleImageRepository.save(articleImages);
    }

    return savedArticle;
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Article>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [articles, total] = await this.articleRepository.findAndCount({
      where: {
        deletedAt: undefined,
      },
      order: {
        createdAt: 'DESC',
      },
      skip,
      take: limit,
      relations: ['sectionPrimary', 'sectionSecondary', 'images'],
    });

    return {
      items: articles,
      meta: {
        totalItems: total,
        itemCount: articles.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id, deletedAt: undefined },
      relations: ['sectionPrimary', 'sectionSecondary', 'images'],
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    return article;
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
    images?: Express.Multer.File[],
  ): Promise<Article> {
    const article = await this.findOne(id);

    if (images && images.length > 0) {
      // 기존 이미지 삭제
      await this.articleImageRepository.delete({ articleId: id });

      // 새 이미지 추가
      const articleImages = images.map((image, index) => {
        return this.articleImageRepository.create({
          articleId: id,
          fileName: image.originalname,
          filePath: image.path,
          imageExt: this.getImageExt(image.originalname),
          imageSort: index + 1,
          isFeatured: index === 0 ? 'Y' : 'N',
        });
      });
      await this.articleImageRepository.save(articleImages);
    }

    // 이미지 필드 제외하고 업데이트
    const { images: _, ...updateData } = updateArticleDto;
    Object.assign(article, updateData);

    return await this.articleRepository.save(article);
  }

  async delete(id: number): Promise<void> {
    const article = await this.findOne(id);
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    // 이미지 삭제
    await this.articleImageRepository.delete({ articleId: id });

    // 기사 soft delete
    await this.articleRepository.softRemove(article);
  }

  async findByAuthorId(
    authorId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Article>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [articles, total] = await this.articleRepository.findAndCount({
      where: {
        author: authorId,
        deletedAt: undefined,
      },
      order: {
        createdAt: 'DESC',
      },
      skip,
      take: limit,
      relations: ['sectionPrimary', 'sectionSecondary', 'images'],
    });

    return {
      items: articles,
      meta: {
        totalItems: total,
        itemCount: articles.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  private getImageExt(filename: string): 'J' | 'G' | 'P' | 'B' | 'S' {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'J';
      case 'gif':
        return 'G';
      case 'png':
        return 'P';
      case 'bmp':
        return 'B';
      case 'svg':
        return 'S';
      default:
        return 'J';
    }
  }
}
