# 빌드 스테이지
FROM node:20-alpine AS builder

WORKDIR /app

# pnpm 설치
RUN npm install -g pnpm

# 패키지 파일 복사 및 설치
COPY package*.json ./
RUN pnpm install

# 소스 코드 복사 및 빌드
COPY . .
RUN pnpm run build

# 프로덕션 스테이지
FROM node:20-alpine AS production

WORKDIR /app

# pnpm 설치
RUN npm install -g pnpm

# 프로덕션 종속성만 설치
COPY package*.json ./
RUN pnpm install --prod

# 빌드된 파일 복사
COPY --from=builder /app/dist ./dist
COPY .env .env

# 서버 실행
EXPOSE 3000
CMD ["node", "dist/main"]