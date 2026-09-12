import { Controller, Get, Header, NotFoundException, Render, Res } from '@nestjs/common';
import { join } from 'node:path';
import type { Response } from 'express';
import { AssetsService } from '../common/assets.service';
import { ProfileService } from '../profile/profile.service';

@Controller()
export class PageController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly assets: AssetsService,
  ) {}

  @Get()
  @Render('index')
  index(@Res({ passthrough: true }) res: Response): Record<string, unknown> {
    return {
      profile: this.profileService.getProfile(),
      meta: this.profileService.getMeta(),
      jsonLd: this.profileService.getStructuredData(),
      assets: this.assets,
      nonce: res.locals.cspNonce as string,
      year: new Date().getFullYear(),
    };
  }

  /** Downloads the CV, named for the visitor's filesystem rather than ours. */
  @Get('cv')
  downloadCv(@Res() res: Response): void {
    const { source, filename } = this.profileService.getProfile().cv;
    res.download(join(__dirname, '..', '..', 'public', source), filename, (error) => {
      if (error && !res.headersSent) {
        throw new NotFoundException('The CV is not available right now.');
      }
    });
  }

  @Get('robots.txt')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  robots(): string {
    const { url } = this.profileService.getMeta();
    return ['User-agent: *', 'Allow: /', '', `Sitemap: ${url}/sitemap.xml`, ''].join('\n');
  }

  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  sitemap(): string {
    const { url } = this.profileService.getMeta();
    const lastmod = new Date().toISOString().slice(0, 10);
    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      `  <url><loc>${url}/</loc><lastmod>${lastmod}</lastmod><priority>1.0</priority></url>`,
      '</urlset>',
      '',
    ].join('\n');
  }
}
