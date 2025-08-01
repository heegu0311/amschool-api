import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleImageModule } from './article-image/article-image.module';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { CancerUserModule } from './cancer-user/cancer-user.module';
import { CancerModule } from './cancer/cancer.module';
import { CommentModule } from './comment/comment.module';
import { DiaryModule } from './diary/diary.module';
import { HttpLoggerMiddleware } from './logger/http-logger.middleware';
import { LoggerModule } from './logger/logger.module';
import { NotificationModule } from './notification/notification.module';
import { PostModule } from './post/post.module';
import { QuestionModule } from './question/question.module';
import { ReactionEntityModule } from './reaction-entity/reaction-entity.module';
import { ReactionModule } from './reaction/reaction.module';
import { SectionPrimaryModule } from './section_primary/section_primary.module';
import { SectionSecondaryModule } from './section_secondary/section_secondary.module';
import { SnakeNamingStrategy } from './snake-naming.strategy';
import { SurveyAnswerUserModule } from './survey-answer-user/survey-answer-user.module';
import { SurveyAnswerModule } from './survey-answer/survey-answer.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15d' },
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): DataSourceOptions => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        namingStrategy: new SnakeNamingStrategy(),
        migrations: ['src/database/migrations/*.ts'],
        migrationsTableName: 'migrations',
        migrationsRun: true,
        timezone: '+09:00',
      }),
    }),
    ScheduleModule.forRoot(),
    LoggerModule,
    UsersModule,
    CancerModule,
    CancerUserModule,
    SurveyAnswerModule,
    AuthModule,
    QuestionModule,
    DiaryModule,
    CommentModule,
    ReactionModule,
    ReactionEntityModule,
    SectionPrimaryModule,
    SectionSecondaryModule,
    ArticleModule,
    ArticleImageModule,
    PostModule,
    SurveyAnswerUserModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  // 미들웨어 적용
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
