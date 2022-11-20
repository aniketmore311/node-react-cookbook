import { Pool } from "pg";

let pool = new Pool({
  database: "node_pg",
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: 5432,
  password: process.env.DB_PASSWORD,
});

export default pool;
