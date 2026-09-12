import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import type { Response } from 'express';
import hbs from 'hbs';
import helmet from 'helmet';
import { join } from 'node:path';
import { AppModule } from './app.module';
import { cspNonce } from './common/csp-nonce.middleware';

function registerPartials(dir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    hbs.registerPartials(dir, (error?: Error) => (error ? reject(error) : resolve()));
  });
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  app.use(compression());
  app.use(cspNonce());
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          baseUri: ["'self'"],
          frameAncestors: ["'self'"],
          objectSrc: ["'none'"],
          formAction: ["'self'"],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          scriptSrc: [
            "'self'",
            (_req, res) => `'nonce-${(res as unknown as Response).locals.cspNonce as string}'`,
          ],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  const viewsDir = join(__dirname, '..', 'views');
  app.setBaseViewsDir(viewsDir);
  app.setViewEngine('hbs');
  hbs.registerHelper(
    'startsWith',
    (value: unknown, prefix: string) => typeof value === 'string' && value.startsWith(prefix),
  );
  await registerPartials(join(viewsDir, 'partials'));
  app.set('trust proxy', 1);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  const port = config.get<number>('PORT', 3000);
  await app.listen(port, '0.0.0.0');
  Logger.log(`Portfolio running on http://localhost:${port}`, 'Bootstrap');
}

void bootstrap();
