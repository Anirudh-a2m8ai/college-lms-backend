import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

const SALT_ROUNDS = 10;

export async function generateRandomPassword(): Promise<{
  plainPassword: string;
  hashedPassword: string;
}> {
  const plainPassword = randomBytes(12).toString('base64url');
  const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);

  return {
    plainPassword,
    hashedPassword,
  };
}
