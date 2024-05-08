"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const env_1 = require("./env");
const entities_1 = require("./entities");
exports.default = new typeorm_1.DataSource({
    type: "postgres",
    host: typeof env_1.env.DB_HOST !== "undefined" ? env_1.env.DB_HOST : "db",
    port: env_1.env.DB_PORT,
    username: env_1.env.DB_USER,
    password: env_1.env.DB_PASS,
    database: env_1.env.DB_NAME,
    synchronize: true,
    entities: entities_1.entities,
    logging: true,
    // logging: ["query", "error"],
});
