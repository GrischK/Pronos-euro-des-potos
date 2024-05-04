import { DataSource } from "typeorm";
// import { env } from "./env";
import { entities } from "./entities";

export default new DataSource({
  type: "postgres",
  // host: typeof env.DB_HOST !== "undefined" ? env.DB_HOST : "db",
  // port: env.DB_PORT,
  // username: env.DB_USER,
  // password: env.DB_PASS,
  // database: env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  entities,
  logging: ["query", "error"],
  // logging: ["query", "error"],
});
