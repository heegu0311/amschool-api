import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { Reply } from '../comment/reply/entities/reply.entity';
import { Diary } from '../diary/entities/diary.entity';
import { NotificationService } from '../notification/notification.service';
import { Post } from '../post/entities/post.entity';
import { ReactionService } from '../reaction/reaction.service';
import { ReactionEntity } from './entities/reaction-entity.entity';

@Injectable()
export class ReactionEntityService {
  constructor(
    @InjectRepository(ReactionEntity)
    private reactionEntityRepository: Repository<ReactionEntity>,
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
    private readonly reactionService: ReactionService,
    private readonly notificationService: NotificationService,
  ) {}

  findAll() {
    return this.reactionEntityRepository.find();
  }

  findOne(id: number) {
    return this.reactionEntityRepository.findOne({ where: { id } });
  }

  remove(id: number) {
    return this.reactionEntityRepository.delete(id);
  }

  async getEntityReactions(
    entityType: 'diary' | 'comment' | 'reply',
    entityId: number,
    userId?: number,
  ) {
    // 엔티티별 공감 통계
    const reactionStats = await this.reactionEntityRepository
      .createQueryBuilder('reactionEntity')
      .select('reaction.id', 'reactionId')
      .addSelect('reaction.name', 'reactionName')
      .addSelect('reaction.emoji', 'reactionEmoji')
      .addSelect('COUNT(*)', 'count')
      .leftJoin('reactionEntity.reaction', 'reaction')
      .where('reactionEntity.entityType = :entityType', { entityType })
      .andWhere('reactionEntity.entityId = :entityId', { entityId })
      .groupBy('reaction.id')
      .getRawMany();

    // 현재 사용자의 공감
    let userReactions: any = null;
    if (userId) {
      userReactions = await this.reactionEntityRepository
        .createQueryBuilder('reactionEntity')
        .select('reaction.id', 'reactionId')
        .addSelect('reaction.name', 'reactionName')
        .addSelect('reaction.emoji', 'reactionEmoji')
        .leftJoin('reactionEntity.reaction', 'reaction')
        .where('reactionEntity.entityType = :entityType', { entityType })
        .andWhere('reactionEntity.entityId = :entityId', { entityId })
        .andWhere('reactionEntity.userId = :userId', { userId })
        .getRawOne();
    }

    return {
      stats: reactionStats,
      userReaction: userReactions,
    };
  }

  async addReaction(
    entityType: 'diary' | 'post' | 'comment',
    entityId: number,
    targetType: 'diary' | 'post' | 'comment' | 'reply',
    targetId: number,
    reactionId: number,
    userId: number,
  ) {
    let entity;
    let authorId;

    switch (targetType) {
      case 'diary':
        entity = await this.diaryRepository.findOne({
          where: { id: entityId },
        });
        if (!entity) {
          throw new NotFoundException('오늘의나를 찾을 수 없습니다.');
        }
        authorId = entity.authorId;
        break;

      case 'post':
        entity = await this.postRepository.findOne({
          where: { id: entityId },
        });
        if (!entity) {
          throw new NotFoundException('게시글을 찾을 수 없습니다.');
        }
        authorId = entity.authorId;
        break;

      case 'comment':
        entity = await this.commentRepository.findOne({
          where: { id: targetId },
        });
        if (!entity) {
          throw new NotFoundException('댓글을 찾을 수 없습니다.');
        }
        authorId = entity.authorId;
        break;

      case 'reply':
        entity = await this.replyRepository.findOne({
          where: { id: targetId },
        });
        if (!entity) {
          throw new NotFoundException('답글을 찾을 수 없습니다.');
        }
        authorId = entity.authorId;
        break;
    }

    // 새로운 공감 생성
    const reactionEntity = this.reactionEntityRepository.create({
      entityType,
      entityId,
      targetType,
      targetId,
      reactionId,
      userId,
    });

    const savedReaction =
      await this.reactionEntityRepository.save(reactionEntity);

    // 엔티티 작성자와 공감 작성자가 다른 경우에만 알림 생성
    if (authorId !== userId) {
      await this.notificationService.create({
        type: 'reaction',
        receiverUserId: authorId,
        senderUserId: userId,
        targetId: entityId,
        targetType: entityType,
        entityId: entity.entityId || entity.id,
        entityType: entity.entityType || entity.type || '',
        isRead: false,
      });
    }

    return savedReaction;
  }

  async removeReaction(
    entityType: 'diary' | 'post' | 'comment',
    entityId: number,
    targetType: 'diary' | 'post' | 'comment' | 'reply',
    targetId: number,
    reactionId: number,
    userId: number,
  ) {
    const reactionEntity = await this.reactionEntityRepository.findOne({
      where: {
        entityType,
        entityId,
        targetType,
        targetId,
        reactionId,
        userId,
      },
    });

    if (reactionEntity) {
      return await this.reactionEntityRepository.remove(reactionEntity);
    }
  }

  async getReactionsForMultipleEntities(
    targetType: 'diary' | 'comment' | 'reply' | 'post',
    targetIds: number[],
    currentUserId?: number,
  ): Promise<Record<number, { reactions: any[]; userReactions: number[] }>> {
    // 여러 엔티티의 공감을 한 번에 조회
    const reactions = await this.reactionEntityRepository
      .createQueryBuilder('reactionEntity')
      .select('reactionEntity.targetId', 'targetId')
      .addSelect('reactionEntity.reactionId', 'reactionId')
      .addSelect('COUNT(*)', 'count')
      .where('reactionEntity.targetType = :targetType', { targetType })
      .andWhere(
        targetIds.length > 0
          ? 'reactionEntity.targetId IN (:...targetIds)'
          : '1=0',
        { targetIds },
      )
      .groupBy('reactionEntity.targetId, reactionEntity.reactionId')
      .orderBy('reactionEntity.reactionId', 'ASC')
      .getRawMany();

    // 사용자 공감 조회
    let userReactions: {
      targetId: number;
      reactionId: number;
      count: string;
    }[] = [];
    if (currentUserId) {
      userReactions = await this.reactionEntityRepository
        .createQueryBuilder('reactionEntity')
        .select('reactionEntity.targetId', 'targetId')
        .addSelect('reactionEntity.reactionId', 'reactionId')
        .addSelect('COUNT(*)', 'count')
        .where('reactionEntity.targetType = :targetType', {
          targetType,
        })
        .andWhere(
          targetIds.length > 0
            ? 'reactionEntity.targetId IN (:...targetIds)'
            : '1=0',
          { targetIds },
        )
        .andWhere('reactionEntity.userId = :userId', { userId: currentUserId })
        .groupBy('reactionEntity.targetId, reactionEntity.reactionId')
        .orderBy('reactionEntity.reactionId', 'ASC')
        .getRawMany();
    }

    // Reaction 전체 목록 조회
    const allReactions = await this.reactionService.findAll();

    // 결과 매핑
    const result = {};
    targetIds.forEach((id) => {
      // 해당 targetId에 대한 실제 반응 데이터
      const entityReactions = reactions.filter((r) => r.targetId === id);

      // 모든 reactionId를 포함해서 count가 없으면 0으로 맞춰줌
      const formattedReactions = allReactions.map((reaction) => {
        const found = entityReactions.find((r) => r.reactionId === reaction.id);
        return {
          reactionId: reaction.id,
          count: found ? parseInt(found.count, 10) : 0,
        };
      });

      result[id] = {
        reactions: formattedReactions,
        userReactions: userReactions
          .filter((r) => r.targetId === id)
          .map((r) => r.reactionId),
      };
    });

    return result;
  }

  async getReactionsCountForMultipleEntities(
    entityType: 'diary' | 'comment' | 'reply' | 'post',
    entityIds: number[],
  ): Promise<
    Record<number, { reactionsCount: number; userReactionId?: number }>
  > {
    // 여러 엔티티의 총 공감 개수를 한 번에 조회
    const reactions = await this.reactionEntityRepository
      .createQueryBuilder('reactionEntity')
      .select('reactionEntity.entityId', 'entityId')
      .addSelect('COUNT(*)', 'reactionsCount')
      .where('reactionEntity.entityType = :entityType', { entityType })
      .andWhere(
        entityIds.length > 0
          ? 'reactionEntity.entityId IN (:...entityIds)'
          : '1=0',
        { entityIds },
      )
      .groupBy('reactionEntity.entityId')
      .getRawMany();

    // 결과 매핑
    const result = {};
    entityIds.forEach((id) => {
      const entityReaction = reactions.find((r) => r.entityId === id);

      result[id] = {
        reactionsCount: entityReaction
          ? parseInt(entityReaction.reactionsCount, 10)
          : 0,
      };
    });

    return result;
  }
}
