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
    await sql`
      CREATE TABLE IF NOT EXISTS board(
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS sessions(
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        refresh_token VARCHAR NOT NULL,
        refresh_token_valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS task(
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        priority VARCHAR(10),
        column_id INTEGER REFERENCES columns(id) ON DELETE CASCADE
        board_id INTEGER REFERENCES board(id) ON DELETE CASCADE,
        deadline TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );`;

    await sql`
      CREATE TABLE IF NOT EXISTS columns(
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        board_id INTEGER REFERENCES board(id) ON DELETE CASCADE
      );`;

    console.log("Bağlantı başarılı");
  } catch (error) {
    console.log("Başarısız");
    throw error;
  }
};
