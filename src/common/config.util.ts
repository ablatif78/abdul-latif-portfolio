import { ConfigService } from '@nestjs/config';

/**
 * Reads a setting, treating an empty or whitespace-only value as missing.
 *
 * Hosting dashboards happily accept a variable with a blank value, and
 * ConfigService's own default only applies when the key is absent entirely —
 * so without this an empty box silently becomes an empty string.
 */
export function readSetting(config: ConfigService, key: string, fallback: string): string {
  const value = config.get<string>(key)?.trim();
  return value && value.length > 0 ? value : fallback;
}
