import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import express, { Express } from 'express';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { AppModule } from './app.module';
import { configureApp } from './setup';

/**
 * Entry point for serverless hosts (Vercel). The Express instance is built
 * once per cold start and reused for every request the instance handles.
 */
let cached: Promise<Express> | null = null;

async function createServer(): Promise<Express> {
  const server = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
    { logger: ['error', 'warn', 'log'] },
  );

  await configureApp(app);
  await app.init();
  return server;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  cached ??= createServer();
  const server = await cached;
  server(req as never, res as never);
}
