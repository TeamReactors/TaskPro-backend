import { env } from "../utils/env.js";
import { neon } from "@neondatabase/serverless";

const user = env("PGUSER");
const password = env("PGPASSWORD");
const host = env("PGHOST");
const database = env("PGDATABASE");

export const sql = neon(`postgresql://${user}:${password}@${host}/${database}`);

export const connectPostreSQL = async () => {
  try {
    await sql`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                password VARCHAR(255) NOT NULL
            );
        `;
    console.log("Bağlantı başarılı");
  } catch (error) {
    console.log("Başarısız");
    throw error;
  }
};
