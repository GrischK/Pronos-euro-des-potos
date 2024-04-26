import { DataSource } from "typeorm";
import { join } from "path";
import { env } from "./env";

export default new DataSource({
  type: "postgres",
  host: typeof env.DB_HOST !== "undefined" ? env.DB_HOST : "db",
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  synchronize: true,
  entities: [join(__dirname, "/entities/*.ts")],
  logging: ["query", "error"],
  // logging: ["query", "error"],
});
