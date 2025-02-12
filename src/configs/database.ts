import mysql from "mysql2/promise";
import { env } from "./env";

const db = mysql.createPool({
  host: env.DB_HOST,
  port: Number.parseInt(env.DB_PORT as string),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});

export default db;

import type { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

type DatabaseClient = Pool;
type Result = ResultSetHeader;
type Row = RowDataPacket[];

export type { DatabaseClient, Result, Row };
