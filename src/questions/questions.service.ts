import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { AiAnswer } from './entities/ai-answer.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { S3Service } from 'src/common/services/s3.service';
import { ImageService } from '../common/services/image.service';
import { Image } from '../common/entities/image.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';

@Injectable()
export class QuestionsService {
  private openai: OpenAI;

  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
    @InjectRepository(AiAnswer)
    private aiAnswerRepository: Repository<AiAnswer>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    private configService: ConfigService,
    private s3Service: S3Service,
    private imageService: ImageService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async create(
    createQuestionDto: CreateQuestionDto,
    userId: number,
  ): Promise<Question> {
    const question = this.questionsRepository.create({
      ...createQuestionDto,
      author_id: userId,
    });

    const savedQuestion = await this.questionsRepository.save(question);

    if (createQuestionDto.images && createQuestionDto.images.length > 0) {
      const uploadPromises = createQuestionDto.images.map(async (image) => {
        const uploadedImage = await this.imageService.uploadImage(
          image,
          'question',
          savedQuestion.id,
        );

        const imageEntity = this.imageRepository.create({
          url: uploadedImage.url,
          originalName: image.originalname,
          mimeType: image.mimetype,
          size: image.size,
          entityType: 'question',
          entityId: savedQuestion.id,
          question: savedQuestion,
        });

        return this.imageRepository.save(imageEntity);
      });

      await Promise.all(uploadPromises);
    }

    return savedQuestion;
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Question>> {
    const { page = 1, limit = 10 } = paginationDto;
    const [items, totalItems] = await this.questionsRepository.findAndCount({
      where: { deleted_at: undefined },
      relations: ['author', 'aiAnswer', 'images'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
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

  async findOne(id: number): Promise<Question> {
    const question = await this.questionsRepository.findOne({
      where: { id, deleted_at: undefined },
      relations: ['author', 'aiAnswer', 'images'],
    });
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async createAiAnswer(questionId: number): Promise<AiAnswer> {
    const question = await this.findOne(questionId);

    // 1. 언어 감지
    const languagePrompt = `Detect the language of the following message and respond only with one of the following: 'KOREAN', 'ENGLISH', 'JAPANESE', 'CHINESE'. Message: ${question.content}`;

    const languageCompletion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            "You are a language detection AI. Respond only with 'KOREAN', 'ENGLISH', 'JAPANESE', or 'CHINESE'.",
        },
        {
          role: 'user',
          content: languagePrompt,
        },
      ],
    });

    const language = (
      languageCompletion.choices[0].message?.content || 'ENGLISH'
    )
      .trim()
      .toUpperCase();

    // 2. 언어별 시스템 메시지 설정
    const systemMessages = {
      KOREAN:
        '당신은 내과 의사 역할을 하는 AI입니다. 사용자의 질문에 대해 현재 의학적으로 가능한 치료 방법과 예방 조치를 설명하세요. 진단은 하지 마세요.',
      ENGLISH:
        "You are an AI acting as a general physician. Provide medically available treatment options and preventive measures for the user's question. Do not diagnose. Also, if there are foods that may help, recommend them as well.",
      JAPANESE:
        'あなたは内科医の役割を果たすAIです。ユーザーの質問に対して、現在利用可能な治療法と予防策を説明してください。診断はしないでください。',
      CHINESE:
        '你是一个充当内科医生的人工智能。请提供医学上可行的治疗方案和预防措施。不要进行诊断。',
    };

    const systemMessage = systemMessages[language] || systemMessages.ENGLISH;

    // 3. AI 응답 생성
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        {
          role: 'user',
          content: question.content,
        },
      ],
    });

    let botReply =
      completion.choices[0].message?.content ||
      '죄송합니다, 요청을 처리할 수 없습니다.';

    // 4. HTML 포맷팅
    botReply = botReply.replace(/(\d+)\.\s/g, '<li>');
    botReply = botReply.replace(/\n/g, '</li>\n');
    botReply = `<ul>${botReply}</li></ul>`;

    // 5. 예약 링크 추가
    const bookingLinks = {
      KOREAN:
        "<br><br>의사와 상담/처방을 원하면 <a href='https://patient.vitahealth365.com/booking?cate=1' target='_blank' style='color:blue; font-weight:bold;'>예약</a>을 눌러서 진행할 수 있습니다.",
      ENGLISH:
        "<br><br>If you need a consultation or prescription, click <a href='https://patient.vitahealth365.com/booking?cate=1' target='_blank' style='color:blue; font-weight:bold;'>here</a> to book an appointment.",
      JAPANESE:
        "<br><br>医師の相談や処方を希望する場合は、<a href='https://patient.vitahealth365.com/booking?cate=1' target='_blank' style='color:blue; font-weight:bold;'>こちら</a>をクリックしてください。",
      CHINESE:
        "<br><br>如果您需要咨询或处方，请点击<a href='https://patient.vitahealth365.com/booking?cate=1' target='_blank' style='color:blue; font-weight:bold;'>此处</a>进行预约。",
    };

    botReply += bookingLinks[language] || bookingLinks.ENGLISH;

    // 6. 안내 문구 추가
    const noticeMessages = {
      KOREAN:
        "<span style='color: #007bff; font-weight: bold;'>📌 꼭 확인해주세요.</span><br>- 첨부된 이미지를 제외하고 해석한 답변입니다.<br>- 본 답변은 의학적 판단이나 진료 행위로 해석될 수 없으며, 비타헬스365는 이로 인해 발생하는 어떠한 책임도 지지 않습니다.<br>- 정확한 개인 증상 파악 및 진단은 의사를 통해 진행하시기 바랍니다.<br>- 고객님의 개인정보 보호를 위해 개인정보는 입력하지 않도록 주의 바랍니다.<br>- 서비스에 입력되는 데이터는 OpenAI 정책에 따라 관리됩니다.",
      ENGLISH:
        "<span style='color: #007bff; font-weight: bold;'>📌 Please Note.</span><br>- This response is interpreted excluding any attached images.<br>- This response should not be considered as medical judgment or treatment, and Vita Health 365 is not responsible for any consequences arising from its use.<br>- For accurate symptom assessment and diagnosis, please consult a doctor.<br>- To protect your privacy, please do not enter any personal information.<br>- Data entered into the service is managed according to OpenAI policies.",
      JAPANESE:
        "<span style='color: #007bff; font-weight: bold;'>📌 ご注意ください。</span><br>- 添付された画像を除外して解釈した回答です。<br>- 本回答は医学的判断や診療行為として解釈されるべきではなく、Vita Health 365 はその結果について一切の責任を負いません。<br>- 正確な症状の把握や診断は、医師に相談してください。<br>- 個人情報保護のため、個人情報の入力はお控えください。<br>- サービスに入力されたデータは OpenAI のポリシーに従って管理されます。",
      CHINESE:
        "<span style='color: #007bff; font-weight: bold;'>📌 请注意。</span><br>- 该回复是根据解释内容，不包括附带图片。<br>- 本回复不应被视为医学判断或治疗行为，Vita Health 365 对因此产生的任何后果概不负责。<br>- 请咨询医生，以准确评估您的症状并进行诊断。<br>- 为保护您的个人信息，请勿输入任何个人数据。<br>- 输入到服务中的数据将按照 OpenAI 政策进行管理。",
    };

    const noticeMessage = noticeMessages[language] || noticeMessages.ENGLISH;

    // 7. 로깅
    await this.logChat(question.content, botReply, language);

    const aiAnswer = this.aiAnswerRepository.create({
      question_id: questionId,
      content: botReply,
      notice: noticeMessage,
      language: language,
    });

    return await this.aiAnswerRepository.save(aiAnswer);
  }

  private async logChat(
    userMessage: string,
    botReply: string,
    language: string,
  ): Promise<void> {
    const logDir = path.join(process.cwd(), 'chat_logs');
    const date = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toTimeString().split(' ')[0];
    const logEntry = `[${timestamp}] \nUser: ${userMessage}\nBot: ${botReply}\n-------------------------\n`;

    // 로그 파일 경로 생성
    const logFilePath = path.join(logDir, `${date}_${language}.txt`);

    // 로그 디렉토리가 없으면 생성
    if (!fs.existsSync(logDir)) {
      await fs.promises.mkdir(logDir, { recursive: true });
    }

    // 로그 파일에 내용 추가
    await fs.promises.appendFile(logFilePath, logEntry);
  }

  async updateAiFeedback(
    answerId: number,
    feedbackPoint: number,
  ): Promise<AiAnswer> {
    const aiAnswer = await this.aiAnswerRepository.findOne({
      where: { id: answerId, deleted_at: undefined },
    });
    if (!aiAnswer) {
      throw new NotFoundException();
    }
    aiAnswer.feedback_point = feedbackPoint;
    return await this.aiAnswerRepository.save(aiAnswer);
  }

  async delete(id: number): Promise<void> {
    const question = await this.findOne(id);
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    // 이미지 삭제
    await this.imageService.deleteImagesByEntity('question', id);

    // 연관된 AiAnswer도 soft delete
    const aiAnswer = question.aiAnswer;
    if (aiAnswer) {
      await this.aiAnswerRepository.softRemove(aiAnswer);
    }

    await this.questionsRepository.softRemove(question);
  }

  async findByAuthorId(
    authorId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Question>> {
    const { page = 1, limit = 10 } = paginationDto;
    const [items, totalItems] = await this.questionsRepository.findAndCount({
      where: {
        author_id: authorId,
        deleted_at: undefined,
      },
      relations: ['author', 'aiAnswer', 'images'],
      skip: (page - 1) * limit,
      take: limit,
      order: { created_at: 'DESC' },
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
