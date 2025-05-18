import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyAnswerUser } from './entities/survey-answer-user.entity';

@Injectable()
export class SurveyAnswerUserService {
  constructor(
    @InjectRepository(SurveyAnswerUser)
    private surveyAnswerUserRepository: Repository<SurveyAnswerUser>,
  ) {}

  async create(
    userId: number,
    surveyAnswerId: number,
  ): Promise<SurveyAnswerUser> {
    const surveyAnswerUser = new SurveyAnswerUser();
    surveyAnswerUser.userId = userId;
    surveyAnswerUser.surveyAnswerId = surveyAnswerId;
    return this.surveyAnswerUserRepository.save(surveyAnswerUser);
  }

  async update(
    userId: number,
    surveyAnswerId: number,
  ): Promise<SurveyAnswerUser> {
    const existingRecord = await this.surveyAnswerUserRepository.findOne({
      where: { userId, surveyAnswerId },
    });

    if (!existingRecord) {
      return this.create(userId, surveyAnswerId);
    }

    return existingRecord;
  }

  async delete(userId: number, surveyAnswerId: number): Promise<void> {
    const result = await this.surveyAnswerUserRepository.delete({
      userId,
      surveyAnswerId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Survey answer user with userId ${userId} and surveyAnswerId ${surveyAnswerId} not found`,
      );
    }
  }

  async findByUserId(userId: number): Promise<SurveyAnswerUser[]> {
    return this.surveyAnswerUserRepository.find({
      where: { userId },
      relations: ['surveyAnswer'],
    });
  }
}
