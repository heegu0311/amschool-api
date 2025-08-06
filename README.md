# 암투게더 API (AMSchool API) - 암 환우를 위한 커뮤니티 플랫폼 백엔드

암투게더 API는 암 환우와 가족들을 위한 온라인 커뮤니티 플랫폼의 백엔드 서버입니다. 오늘의나 작성, 게시글 공유, AI 건강 문답, 전문 건강매거진 제공 등을 위한 RESTful API를 제공합니다.

## 📋 목차

- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [환경 설정](#환경-설정)
- [설치 및 실행](#설치-및-실행)
- [주요 기능](#주요-기능)
- [API 문서](#api-문서)
- [데이터베이스](#데이터베이스)
- [인증 시스템](#인증-시스템)
- [AI 서비스](#ai-서비스)
- [배포](#배포)
- [개발 가이드](#개발-가이드)

## 🛠 기술 스택

### Backend Framework

- **Framework**: NestJS 11.0.1
- **Language**: TypeScript 5.7.3
- **Runtime**: Node.js 20
- **Package Manager**: npm

### Database

- **Database**: MySQL 8.0
- **ORM**: TypeORM 0.3.20
- **Migration**: TypeORM Migrations

### Authentication & Security

- **JWT**: @nestjs/jwt 11.0.0
- **Password Hashing**: bcrypt 5.1.1
- **Passport**: @nestjs/passport 11.0.5
- **Social Login**: passport-kakao, passport-naver-v2, passport-google-oauth20

### External Services

- **AI Service**: OpenAI GPT-4
- **Email Service**: Nodemailer 6.10.0
- **File Storage**: AWS S3
- **Scheduling**: @nestjs/schedule 6.0.0

### Development Tools

- **API Documentation**: Swagger/OpenAPI
- **Logging**: Winston 3.17.0
- **Validation**: class-validator, class-transformer
- **Testing**: Jest
- **Linting**: ESLint
- **Formatting**: Prettier

## 📁 프로젝트 구조

```
amschool-api/
├── src/
│   ├── auth/                    # 인증 관련 모듈
│   │   ├── controllers/         # 인증 컨트롤러
│   │   ├── dto/                # 인증 DTO
│   │   ├── entities/           # 인증 엔티티
│   │   ├── guards/             # 인증 가드
│   │   ├── services/           # 인증 서비스
│   │   └── strategies/         # JWT 전략
│   ├── users/                  # 사용자 관리
│   ├── diary/                  # 오늘의나 기능
│   │   ├── dto/               # 오늘의나 DTO
│   │   ├── entities/          # 오늘의나 엔티티
│   │   └── emotion/           # 감정 관리
│   ├── post/                   # 자유게시판 기능
│   ├── question/               # AI 건강 문답
│   │   ├── dto/               # 질문 DTO
│   │   ├── entities/          # 질문 엔티티
│   │   └── services/          # AI 서비스
│   ├── article/                # 건강매거진
│   │   ├── dto/               # 건강매거진 DTO
│   │   ├── entities/          # 건강매거진 엔티티
│   │   └── services/          # 건강매거진 서비스
│   ├── comment/                # 댓글 시스템
│   ├── reaction/               # 반응 시스템
│   ├── cancer/                 # 암 정보 관리 (13종 카테고리)
│   ├── cancer-user/            # 사용자 암 정보
│   ├── notification/           # 알림 시스템
│   │   └── partition.scheduler.ts  # 파티션 스케줄러
│   ├── common/                 # 공통 모듈
│   │   ├── dto/               # 공통 DTO
│   │   ├── entities/          # 공통 엔티티
│   │   ├── interfaces/        # 공통 인터페이스
│   │   ├── services/          # 공통 서비스
│   │   └── interceptors/      # 인터셉터
│   ├── config/                 # 설정 관리
│   ├── logger/                 # 로깅 시스템
│   └── main.ts                 # 애플리케이션 진입점
├── database/                   # 데이터베이스 관련
│   ├── migrations/            # 마이그레이션 파일
│   ├── seeds/                 # 시드 데이터
│   └── data-source.ts         # 데이터 소스 설정
├── test/                       # 테스트 파일
└── ...
```

## ⚙️ 환경 설정

### 필수 환경변수

#### 데이터베이스 설정

```env
# MySQL 데이터베이스
DB_HOST=your-database-host
DB_PORT=3306
DB_USERNAME=your-database-username
DB_PASSWORD=your-database-password
DB_DATABASE=amschool
```

#### JWT 설정

```env
# JWT 토큰
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRATION=15d
```

#### 이메일 설정

```env
# SMTP 설정 (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

#### 소셜 로그인 설정

```env
# 카카오 로그인
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CALLBACK_URL=http://localhost:3000/auth/social/kakao/callback

# 네이버 로그인
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret
NAVER_CALLBACK_URL=http://localhost:3000/auth/social/naver/callback

# 구글 로그인
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/social/google/callback
```

#### OpenAI 설정

```env
# OpenAI API
OPENAI_API_KEY=your-openai-api-key
OPENAI_ORGANIZATION=your-openai-organization
OPENAI_PROJECT=your-openai-project
```

#### AWS S3 설정

```env
# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=https://your-bucket.s3.region.amazonaws.com
AWS_S3_BUCKET_NAME=your-bucket-name
```

#### Swagger 설정

```env
# Swagger UI 인증
SWAGGER_USER=admin
SWAGGER_PASSWORD=admin123
```

### 개발 환경 환경변수 예시

```env
# .env.development
NODE_ENV=development
PORT=8000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your-password
DB_DATABASE=amschool

# JWT
JWT_SECRET=dev-jwt-secret-key
JWT_EXPIRATION=15d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-dev-email@gmail.com
SMTP_PASS=your-dev-app-password
SMTP_FROM=your-dev-email@gmail.com

# Social Login
KAKAO_CLIENT_ID=your-dev-kakao-client-id
NAVER_CLIENT_ID=your-dev-naver-client-id
NAVER_CLIENT_SECRET=your-dev-naver-client-secret
GOOGLE_CLIENT_ID=your-dev-google-client-id
GOOGLE_CLIENT_SECRET=your-dev-google-client-secret

# OpenAI
OPENAI_API_KEY=your-dev-openai-api-key
OPENAI_ORGANIZATION=your-dev-openai-organization
OPENAI_PROJECT=your-dev-openai-project

# AWS S3
AWS_ACCESS_KEY_ID=your-dev-aws-access-key
AWS_SECRET_ACCESS_KEY=your-dev-aws-secret-key
AWS_S3_BUCKET=https://your-dev-bucket.s3.region.amazonaws.com
AWS_S3_BUCKET_NAME=your-dev-bucket

# Swagger
SWAGGER_USER=admin
SWAGGER_PASSWORD=admin123
```

### 프로덕션 환경 환경변수 예시

```env
# .env.production
NODE_ENV=production
PORT=8000

# Database
DB_HOST=im-together-db-prod2.cl8cyqcis7uc.ap-northeast-2.rds.amazonaws.com
DB_PORT=3306
DB_USERNAME=admin
DB_PASSWORD=your-prod-password
DB_DATABASE=amschool

# JWT
JWT_SECRET=your-prod-jwt-secret-key
JWT_EXPIRATION=15d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=amsch365@gmail.com
SMTP_PASS=your-prod-app-password
SMTP_FROM=amsch365@gmail.com

# Social Login
KAKAO_CLIENT_ID=your-prod-kakao-client-id
NAVER_CLIENT_ID=your-prod-naver-client-id
NAVER_CLIENT_SECRET=your-prod-naver-client-secret
GOOGLE_CLIENT_ID=your-prod-google-client-id
GOOGLE_CLIENT_SECRET=your-prod-google-client-secret

# OpenAI
OPENAI_API_KEY=your-prod-openai-api-key
OPENAI_ORGANIZATION=your-prod-openai-organization
OPENAI_PROJECT=your-prod-openai-project

# AWS S3
AWS_ACCESS_KEY_ID=your-prod-aws-access-key
AWS_SECRET_ACCESS_KEY=your-prod-aws-secret-key
AWS_S3_BUCKET=https://your-prod-bucket.s3.region.amazonaws.com
AWS_S3_BUCKET_NAME=your-prod-bucket

# Swagger
SWAGGER_USER=admin
SWAGGER_PASSWORD=admin123
```

## 🚀 설치 및 실행

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경변수 설정

```bash
# 개발 환경
cp .env.example .env.development
# 환경변수 파일을 편집하여 필요한 값들을 설정

# 프로덕션 환경
cp .env.example .env.production
# 환경변수 파일을 편집하여 필요한 값들을 설정
```

### 3. 데이터베이스 설정

```bash
# 마이그레이션 실행
npm run migration:run

# 시드 데이터 실행 (선택사항)
npm run seed
```

### 4. 개발 서버 실행

```bash
# 개발 모드 (watch 모드)
npm run start:dev

# 디버그 모드
npm run start:debug

# 프로덕션 빌드 및 실행
npm run build
npm run start:prod
```

### 5. 데이터베이스 관리

```bash
# 마이그레이션 생성
npm run migration:create

# 마이그레이션 생성 (변경사항 감지)
npm run migration:generate

# 마이그레이션 실행
npm run migration:run

# 마이그레이션 되돌리기
npm run migration:revert
```

## 🎯 주요 기능

### 1. 인증 시스템

- **이메일/비밀번호 로그인**: 전통적인 로그인 방식
- **소셜 로그인**: 카카오, 네이버, 구글 로그인 지원
- **JWT 토큰 관리**: Access Token (15분) + Refresh Token (2주)
- **이메일 인증**: 회원가입 및 비밀번호 재설정 시 이메일 인증
- **토큰 자동 갱신**: Refresh Token을 통한 자동 토큰 갱신

### 2. 오늘의나 기능

- **오늘의나 작성**: 감정과 함께 일기 작성
- **이미지 업로드**: AWS S3를 통한 이미지 저장
- **접근 권한**: 공개/회원공개/비공개 설정
- **감정 기록**: 감정 상태와 세부 감정 기록
- **유사 사용자**: 비슷한 상황의 사용자 추천

### 3. 자유게시판(커뮤니티) 기능

- **게시글 작성**: 자유로운 게시글 작성
- **댓글 시스템**: 게시글에 대한 댓글 작성
- **반응 시스템**: 좋아요, 공감 등 반응 표현
- **검색 기능**: 게시글 및 사용자 검색

### 4. AI 건강 문답

- **질문 작성**: 건강 관련 질문 작성
- **AI 답변**: OpenAI GPT-4를 통한 의학적 답변
- **이미지 분석**: 질문에 포함된 이미지 분석
- **다국어 지원**: 한국어, 영어, 일본어, 중국어 지원
- **건강 관련 필터링**: 건강 관련 질문만 답변

### 5. 건강매거진

- **건강매거진 작성**: TipTap 에디터를 사용한 리치 텍스트 작성
- **이미지 관리**: 건강매거진 썸네일 및 이미지 관리
- **SEO 최적화**: 건강매거진별 SEO 최적화
- **카테고리 분류**: 암 종류별 건강매거진 분류

### 6. 사용자 관리

- **프로필 관리**: 사용자 프로필 수정
- **암 정보 관리**: 사용자의 암 종류 및 정보 관리
- **활동 내역**: 작성한 게시글, 오늘의나 등 확인

### 7. 알림 시스템

- **파티션 관리**: MySQL 파티션 자동 생성
- **스케줄링**: 매월 1일 오전 0시 0분에 파티션 생성

## 📚 API 문서

### Swagger UI

- **URL**: `http://localhost:8000/api`
- **인증**: Basic Auth (admin/admin123)

### 주요 API 엔드포인트

#### 인증 API

```
POST /auth/login                    # 이메일 로그인
POST /auth/refresh                  # 토큰 갱신
POST /auth/logout                   # 로그아웃
POST /auth/send-verification-email # 이메일 인증 코드 발송
POST /auth/verify-code              # 이메일 인증 코드 확인
POST /auth/complete-registration    # 회원가입 완료
POST /auth/new-password             # 비밀번호 재설정
POST /auth/verify-social-token      # 소셜 로그인 토큰 검증
```

#### 오늘의나 API

```
GET    /diary                       # 오늘의나 목록 조회
POST   /diary                       # 오늘의나 작성
GET    /diary/:id                   # 오늘의나 상세 조회
PUT    /diary/:id                   # 오늘의나 수정
DELETE /diary/:id                   # 오늘의나 삭제
GET    /diary/me                    # 내 오늘의나 조회
GET    /diary/similar-users         # 유사 사용자 오늘의나
```

#### AI 건강 문답 API

```
GET    /questions                   # 질문 목록 조회
POST   /questions                   # 질문 작성
GET    /questions/:id               # 질문 상세 조회
DELETE /questions/:id               # 질문 삭제
GET    /questions/:id/ai-answer     # AI 답변 조회
POST   /questions/:id/feedback      # AI 답변 피드백
```

#### 건강매거진 API

```
GET    /articles                    # 건강매거진 목록 조회
POST   /articles                    # 건강매거진 작성
GET    /articles/:id                # 건강매거진 상세 조회
PUT    /articles/:id                # 건강매거진 수정
DELETE /articles/:id                # 건강매거진 삭제
GET    /articles/cancer/:id         # 암별 건강매거진 조회
```

#### 사용자 API

```
GET    /users                       # 사용자 목록 조회
GET    /users/:id                   # 사용자 상세 조회
PUT    /users/:id                   # 사용자 정보 수정
GET    /users/similar               # 유사 사용자 조회
```

## 🗄️ 데이터베이스

### 주요 테이블 구조

#### 사용자 관련

- `users`: 사용자 기본 정보
- `email_verifications`: 이메일 인증 정보
- `refresh_tokens`: JWT 리프레시 토큰
- `cancer_users`: 사용자 암 정보

#### 콘텐츠 관련

- `diaries`: 오늘의나
- `posts`: 게시글
- `questions`: AI 건강 문답
- `articles`: 건강매거진
- `comments`: 댓글
- `reactions`: 반응

#### 시스템 관련

- `notifications`: 알림 (파티션 테이블)
- `images`: 이미지 정보
- `cancers`: 암 종류 정보

### 파티션 관리

- **테이블**: `notifications`
- **파티션 기준**: UNIX_TIMESTAMP(created_at)
- **스케줄**: 매월 1일 오전 0시 0분
- **자동 생성**: 다음 달 파티션 자동 생성

## 🔐 인증 시스템

### JWT 토큰 구조

```typescript
// Access Token Payload
{
  sub: number,    // 사용자 ID
  email: string,  // 사용자 이메일
  iat: number,    // 발급 시간
  exp: number     // 만료 시간 (15분)
}

// Refresh Token
{
  userId: number,
  token: string,  // UUID
  expiresAt: Date,
  isRevoked: boolean
}
```

### 소셜 로그인 플로우

1. **클라이언트**: 소셜 로그인 토큰 획득
2. **API 서버**: 소셜 토큰 검증
3. **사용자 확인**: 이메일과 provider로 기존 사용자 확인
4. **응답**: 회원가입 필요 여부와 사용자 정보 반환

### 보안 기능

- **비밀번호 해싱**: bcrypt (salt rounds: 10)
- **토큰 만료**: Access Token 15분, Refresh Token 2주
- **토큰 폐기**: 로그아웃 시 Refresh Token 폐기
- **이메일 인증**: 회원가입 및 비밀번호 재설정 시 필수

## 🤖 AI 서비스

### OpenAI GPT-4 통합

- **모델**: GPT-4, GPT-4-turbo (이미지 포함 시)
- **언어 감지**: 자동 언어 감지 (한국어, 영어, 일본어, 중국어)
- **건강 관련 필터링**: 건강 관련 질문만 답변
- **이미지 분석**: 질문에 포함된 이미지 분석
- **재시도 로직**: 최대 3회 재시도

### AI 답변 프로세스

1. **언어 감지**: 질문 언어 자동 감지
2. **질문 요약**: 30자 이내 요약 생성
3. **이미지 처리**: 이미지 URL을 presigned URL로 변환
4. **AI 응답 생성**: GPT-4를 통한 의학적 답변
5. **HTML 포맷팅**: 답변을 HTML 형식으로 변환
6. **로깅**: 대화 내용 로그 저장

## 🚀 배포

### CI/CD 파이프라인

이 프로젝트는 GitHub Actions를 사용하여 자동화된 CI/CD 파이프라인을 구성합니다.

#### 자동 배포 프로세스

1. **main 브랜치에 push** 시 자동으로 CI/CD 파이프라인이 실행됩니다
2. **코드 품질 검사**: ESLint, TypeScript 컴파일, 테스트 실행
3. **Docker 이미지 빌드**: 자동으로 최신 코드로 Docker 이미지 빌드
4. **배포**: AWS ECR에 이미지 푸시 후 자동 배포

#### 배포 환경

- **개발 환경**: `dev` 브랜치 → 개발 서버 자동 배포
- **프로덕션 환경**: `main` 브랜치 → 프로덕션 서버 자동 배포

#### 수동 배포 (필요시)

```bash
# 개발 환경 배포
git push origin dev

# 프로덕션 환경 배포
git push origin main
```

### 환경별 설정

#### 개발 환경

- **API URL**: `https://dev-api.im-together.com`
- **S3 Bucket**: `im-together-bucket-dev`
- **Database**: 개발용 RDS

#### 프로덕션 환경

- **API URL**: `https://prod-api.im-together.com`
- **S3 Bucket**: `im-together-bucket-prod`
- **Database**: 프로덕션용 RDS

## 👨‍💻 개발 가이드

### 코드 스타일

- **ESLint**: 코드 품질 검사
- **Prettier**: 코드 포맷팅
- **TypeScript**: 타입 안전성 보장

### API 개발

```typescript
// 컨트롤러 예시
@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createDiaryDto: CreateDiaryDto, @Req() req: Request) {
    return this.diaryService.create(req.user.id, createDiaryDto);
  }
}
```

### 서비스 개발

```typescript
// 서비스 예시
@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private diaryRepository: Repository<Diary>,
  ) {}

  async create(userId: number, createDiaryDto: CreateDiaryDto) {
    const diary = this.diaryRepository.create({
      authorId: userId,
      ...createDiaryDto,
    });
    return await this.diaryRepository.save(diary);
  }
}
```

### DTO 정의

```typescript
// DTO 예시
export class CreateDiaryDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  accessLevel?: 'public' | 'member' | 'private';
}
```

### 엔티티 정의

```typescript
// 엔티티 예시
@Entity('diaries')
export class Diary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column({ default: 'public' })
  accessLevel: 'public' | 'member' | 'private';

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @CreateDateColumn()
  createdAt: Date;
}
```

## 📄 라이선스

이 프로젝트는 비공개 프로젝트입니다. 무단 사용 및 배포를 금지합니다.

---
