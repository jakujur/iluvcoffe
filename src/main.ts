import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //validate if JSON field is of proper type
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //strip and remove invalid properties of an object
      transform: true, //for plain js object to dto conversion and type conversion of parameters
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true, //for implicit type conversion of pagination query
      },
    }),
  );
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(), //for transforming data coming in and out (just like mappers)
    new TimeoutInterceptor(), // for setting timeout error
  );

  app.useGlobalFilters(new HttpExceptionFilter()); //for managing custom exceptions'

  const options = new DocumentBuilder()
    .setTitle('Iluvcoffee')
    .setDescription('Coffee application')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
