import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import type { Response } from 'express';
import hbs from 'hbs';
import helmet from 'helmet';
import { join } from 'node:path';
import { cspNonce } from './common/csp-nonce.middleware';
import { VIEWS_DIR } from './common/paths';

function registerPartials(dir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    hbs.registerPartials(dir, (error?: Error) => (error ? reject(error) : resolve()));
  });
}

/** Everything both the standalone server and the serverless entry point need. */
export async function configureApp(app: NestExpressApplication): Promise<void> {
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

  app.setBaseViewsDir(VIEWS_DIR);
  app.setViewEngine('hbs');
  hbs.registerHelper(
    'startsWith',
    (value: unknown, prefix: string) => typeof value === 'string' && value.startsWith(prefix),
  );
  await registerPartials(join(VIEWS_DIR, 'partials'));

  app.set('trust proxy', 1);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );
}
