import crypto from 'crypto';

export interface TokenPayload {
  rawToken: string;
  hashedToken: string;
  expiry: Date;
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateToken(expiresInMinutes = 24 * 60): TokenPayload {
  const rawToken = crypto.randomBytes(32).toString('hex');

  const expiry = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  return {
    rawToken,
    hashedToken: hashToken(rawToken),
    expiry,
  };
}