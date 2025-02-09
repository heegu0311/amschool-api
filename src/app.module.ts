import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataSourceOptions } from 'typeorm';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { User } from './users/entities/user.entity';
import { Article } from './articles/entities/article.entity';
import { Comment } from './articles/entities/comment.entity';
import { Reply } from './articles/entities/reply.entity';
import { Category } from './articles/entities/category.entity';
import { ArticleLike } from './articles/entities/article-like.entity';
import { CommentLike } from './articles/entities/comment-like.entity';
import { ReplyLike } from './articles/entities/reply-like.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
        entities: [
          User,
          Article,
          Comment,
          Reply,
          Category,
          ArticleLike,
          CommentLike,
          ReplyLike,
        ],
        synchronize: true,
      }),
    }),
    UsersModule,
    ArticlesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
