import {config as loadConfig} from 'dotenv'
loadConfig()
console.log(process.env)
import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      database: "node_pg",
      user: process.env.DB_USER || "root",
      host: process.env.DB_HOST || "localhost",
      password: process.env.DB_PASSWORD || "password",
      port: Number(process.env.DB_PORT) || 5432,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

export default config;
