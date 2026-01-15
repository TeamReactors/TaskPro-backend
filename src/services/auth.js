import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { sql } from "../db/connectPostreSQL.js";
import { env } from "../utils/env.js";

export const registerUser = async (payload) => {
  const existingUser = await sql`SELECT email FROM users WHERE email = ${payload.email}`;
  
  if (existingUser.length > 0) {
    throw createHttpError(409, "Email in use");
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await sql`
    INSERT INTO users (name, email, password) 
    VALUES (${payload.name}, ${payload.email}, ${encryptedPassword}) 
    RETURNING id, name, email
  `;

  return newUser[0];
};

export const loginUser = async (payload) => {
  const userResult = await sql`SELECT * FROM users WHERE email = ${payload.email}`;
  const user = userResult[0];

  if (!user) {
    throw createHttpError(401, "Email or password invalid");
  }

  const passwordCompare = await bcrypt.compare(payload.password, user.password);

  if (!passwordCompare) {
    throw createHttpError(401, "Email or password invalid");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    env("JWT_SECRET"),
    { expiresIn: env("JWT_EXPIRES_IN", "24h") }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};