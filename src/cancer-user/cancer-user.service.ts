import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCancerUserDto } from './dto/create-cancer-user.dto';
import { CancerUser } from './entities/cancer-user.entity';

@Injectable()
export class CancerUserService {
  constructor(
    @InjectRepository(CancerUser)
    private cancerUserRepository: Repository<CancerUser>,
  ) {}

  create(createCancerUserDto: CreateCancerUserDto) {
    const cancerUser = new CancerUser();
    cancerUser.user_id = createCancerUserDto.userId;
    cancerUser.cancer_id = createCancerUserDto.cancerId;
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
}
