import "dotenv/config";

export const env = {
  // Server
  APP_PORT: process.env.APP_PORT,
  APP_SECRET: process.env.APP_SECRET,

  // Database
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,

  // Client URL
  CLIENT_URL: process.env.CLIENT_URL,
};
