import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleImageService } from 'src/article-image/article-image.service';
import { IsNull, Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import { ArticleImage } from '../article-image/entities/article-image.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(ArticleImage)
    private readonly articleImageRepository: Repository<ArticleImage>,
    private readonly articleImageService: ArticleImageService,
  ) {}

  private stripHtmlTags(html: string): string {
    if (!html) return '';

    // HTML 엔티티를 공백으로 변환
    const withoutEntities = html
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&[a-z0-9]+;/gi, ' ');

    // HTML 태그 제거
    const withoutTags = withoutEntities.replace(/<[^>]*>/g, '');

    // 연속된 공백을 하나로 변환하고 앞뒤 공백 제거
    return withoutTags.replace(/\s+/g, ' ').trim();
  }

  private generateFilePath(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}${month}/`;
  }

  private generateFileName(originalName: string): string {
    const ext = originalName.split('.').pop();
    return `${nanoid(10)}.${ext}`;
  }

  async create(
    createArticleDto: CreateArticleDto,
    userId: number,
  ): Promise<Article> {
    const { images: articleThumbnails, ...articleData } = createArticleDto;
    const article = this.articleRepository.create({
      ...articleData,
      adminId: userId.toString(),
      isUsed: true,
    });

    const savedArticle = await this.articleRepository.save(article);

    if (articleThumbnails && articleThumbnails.length > 0) {
      // 첫 번째 이미지를 썸네일로 사용
      const thumbnailImage = articleThumbnails[0];
      const filePath = this.generateFilePath();
      const thumbnailUrl = await this.articleImageService.uploadImage(
        thumbnailImage,
        `news/photo/${filePath}`,
      );
      const fileName = thumbnailUrl
        .replace(process.env.AWS_S3_BUCKET || '', '')
        .replace(`/news/photo/${filePath}`, '');

      // 썸네일 URL 저장
      article.thumbnail = filePath + fileName;
      await this.articleRepository.save(article);

      const articleImage = this.articleImageRepository.create({
        articleId: savedArticle.id,
        fileName: fileName,
        filePath: filePath,
        imageExt: this.getImageExt(thumbnailImage.originalname),
        imageSort: 1,
        isFeatured: 'Y',
      });

      await this.articleImageRepository.save(articleImage);
    }

    return savedArticle;
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Article>> {
    const { page = 1, limit = 10, keyword } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.images', 'images')
      .where('article.deletedAt IS NULL AND article.isUsed = true');

    if (keyword) {
      queryBuilder.andWhere(
        '(article.title LIKE :keyword OR article.content LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    const [articles, total] = await queryBuilder
      .orderBy('article.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // HTML 태그 제거
    const processedArticles = articles.map((article) => ({
      ...article,
      content: this.stripHtmlTags(article.content),
    }));

    return {
      items: processedArticles,
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
    const article = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.images', 'images')
      .where('article.id = :id', { id })
      .andWhere('article.deletedAt IS NULL')
      .getOne();

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
    const article = await this.articleRepository.findOne({
      where: { id, deletedAt: undefined },
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    const { imageUpdates, deletedImageIds, ...updateData } = updateArticleDto;
    Object.assign(article, updateData);
    const savedArticle = await this.articleRepository.save(article);

    // 기존 이미지 삭제 처리
    if (deletedImageIds && deletedImageIds.length > 0) {
      for (const deletedImageId of deletedImageIds) {
        const imageToDelete = await this.articleImageRepository.findOne({
          where: { id: deletedImageId },
        });
        if (imageToDelete) {
          await this.articleImageService.deleteImage(imageToDelete.id);
          await this.articleImageRepository.remove(imageToDelete);
        }
      }
    }

    // 이미지 업데이트 처리
    if (imageUpdates && imageUpdates.length > 0) {
      for (const imageUpdate of imageUpdates) {
        if (!imageUpdate.id && images && images.length > 0) {
          const filePath = this.generateFilePath();
          const thumbnailUrl = await this.articleImageService.uploadImage(
            images[imageUpdate.order],
            `news/photo/${filePath}`,
          );
          const savedFileName = thumbnailUrl
            .replace(process.env.AWS_S3_BUCKET || '', '')
            .replace(`/news/photo/${filePath}`, '');

          const articleImage = this.articleImageRepository.create({
            articleId: savedArticle.id,
            fileName: savedFileName,
            filePath: filePath,
            imageExt: this.getImageExt(images[imageUpdate.order].originalname),
            imageSort: imageUpdate.order,
            isFeatured: imageUpdate.order === 0 ? 'Y' : 'N',
          });

          await this.articleImageRepository.save(articleImage);
        }
      }

      // 썸네일 업데이트
      const firstImage = await this.articleImageRepository.findOne({
        where: { articleId: savedArticle.id },
        order: { imageSort: 'ASC' },
      });

      if (firstImage) {
        savedArticle.thumbnail = firstImage.filePath + firstImage.fileName;
        await this.articleRepository.save(savedArticle);
      }
    }

    return savedArticle;
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
        isUsed: true,
        deletedAt: undefined,
      },
      order: {
        createdAt: 'DESC',
      },
      skip,
      take: limit,
      relations: ['images'],
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

  async findBycancerId(
    cancerId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Article>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [items, total] = await this.articleRepository.findAndCount({
      where: {
        cancerId: +cancerId,
        isUsed: true,
        deletedAt: IsNull(),
      },
      relations: ['images'],
      order: {
        createdAt: 'DESC',
      },
      skip,
      take: limit,
    });

    // HTML 태그 제거
    const processedItems = items.map((article) => ({
      ...article,
      content: this.stripHtmlTags(article.content),
    }));

    return {
      items: processedItems,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async findRandomBycancerId(
    cancerId: string,
    limit: number = 3,
  ): Promise<Article[]> {
    const articles = await this.articleRepository.find({
      where: {
        cancerId: +cancerId,
        deletedAt: IsNull(),
      },
      relations: ['images'],
      order: {
        createdAt: 'DESC',
      },
    });

    const processedArticles = articles.map((article) => ({
      ...article,
      content: this.stripHtmlTags(article.content),
    }));

    // 랜덤으로 limit 개수만큼 선택
    const shuffled = processedArticles.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  }
}
