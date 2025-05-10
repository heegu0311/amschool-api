import { Injectable } from '@nestjs/common';
import { CreateSectionSecondaryDto } from './dto/create-section_secondary.dto';
import { UpdateSectionSecondaryDto } from './dto/update-section_secondary.dto';

@Injectable()
export class SectionSecondaryService {
  create(createSectionSecondaryDto: CreateSectionSecondaryDto) {
    return 'This action adds a new sectionSecondary';
  }

  findAll() {
    return `This action returns all sectionSecondary`;
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
