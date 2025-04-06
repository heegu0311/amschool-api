# NestJS Project

## Project setup

### Using pnpm

```bash
$ pnpm install
```

### Using Docker

```bash
# Build docker image
$ docker build -t nest-app .

# Run container
$ docker run -p 3000:3000 nest-app
```

## Running the app

### Local Development

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

### Docker Environment

```bash
# Basic run
$ docker run -p 3000:3000 nest-app

# Run with environment variables
$ docker run -p 3000:3000 --env-file .env nest-app

# Run in background
$ docker run -d -p 3000:3000 nest-app

# Stop container
$ docker stop <container_id>
```

## API Documentation (Swagger)

이 프로젝트는 Swagger를 사용하여 API 문서를 자동으로 생성합니다.

### Swagger UI 접속 방법

개발 서버 실행 후 다음 URL로 접속하여 API 문서를 확인할 수 있습니다:

```
http://localhost:8000/api
```

### Swagger 문서 작성 가이드

1. **DTO 클래스 작성**

   - 모든 DTO 클래스에 `@ApiProperty()` 데코레이터를 사용하여 필드 설명 추가
   - 예시:

   ```typescript
   @ApiProperty({
     description: '사용자 이메일',
     example: 'user@example.com',
   })
   email: string;
   ```

2. **컨트롤러 문서화**
   - `@ApiTags()`: 컨트롤러 그룹화
   - `@ApiOperation()`: 각 엔드포인트에 대한 설명
   - `@ApiResponse()`: 응답 타입과 설명
   - `@ApiParam()`: URL 파라미터 설명
   - `@ApiQuery()`: 쿼리 파라미터 설명
   - `@ApiBearerAuth()`: JWT 인증이 필요한 엔드포인트에 추가

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## License

[MIT licensed](LICENSE)

## Environment Variables

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```bash
# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=your_database

# JWT 설정
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=3600

# 이메일 설정
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password

# 소셜 로그인 설정
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
KAKAO_CLIENT_ID=your_kakao_client_id
KAKAO_CLIENT_SECRET=your_kakao_client_secret
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret

# 서버 설정
PORT=8000
NODE_ENV=development
```

## GitHub Actions

이 프로젝트는 GitHub Actions를 사용하여 CI/CD 파이프라인을 구성합니다.

### 주요 워크플로우 파일

1. **`.github/workflows/ci.yml`**

   - 코드 품질 검사 및 테스트 실행
   - 린트 검사, 단위 테스트, E2E 테스트 수행
   - PR 생성 시 자동으로 실행

2. **`.github/workflows/cd.yml`**

   - 배포 자동화
   - main 브랜치에 머지 시 자동 배포
   - Docker 이미지 빌드 및 배포

3. **`.github/workflows/dependency-check.yml`**
   - 의존성 취약점 검사
   - 주기적으로 실행되어 보안 업데이트 확인

### GitHub Actions 사용 방법

1. GitHub 저장소의 Settings > Secrets에서 필요한 시크릿 설정
2. 워크플로우 파일에 정의된 조건에 따라 자동 실행
3. Actions 탭에서 워크플로우 실행 상태 및 결과 확인
