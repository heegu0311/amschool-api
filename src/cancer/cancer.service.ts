import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cancer } from './entities/cancer.entity';
import { CreateCancerDto } from './dto/create-cancer.dto';
import { UpdateCancerDto } from './dto/update-cancer.dto';

@Injectable()
export class CancerService {
  constructor(
    @InjectRepository(Cancer)
    private cancerRepository: Repository<Cancer>,
  ) {}

  create(createCancerDto: CreateCancerDto) {
    return this.cancerRepository.save(createCancerDto);
  }

  findAll() {
    return this.cancerRepository.find();
  }

  findOne(id: number) {
    return this.cancerRepository.findOneBy({ id });
  }

  update(id: number, updateCancerDto: UpdateCancerDto) {
    return this.cancerRepository.update(id, updateCancerDto);
  }

  remove(id: number) {
    return this.cancerRepository.delete(id);
  }
}
