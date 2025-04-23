import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { Diary } from './entities/diary.entity';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private diaryRepository: Repository<Diary>,
  ) {}

  async create(userId: number, createDiaryDto: CreateDiaryDto) {
    const diary = this.diaryRepository.create({
      authorId: userId,
      ...createDiaryDto,
    });
    return await this.diaryRepository.save(diary);
  }

  async findAll(userId: number) {
    return await this.diaryRepository.find({
      where: { authorId: userId },
      relations: ['emotion'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number) {
    const diary = await this.diaryRepository.findOne({
      where: { id, authorId: userId },
      relations: ['emotion', 'subEmotion'],
    });

    if (!diary) {
      throw new NotFoundException(`Diary #${id} not found`);
    }

    return diary;
  }

  async update(id: number, userId: number, updateDiaryDto: UpdateDiaryDto) {
    const diary = await this.findOne(id, userId);
    Object.assign(diary, updateDiaryDto);
    return await this.diaryRepository.save(diary);
  }

  async remove(id: number, userId: number) {
    const diary = await this.findOne(id, userId);
    return await this.diaryRepository.softRemove(diary);
  }

  async findByMonth(userId: number, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return await this.diaryRepository.find({
      where: {
        authorId: userId,
        createdAt: Between(startDate, endDate),
      },
      relations: ['emotion', 'subEmotion'],
      order: { createdAt: 'DESC' },
    });
  }
}
