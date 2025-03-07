import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '@root/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { TransformInterceptor } from '@common/interceptor/transform.interceptor';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.setGlobalPrefix('api'); // url에 api 추가
  app.use(cookieParser()); // cookie 사용
  app.enableCors(); // 허용된 ip 만 접속 가능하도록 설정

  // url versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // port
  const configService: ConfigService = app.get(ConfigService);
  const port = configService.get('BACKEND_PORT');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Starbucks_js API')
    .setDescription('Starbucks_js API Description')
    .addBearerAuth()
    .addServer('/api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(port);
}

bootstrap();
