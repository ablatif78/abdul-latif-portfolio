import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Resolves a project directory that ships alongside the code.
 *
 * Locally the compiled app runs from `dist/`, so the directory sits one level
 * up. On a serverless host the entry point is bundled elsewhere and the files
 * arrive relative to the working directory instead, so both are tried.
 */
function resolveDir(name: string): string {
  const candidates = [
    join(__dirname, '..', '..', name),
    join(__dirname, '..', name),
    join(process.cwd(), name),
  ];

  return candidates.find((candidate) => existsSync(candidate)) ?? candidates[0];
}

export const VIEWS_DIR = resolveDir('views');
export const PUBLIC_DIR = resolveDir('public');
