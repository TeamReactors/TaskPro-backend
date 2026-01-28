import { env } from "../utils/env.js";
import { neon } from "@neondatabase/serverless";

const user = env("PGUSER");
const password = env("PGPASSWORD");
const host = env("PGHOST");
const database = env("PGDATABASE");

export const sql = neon(`postgresql://${user}:${password}@${host}/${database}`);

export const connectPostreSQL = async () => {
  try {
    // email unique keyword 
    await sql`
            CREATE TABLE IF NOT EXISTS users(
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE, 
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
    // columns one cekildi position eklendi
    await sql`
      CREATE TABLE IF NOT EXISTS columns(
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        board_id INTEGER REFERENCES board(id) ON DELETE CASCADE,
        position INTEGER DEFAULT 0, 
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );`;
    // position eklendi
    await sql`
      CREATE TABLE IF NOT EXISTS task(
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        priority VARCHAR(20) DEFAULT 'Low', 
        column_id INTEGER REFERENCES columns(id) ON DELETE CASCADE,
        board_id INTEGER REFERENCES board(id) ON DELETE CASCADE,
        deadline TIMESTAMP WITH TIME ZONE,
        position INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );`;

    console.log("Bağlantı başarılı");
  } catch (error) {
    console.log("Başarısız");
    throw error;
  }
};
