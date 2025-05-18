import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createCancerUserDto: CreateCancerUserDto): Promise<CancerUser> {
    const cancerUser = new CancerUser();
    cancerUser.userId = createCancerUserDto.userId;
    cancerUser.cancerId = createCancerUserDto.cancerId;
    return this.cancerUserRepository.save(cancerUser);
  }

  async findAll(): Promise<CancerUser[]> {
    return this.cancerUserRepository.find({
      relations: ['user', 'cancer'],
    });
  }

  async findOne(id: number): Promise<CancerUser> {
    const cancerUser = await this.cancerUserRepository.findOne({
      where: { id },
      relations: ['user', 'cancer'],
    });

    if (!cancerUser) {
      throw new NotFoundException(`Cancer user with ID ${id} not found`);
    }

    return cancerUser;
  }

  async update(id: number, cancerId: number): Promise<CancerUser> {
    const cancerUser = await this.findOne(id);
    cancerUser.cancerId = cancerId;
    return this.cancerUserRepository.save(cancerUser);
  }

  async findByUserId(userId: number): Promise<CancerUser[]> {
    return this.cancerUserRepository.find({
      where: { userId },
      relations: ['cancer'],
    });
  }

  async delete(id: number): Promise<void> {
    const result = await this.cancerUserRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cancer user with ID ${id} not found`);
    }
  }
}
