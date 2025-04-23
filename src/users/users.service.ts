import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { CancerUser } from '../cancer-user/entities/cancer-user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(CancerUser)
    private cancerUserRepository: Repository<CancerUser>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(createUserDto);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }

  async findUsersByCancer(
    cancerId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<User>> {
    const { page = 1, limit = 10 } = paginationDto;

    const [items, totalItems] = await this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.cancerUsers', 'cancerUser')
      .where('cancerUser.cancerId = :cancerId', { cancerId })
      .andWhere('user.isPublic = :isPublic', { isPublic: true })
      .orderBy('user.createdAt', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

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

  async findSimilarUsers(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<User>> {
    const { page = 1, limit = 10 } = paginationDto;

    // 현재 사용자의 암 ID 목록 조회
    const userCancers = await this.cancerUserRepository.find({
      where: { userId },
      select: ['cancerId'],
    });
    const cancerIds = userCancers.map((cu) => cu.cancerId);

    if (cancerIds.length === 0) {
      return {
        items: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: limit,
          totalPages: 0,
          currentPage: page,
        },
      };
    }

    // 같은 암을 가진 다른 사용자들 조회
    const [items, totalItems] = await this.usersRepository.findAndCount({
      where: {
        cancerUsers: {
          cancerId: In(cancerIds),
        },
      },
      relations: ['cancerUsers'],
      order: {
        createdAt: 'ASC',
      },
      skip: (page - 1) * limit,
      take: limit,
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
}
