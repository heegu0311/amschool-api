import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Emotion } from '../entities/emotion.entity';

@Injectable()
export class EmotionService {
  constructor(
    @InjectRepository(Emotion)
    private emotionRepository: Repository<Emotion>,
  ) {}

  async findAll() {
    return await this.emotionRepository.find({
      order: { order: 'ASC' },
    });
  }

  async findParentEmotions() {
    return await this.emotionRepository.find({
      where: { parentId: IsNull() },
      order: { order: 'ASC' },
    });
  }

  async findChildEmotions(parentId: number) {
    return await this.emotionRepository.find({
      where: { parentId },
      order: { order: 'ASC' },
    });
  }
}
