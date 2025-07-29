// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

const envFilePath = path.resolve(process.cwd(), '../../.env');
const envVars = dotenv.parse(fs.readFileSync(envFilePath));

const publicEnv = {};
for (const key in envVars) {
  if (key.startsWith('NEXT_PUBLIC_')) {
    publicEnv[key] = envVars[key];
  }
}

const nextConfig = {
  reactStrictMode: true,
  env: {
    ...publicEnv,
  },
};

export default nextConfig;