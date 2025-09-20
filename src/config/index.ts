import dotenv from 'dotenv';

dotenv.config();

export const config = {
  zenrowsApiKey: process.env.ZENROWS_API_KEY,
  port: process.env.PORT || 3000,
} as const;
