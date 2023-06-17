import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

async function start() {
  const PORT = process.env.PORT || 6000;
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(express),
    { cors: true }
  );
  app.enableCors();
  await app.listen(PORT, () =>
    console.log(`Server started on port = http://localhost:${PORT}`));
}
start();
