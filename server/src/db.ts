import { DataSource } from "typeorm";
import { env } from "./env";
import { entities } from "./entities";

export default new DataSource({
  type: "postgres",
  host: typeof env.DB_HOST !== "undefined" ? env.DB_HOST : "db",
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  synchronize: true,
  entities,
  logging: true,
  // logging: ["query", "error"],
});
