import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ContactModule } from './contact/contact.module';
import { HealthController } from './health/health.controller';
import { AssetsService } from './common/assets.service';
import { PUBLIC_DIR } from './common/paths';
import { PageController } from './page/page.controller';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 60 }]),
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_DIR,
      serveRoot: '/static',
      serveStaticOptions: { maxAge: '7d', index: false },
    }),
    ProfileModule,
    ContactModule,
  ],
  controllers: [PageController, HealthController],
  providers: [AssetsService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
