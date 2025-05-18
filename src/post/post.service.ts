import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { Image } from '../common/entities/image.entity';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { ImageService } from '../common/services/image.service';
import { ReactionEntityService } from '../reaction-entity/reaction-entity.service';
import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostCategory, PostPaginationDto } from './dto/post-pagination.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    private readonly usersService: UsersService,
    private readonly imageService: ImageService,
    private readonly reactionEntityService: ReactionEntityService,
  ) {}

  async create(
    userId: number,
    createPostDto: CreatePostDto,
    images?: Express.Multer.File[],
  ) {
    const post = this.postRepository.create({
      authorId: userId,
      ...createPostDto,
    });
    const savedPost = await this.postRepository.save(post);

    if (images && images.length > 0) {
      const imageEntities = await Promise.all(
        images.map(async (image, index) => {
          const uploadedImageUrl = await this.imageService.uploadImage(
            image,
            'post',
          );

          return this.imageRepository.create({
            url: uploadedImageUrl,
            originalName: image.originalname,
            mimeType: image.mimetype,
            size: image.size,
            entityType: 'post',
            entityId: savedPost.id,
            order: index,
          });
        }),
      );

      await this.imageRepository.save(imageEntities);
    }

    return savedPost;
  }

  async findAllWithMoreInfo(
    paginationDto: PostPaginationDto,
    userId?: number,
  ): Promise<PaginatedResponse<Post>> {
    const { page = 1, limit = 10, category } = paginationDto;

    const where = category === PostCategory.ALL ? {} : { category };

    const [items, totalItems] = await this.postRepository.findAndCount({
      where,
      relations: ['author', 'images', 'comments'],
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // 다이어리 ID 목록 추출
    const postIds = items.map((post) => post.id);

    // 여러 다이어리의 공감을 한 번에 조회
    const postReactions =
      await this.reactionEntityService.getReactionsForMultipleEntities(
        'post',
        postIds,
        userId,
      );

    // 공감 정보를 각 엔티티에 매핑
    const postsWithReactions = items.map((post) => {
      const postWithReactions = {
        ...post,
        reactions: postReactions[post.id]?.reactions || [],
        userReactions: postReactions[post.id]?.userReactions || [],
        commentsCount: post.comments.length,
      };
      return postWithReactions;
    });
    return {
      items: postsWithReactions,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  async findOne(id: number, userId?: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['images'],
    });

    if (post?.accessLevel === 'private' && post?.authorId !== userId) {
      throw new NotFoundException(`Post #${id} has private type`);
    }

    if (post?.accessLevel === 'member' && !userId) {
      throw new NotFoundException(`Post #${id} has member type`);
    }

    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    return post;
  }

  async findOneWithMoreInfo(id: number, userId?: number): Promise<Post> {
    // 조회수 증가
    await this.postRepository.increment({ id }, 'viewCount', 1);

    const post = await this.postRepository.findOne({
      where: { id },
      relations: [
        'author',
        'author.cancerUsers',
        'author.cancerUsers.cancer',
        'images',
        'comments',
      ],
    });

    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    if (post.accessLevel === 'private' && post.authorId !== userId) {
      throw new NotFoundException(`Post #${id} has private type`);
    }

    if (post.accessLevel === 'member' && !userId) {
      throw new NotFoundException(`Post #${id} has member type`);
    }

    // 이전글/다음글 조회
    const [prevPost, nextPost] = await Promise.all([
      this.findPrevPost(id),
      this.findNextPost(id),
    ]);

    // 다이어리 공감 조회
    const postReactions =
      await this.reactionEntityService.getReactionsForMultipleEntities(
        'post',
        [post.id],
        userId,
      );

    // 댓글 ID 목록 추출
    const commentIds = post.comments.map((comment) => comment.id);

    // 공감 정보를 엔티티에 매핑
    const postWithReactions = {
      ...post,
      reactions: postReactions[post.id]?.reactions || [],
      userReactions: postReactions[post.id]?.userReactions || [],
      commentsCount: commentIds.length,
      prevPost,
      nextPost,
    };

    return postWithReactions;
  }

  // 이전글 조회
  private async findPrevPost(currentPostId: number) {
    return this.postRepository
      .createQueryBuilder('post')
      .select(['post.id', 'post.title', 'post.createdAt'])
      .where('post.id < :currentPostId', { currentPostId })
      .andWhere('post.deletedAt IS NULL')
      .orderBy('post.id', 'DESC')
      .limit(1)
      .getOne();
  }

  // 다음글 조회
  private async findNextPost(currentPostId: number) {
    return this.postRepository
      .createQueryBuilder('post')
      .select(['post.id', 'post.title', 'post.createdAt'])
      .where('post.id > :currentPostId', { currentPostId })
      .andWhere('post.deletedAt IS NULL')
      .orderBy('post.id', 'ASC')
      .limit(1)
      .getOne();
  }

  async update(
    id: number,
    userId: number,
    updatePostDto: UpdatePostDto,
    images?: Express.Multer.File[],
  ) {
    const post = await this.findOne(id, userId);

    if (post.authorId !== userId) {
      throw new UnauthorizedException('자신의 일지만 수정할 수 있습니다.');
    }

    Object.assign(post, updatePostDto);
    await this.postRepository.save(post);

    // 기존 이미지 삭제 처리
    if (
      updatePostDto.deletedImageIds &&
      updatePostDto.deletedImageIds.length > 0
    ) {
      for (const deletedImageId of updatePostDto.deletedImageIds) {
        const imageToDelete = await this.imageRepository.findOne({
          where: { id: deletedImageId },
        });
        if (imageToDelete) {
          await this.imageService.deleteImage(imageToDelete.id);
          await this.imageRepository.remove(imageToDelete);
        }
      }
    }

    // 이미지 업데이트 처리
    if (updatePostDto.imageUpdates && updatePostDto.imageUpdates.length > 0) {
      // 기존 이미지 업데이트 처리
      for (const imageUpdate of updatePostDto.imageUpdates) {
        if (imageUpdate.id) {
          // 기존 이미지 업데이트
          const existingImage = await this.imageRepository.findOne({
            where: { id: imageUpdate.id },
          });
          if (existingImage) {
            existingImage.order = imageUpdate.order;
            await this.imageRepository.save(existingImage);
          }
        } else {
          // 신규 이미지 업로드 처리
          if (images && images.length > 0) {
            if (!imageUpdate || imageUpdate.id) continue; // 기존 이미지는 건너뛰기

            const uploadedImageUrl = await this.imageService.uploadImage(
              images[imageUpdate.order],
              'post',
            );

            const imageEntity = this.imageRepository.create({
              url: uploadedImageUrl,
              originalName: images[imageUpdate.order].originalname,
              mimeType: images[imageUpdate.order].mimetype,
              size: images[imageUpdate.order].size,
              entityType: 'post',
              entityId: id,
              order: imageUpdate.order,
            });

            await this.imageRepository.save(imageEntity);
          }
        }
      }
    }

    // entityType이 'post'인 images만 포함해서 다시 조회
    const updatedPost = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect(
        'post.images',
        'image',
        'image.entityType = :entityType',
        { entityType: 'post' },
      )
      .where('post.id = :id', { id })
      .getOne();

    return updatedPost;
  }

  async remove(id: number, userId: number) {
    const post = await this.findOne(id, userId);
    await this.imageService.deleteImagesByEntity('post', id);
    return await this.postRepository.softRemove(post);
  }

  // 지난 1주일간 인기 게시글 조회
  async findPopularPostsOfWeek(): Promise<
    Array<{
      id: number;
      title: string;
      viewCount: number;
      commentsCount: number;
    }>
  > {
    const oneWeekAgo = dayjs().subtract(7, 'day').toDate();

    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.comments', 'comment')
      .select([
        'post.id',
        'post.title',
        'post.viewCount',
        'post.category',
        'COUNT(comment.id) AS commentsCount',
      ])
      .where('post.createdAt >= :oneWeekAgo', { oneWeekAgo })
      .andWhere('post.deletedAt IS NULL')
      .andWhere('post.category != :notice', { notice: 'notice' }) // notice가 아닌 것만
      .groupBy('post.id')
      .orderBy('post.viewCount', 'DESC')
      .limit(10)
      .getRawMany();

    // getRawMany의 결과는 { post_id, post_title, post_viewCount, commentsCount } 형태이므로, 키를 맞춰줌
    return posts.map((p: any) => ({
      id: p.post_id,
      title: p.post_title,
      viewCount: p.post_viewCount,
      category: p.post_category,
      commentsCount: Number(p.commentsCount),
    }));
  }
}
