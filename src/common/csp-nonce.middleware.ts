import { randomBytes } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

/**
 * Generates a per-request nonce so the inline JSON-LD block passes the CSP.
 * Registered before helmet in main.ts, because helmet reads the nonce when it
 * writes the Content-Security-Policy header. Hex keeps it free of characters
 * that Handlebars would escape inside an attribute.
 */
export function cspNonce() {
  return (_req: Request, res: Response, next: NextFunction): void => {
    res.locals.cspNonce = randomBytes(16).toString('hex');
    next();
  };
}
