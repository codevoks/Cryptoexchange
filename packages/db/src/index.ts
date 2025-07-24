import * as path from 'path';
import dotenv from 'dotenv';

if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
}
export * from './lib/index';
export * from '@prisma/client';