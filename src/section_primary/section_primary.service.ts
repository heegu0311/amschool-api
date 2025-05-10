import { Injectable } from '@nestjs/common';
import { CreateSectionPrimaryDto } from './dto/create-section_primary.dto';
import { UpdateSectionPrimaryDto } from './dto/update-section_primary.dto';

@Injectable()
export class SectionPrimaryService {
  create(createSectionPrimaryDto: CreateSectionPrimaryDto) {
    return 'This action adds a new sectionPrimary';
  }

  findAll() {
    return `This action returns all sectionPrimary`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sectionPrimary`;
  }

  update(id: number, updateSectionPrimaryDto: UpdateSectionPrimaryDto) {
    return `This action updates a #${id} sectionPrimary`;
  }

  remove(id: number) {
    return `This action removes a #${id} sectionPrimary`;
  }
}
