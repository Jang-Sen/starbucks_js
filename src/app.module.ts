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
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_DB: Joi.string().required(),
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        TOKEN_SECRET: Joi.string().required(),
        TOKEN_EXPIRATION_TIME: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_CALLBACK_URL: Joi.string().required(),
        KAKAO_CLIENT_ID: Joi.string().required(),
        KAKAO_CALLBACK_URL: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_TTL: Joi.number().required(),
      }),
      envFilePath: 'docker.env', // 환경 변수 파일 경로 명시
    }),
    ProductModule,
    DbModule,
    UserModule,
    AuthModule,
    EmailModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
