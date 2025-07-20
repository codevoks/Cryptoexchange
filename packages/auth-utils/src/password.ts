import bcrypt from 'bcrypt';

export async function hashPassword(password: string, SALT_ROUNDS: number): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePasswords(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}