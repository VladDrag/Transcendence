import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as session from 'express-session';
import { SessionOptions } from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import './socket-server';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const sessionOptions: SessionOptions = {
    //@Andrej when implementing authetication feel free to change this.
    secret: process.env.SESSION_SECRET, //keep in mind that u havet fix shared session services and delete GET login function from users.
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
    },
  };

  app.use(session(sessionOptions));
  app.enableCors({
    origin: 'http://localhost:3001', // frontend url
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT);
  console.log('Server is running on port ' + process.env.PORT + '.');
  console.log('Access the app at http://localhost:' + process.env.PORT + '/');
}
bootstrap();
