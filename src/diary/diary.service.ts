import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { Diary } from './entities/diary.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';

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

  async findAll(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Diary>> {
    const { page = 1, limit = 10 } = paginationDto;
    const [items, totalItems] = await this.diaryRepository.findAndCount({
      where: { authorId: userId },
      relations: ['emotion'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
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
      relations: ['emotion'],
      order: { createdAt: 'DESC' },
    });
  }
}
