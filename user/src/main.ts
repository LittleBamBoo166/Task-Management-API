import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';

const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  // config the swagger document
  const config = new DocumentBuilder()
    .setTitle('User microservice')
    .setDescription('User APIs')
    .setVersion('1.3')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: process.env.HOST,
      port: parseInt(process.env.CONNECT_PORT),
    },
  });
  await app.startAllMicroservices();
  await app
    .listen(parseInt(process.env.LISTEN_PORT))
    .then(() => {
      logger.log(
        `🚀  User microservice is listening on port ${parseInt(
          process.env.LISTEN_PORT,
        )}`,
      );
    })
    .catch((error: Error) => {
      logger.error(error.message, error.stack);
    });
}
bootstrap();
