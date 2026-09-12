import { Injectable, Logger } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PUBLIC_DIR } from './paths';

/**
 * Content-hashed URLs for the static assets, so a deploy never serves a stale
 * stylesheet or script from the browser cache.
 */
@Injectable()
export class AssetsService {
  private readonly logger = new Logger(AssetsService.name);
  private readonly publicDir = PUBLIC_DIR;

  readonly styles = this.versioned('styles.css');
  readonly script = this.versioned('main.js');

  private versioned(file: string): string {
    try {
      const hash = createHash('sha1')
        .update(readFileSync(join(this.publicDir, file)))
        .digest('hex')
        .slice(0, 10);
      return `/static/${file}?v=${hash}`;
    } catch {
      this.logger.warn(`Could not hash ${file}; serving it unversioned.`);
      return `/static/${file}`;
    }
  }
}
