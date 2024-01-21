import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { MesengersService } from './orders/mesengers.service';
import * as session from 'express-session';
import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';

let server: Handler;

async function start() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(express), {
    cors: true,
  });
  app.use(
    session({
      secret: process.env.GOOGLE_CLIENT_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000,
      },
    }),
  );
  app
    .enableCors
    // {
    // origin: 'https://www.wechirka.com',
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // credentials: true,
    // }
    ();
  const mesengersService = app.get(MesengersService);

  await mesengersService.startServer();
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await start());
  return server(event, context, callback);
};
