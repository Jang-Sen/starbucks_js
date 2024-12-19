import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { ProductModule } from '@product/product.module';
import { DbModule } from '@db/db.module';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { EmailModule } from '@email/email.module';
import { AppController } from '@root/app.controller';
import { AppService } from '@root/app.service';
import { RedisModule } from '@redis/redis.module';
import { AgreeOfTermModule } from '@agree-of-term/agree-of-term.module';
import { MinioClientModule } from '@minio-client/minio-client.module';
import { NoticeModule } from '@notice/notice.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { CommentModule } from '@comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_DB: Joi.string().required(),

        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_TTL: Joi.number().required(),

        MINIO_ENDPOINT: Joi.string().required(),
        MINIO_PORT: Joi.number().required(),
        // MINIO_ACCESS_KEY: Joi.string().required(),
        // MINIO_SECRET_KEY: Joi.string().required(),
        MINIO_ROOT_USER: Joi.string().required(),
        MINIO_ROOT_PASSWORD: Joi.string().required(),
        MINIO_BUCKET: Joi.string().required(),

        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),

        EMAIL_BASE_FRONT_URL: Joi.string().required(),

        TOKEN_SECRET: Joi.string().required(),
        TOKEN_EXPIRATION_TIME: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        FIND_PASSWORD_TOKEN: Joi.string().required(),
        FIND_PASSWORD_EXPIRATION_TIME: Joi.string().required(),

        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_CALLBACK_URL: Joi.string().required(),
        KAKAO_CLIENT_ID: Joi.string().required(),
        KAKAO_CALLBACK_URL: Joi.string().required(),
        NAVER_CLIENT_ID: Joi.string().required(),
        NAVER_CLIENT_SECRET: Joi.string().required(),
        NAVER_CALLBACK_URL: Joi.string().required(),
      }),
      envFilePath: '.env', // 환경 변수 파일 경로 명시
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ScheduleModule.forRoot({}),
    ProductModule,
    DbModule,
    UserModule,
    AuthModule,
    EmailModule,
    RedisModule,
    AgreeOfTermModule,
    MinioClientModule,
    NoticeModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
