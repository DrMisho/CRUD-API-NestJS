import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import  {contentParser} from "fastify-multer"
import {join} from "path"
import helmet from "fastify-helmet"
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';



async function bootstrap() {



  const app = await NestFactory.create<NestFastifyApplication>( AppModule, new FastifyAdapter() );


  const config = new DocumentBuilder()
    .setTitle('User CRUD')
    .setDescription('User CRUD Project for testing')
    .setVersion('1.0')
    .addTag('User')
    .addTag('Product')
    .addBearerAuth()
    .build()


  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });
  app.register(contentParser)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    }),
  );

  app.useStaticAssets({root:join(__dirname,"../../pattern")})


  await app.listen(3000);
  
}
bootstrap();