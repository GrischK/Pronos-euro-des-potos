import { DataSource } from "typeorm";
import { env } from "./env";
import User from './entities/Users'

export default new DataSource({
    type: "postgres",
    host: typeof env.DB_HOST !== "undefined" ? env.DB_HOST : "db",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "postgres",
    synchronize: true,
    entities: [User],
    logging: ["error"],
});