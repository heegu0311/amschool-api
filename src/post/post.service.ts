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
  ): Promise<PaginatedResponse<Post>> {
    const { page = 1, limit = 10, category, keyword } = paginationDto;

    // 공지사항 조회 (category가 ALL이고 1페이지에서만, 키워드 검색이 아닐 때만)
    let noticePosts: Post[] = [];
    if (category === PostCategory.ALL && page === 1 && !keyword) {
      const noticeQueryBuilder = this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.author', 'author')
        .leftJoinAndSelect('post.images', 'images')
        .leftJoinAndSelect(
          'comment',
          'comments',
          'comments.entity_id = post.id AND comments.entity_type = :entityType',
          { entityType: 'post' },
        )
        .where('post.category = :category', { category: PostCategory.NOTICE });

      noticePosts = await noticeQueryBuilder
        .orderBy('post.createdAt', 'DESC')
        .getMany();
    }

    // 일반 게시글 조회 (페이지네이션 적용)
    const regularQueryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.images', 'images')
      .leftJoinAndSelect('post.comments', 'comments')
      .where(
        category === PostCategory.ALL
          ? 'post.category != :notice'
          : 'post.category = :category',
        category === PostCategory.ALL ? { notice: 'notice' } : { category },
      );

    if (keyword) {
      regularQueryBuilder.andWhere(
        '(post.title LIKE :keyword OR post.content LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    const [regularPosts, totalRegularPosts] = await regularQueryBuilder
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    // all+1페이지만 noticePosts 포함, 그 외는 regularPosts만
    // 키워드 검색 시에는 항상 regularPosts만 반환
    const allPosts = keyword
      ? regularPosts
      : category === PostCategory.ALL && page === 1
        ? [...noticePosts, ...regularPosts]
        : regularPosts;

    // 게시글 ID 목록 추출
    const postIds = allPosts.map((post) => post.id);

    // 여러 게시글의 공감을 한 번에 조회
    const postWithReactionsCount =
      await this.reactionEntityService.getReactionsCountForMultipleEntities(
        'post',
        postIds,
      );

    // 공감 정보를 각 엔티티에 매핑
    const postsWithReactions = allPosts.map((post) => {
      // 익명 게시글 처리
      if (post.isAnonymous) {
        post.author.username = '*******';
        post.author.profileImage = '/images/anonymous.png';
      }
      // 기존 매핑
      const postWithReactions = {
        ...post,
        reactionsCount: postWithReactionsCount[post.id]?.reactionsCount || 0,
        comments: post.comments || [],
        commentsCount: post.comments?.length || 0,
      };
      return postWithReactions;
    });

    // 전체 게시글 수는 noticePosts는 all+1페이지만 포함
    // 키워드 검색 시에는 regularPosts의 수만 사용
    const totalItems = keyword
      ? totalRegularPosts
      : (category === PostCategory.ALL && page === 1 ? noticePosts.length : 0) +
        totalRegularPosts;

    return {
      items: postsWithReactions,
      meta: {
        totalItems,
        itemCount: postsWithReactions.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  async findOne(id: number, userId?: number) {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.images', 'images')
      .leftJoinAndSelect(
        'comment',
        'comments',
        'comments.entity_id = post.id AND comments.entity_type = :entityType',
        { entityType: 'post' },
      )
      .where('post.id = :id', { id })
      .getOne();

    if (post?.accessLevel === 'private' && post?.authorId !== userId) {
      throw new NotFoundException(`Post #${id} has private type`);
    }

    if (post?.accessLevel === 'member' && !userId) {
      throw new NotFoundException(`Post #${id} has member type`);
    }

    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    return {
      ...post,
      comments: post.comments || [],
      commentsCount: post.comments?.length || 0,
    };
  }

  async findOneWithMoreInfo(id: number, userId?: number): Promise<Post> {
    // 조회수 증가
    await this.postRepository.increment({ id }, 'viewCount', 1);

    // 댓글 수 조회
    const commentsCount = await this.postRepository
      .createQueryBuilder('post')
      .leftJoin(
        'comment',
        'comments',
        'comments.entity_id = post.id AND comments.entity_type = :entityType',
        { entityType: 'post' },
      )
      .select('COUNT(comments.id)', 'count')
      .where('post.id = :id', { id })
      .getRawOne();

    // 게시글 정보 조회
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoin('post.author', 'author')
      .addSelect(['author.id', 'author.username', 'author.profileImage'])
      .leftJoinAndSelect('author.cancerUsers', 'cancerUsers')
      .leftJoinAndSelect('cancerUsers.cancer', 'cancer')
      .leftJoinAndSelect('post.images', 'images')
      .leftJoin(
        'comment',
        'comments',
        'comments.entity_id = post.id AND comments.entity_type = :entityType',
        { entityType: 'post' },
      )
      .addSelect('comments')
      .where('post.id = :id', { id })
      .getOne();

    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    if (post.isAnonymous) {
      post.author.username = '*******';
      post.author.profileImage = '/images/anonymous.png';
    }

    // 이전글/다음글 조회
    const [prevPost, nextPost] = await Promise.all([
      this.findPrevPost(id),
      this.findNextPost(id),
    ]);

    // 게시글 공감 조회
    const postReactions =
      await this.reactionEntityService.getReactionsForMultipleEntities(
        'post',
        [post.id],
        userId,
      );

    // 공감 정보를 엔티티에 매핑
    const postWithReactions = {
      ...post,
      reactions: postReactions[post.id]?.reactions || [],
      userReactions: postReactions[post.id]?.userReactions || [],
      comments: post.comments || [],
      commentsCount: Number(commentsCount?.count) || 0,
      prevPost,
      nextPost,
    };

    return postWithReactions as Post;
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
      createdAt: string;
    }>
  > {
    const threeMonthsAgo = dayjs().subtract(90, 'day').toDate();

    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoin(
        'comment',
        'comment',
        'comment.entity_id = post.id AND comment.entity_type = :entityType',
        { entityType: 'post' },
      )
      .select([
        'post.id',
        'post.title',
        'post.viewCount',
        'post.category',
        'post.createdAt',
        'COUNT(comment.id) AS commentsCount',
      ])
      .where('post.createdAt >= :oneWeekAgo', { oneWeekAgo: threeMonthsAgo })
      .andWhere('post.deletedAt IS NULL')
      .andWhere('post.category != :notice', { notice: 'notice' })
      .groupBy('post.id')
      .orderBy('post.viewCount', 'DESC')
      .limit(10)
      .getRawMany();

    return posts.map((p: any) => ({
      id: p.post_id,
      title: p.post_title,
      viewCount: p.post_viewCount,
      category: p.post_category,
      commentsCount: Number(p.commentsCount),
      createdAt: p.post_created_at,
    }));
  }

  async findByAuthorId(
    authorId: number,
    paginationDto: PostPaginationDto,
  ): Promise<PaginatedResponse<Post>> {
    const { page = 1, limit = 10 } = paginationDto;
    const [items, totalItems] = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.images', 'images')
      .leftJoinAndSelect(
        'comment',
        'comments',
        'comments.entity_id = post.id AND comments.entity_type = :entityType',
        { entityType: 'post' },
      )
      .where('post.authorId = :authorId', { authorId })
      .andWhere('post.deletedAt IS NULL')
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    // 게시글 ID 목록 추출
    const postIds = items.map((post) => post.id);

    // 여러 게시글의 공감을 한 번에 조회
    const postWithReactionsCount =
      await this.reactionEntityService.getReactionsCountForMultipleEntities(
        'post',
        postIds,
      );

    // 공감 정보를 각 엔티티에 매핑
    const postsWithReactions = items.map((post) => {
      const postWithReactions = {
        ...post,
        reactionsCount: postWithReactionsCount[post.id]?.reactionsCount || 0,
        comments: post.comments || [],
        commentsCount: post.comments?.length || 0,
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
}
