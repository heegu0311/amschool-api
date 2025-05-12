import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSectionSecondaryDto } from './dto/create-section_secondary.dto';
import { UpdateSectionSecondaryDto } from './dto/update-section_secondary.dto';
import { SectionSecondary } from './entities/section_secondary.entity';

@Injectable()
export class SectionSecondaryService {
  constructor(
    @InjectRepository(SectionSecondary)
    private readonly sectionSecondaryRepository: Repository<SectionSecondary>,
  ) {}

  create(createSectionSecondaryDto: CreateSectionSecondaryDto) {
    return 'This action adds a new sectionSecondary';
  }

  async findAll() {
    return await this.sectionSecondaryRepository.find({
      where: {
        isVisible: 'Y',
      },
      order: {
        order: 'ASC',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} sectionSecondary`;
  }

  update(id: number, updateSectionSecondaryDto: UpdateSectionSecondaryDto) {
    return `This action updates a #${id} sectionSecondary`;
  }

  remove(id: number) {
    return `This action removes a #${id} sectionSecondary`;
  }
}
