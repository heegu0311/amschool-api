import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Question } from "./entities/question.entity";
import { AiAnswer } from "./entities/ai-answer.entity";
import { CreateQuestionDto } from "./dto/create-question.dto";

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
    @InjectRepository(AiAnswer)
    private aiAnswerRepository: Repository<AiAnswer>
  ) {}

  async create(
    createQuestionDto: CreateQuestionDto,
    userId: number
  ): Promise<Question> {
    const question = this.questionsRepository.create({
      ...createQuestionDto,
      author_id: userId,
    });
    return await this.questionsRepository.save(question);
  }

  async findAll(): Promise<Question[]> {
    return await this.questionsRepository.find({
      relations: ["author", "aiAnswer"],
    });
  }

  async findOne(id: number): Promise<Question> {
    const question = await this.questionsRepository.findOne({
      where: { id },
      relations: ["author", "aiAnswer"],
    });
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async createAiAnswer(questionId: number, content: string): Promise<AiAnswer> {
    const question = await this.findOne(questionId);
    const aiAnswer = this.aiAnswerRepository.create({
      content,
      question_id: questionId,
    });
    return await this.aiAnswerRepository.save(aiAnswer);
  }

  async updateAiFeedback(
    answerId: number,
    feedbackPoint: number
  ): Promise<AiAnswer> {
    const aiAnswer = await this.aiAnswerRepository.findOne({
      where: { id: answerId },
    });
    if (!aiAnswer) {
      throw new NotFoundException(`AI Answer with ID ${answerId} not found`);
    }
    aiAnswer.feedback_point = feedbackPoint;
    return await this.aiAnswerRepository.save(aiAnswer);
  }
}
