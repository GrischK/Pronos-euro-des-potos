import { load } from "ts-dotenv";

// https://github.com/LeoBakerHytch/ts-dotenv
export const env = load({
  JWT_PRIVATE_KEY: String,
  CORS_ALLOWED_ORIGINS: String,
  NODE_ENV: ["production" as const, "development" as const, "test" as const],
  SERVER_HOST: String,
  SERVER_PORT: Number,
  DB_HOST: { type: String, optional: true },
  DB_PORT: Number,
  DB_USER: String,
  DB_PASS: String,
  DB_NAME: String,
  FOOTBALL_DATA_API_TOKEN: String,
  EMAIL_ADDRESS: String,
  EMAIL_PASS: String,
  FRONT_URL: String,
});
