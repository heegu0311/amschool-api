import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CancerUser } from './entities/cancer-user.entity';
import { CreateCancerUserDto } from './dto/create-cancer-user.dto';
import { UpdateCancerUserDto } from './dto/update-cancer-user.dto';

@Injectable()
export class CancerUserService {
  constructor(
    @InjectRepository(CancerUser)
    private cancerUserRepository: Repository<CancerUser>,
  ) {}

  create(createCancerUserDto: CreateCancerUserDto) {
    const cancerUser = new CancerUser();
    cancerUser.user_id = createCancerUserDto.user_id;
    cancerUser.cancer_id = createCancerUserDto.cancer_id;
    return this.cancerUserRepository.save(cancerUser);
  }

  findAll() {
    return this.cancerUserRepository.find({
      relations: ['user', 'cancer'],
    });
  }

  findOne(id: number) {
    return this.cancerUserRepository.findOne({
      where: { id },
      relations: ['user', 'cancer'],
    });
  }

  update(id: number, updateCancerUserDto: UpdateCancerUserDto) {
    return this.cancerUserRepository.update(id, updateCancerUserDto);
  }

  remove(id: number) {
    return this.cancerUserRepository.delete(id);
  }
}
