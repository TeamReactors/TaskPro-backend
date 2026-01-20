import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { sql } from "../db/connectPostreSQL.js";
import { env } from "../utils/env.js";

const createSession = async (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    env("JWT_SECRET"),
    { expiresIn: env("JWT_ACCESS_EXPIRES_IN", "15m") } 
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    env("JWT_SECRET"),
    { expiresIn: env("JWT_REFRESH_EXPIRES_IN", "7d") }
  );

  const session = await sql`
    INSERT INTO sessions (user_id, refresh_token, refresh_token_valid_until)
    VALUES (
      ${user.id}, 
      ${refreshToken}, 
      NOW() + INTERVAL '7 days'
    )
    RETURNING id, refresh_token, refresh_token_valid_until
  `;

  return {
    accessToken,
    refreshToken,
    sessionId: session[0].id,
  };
};

export const registerUser = async (payload) => {
  const existingUser = await sql`SELECT email FROM users WHERE email = ${payload.email}`;
  
  if (existingUser.length > 0) {
    throw createHttpError(409, "Email in use");
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  const newUserResult = await sql`
    INSERT INTO users (name, email, password) 
    VALUES (${payload.name}, ${payload.email}, ${encryptedPassword}) 
    RETURNING id, name, email
  `;

  const user = newUserResult[0];
  
  const sessionData = await createSession(user);

  return {
    user,
    ...sessionData,
  };
};

export const loginUser = async (payload) => {
  const userResult = await sql`SELECT * FROM users WHERE email = ${payload.email}`;
  const user = userResult[0];

  if (!user) {
    throw createHttpError(401, "Email or password invalid");
  }

  const kh = await bcrypt.compare(payload.password, user.password);

  if (!kh) {
    throw createHttpError(401, "Email or password invalid");
  }

  const sessionData = await createSession(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    ...sessionData,
  };
};

export const logoutUser = async (refreshToken) => {
  await sql`DELETE FROM sessions WHERE refresh_token = ${refreshToken}`;
};

export const refreshUserSession = async (currentRefreshToken) => {
  try {
    const decoded = jwt.verify(currentRefreshToken, env("JWT_SECRET"));

    const sessionResult = await sql`
      SELECT * FROM sessions 
      WHERE refresh_token = ${currentRefreshToken} 
      AND refresh_token_valid_until > NOW()
    `;

    if (sessionResult.length === 0) {
      throw createHttpError(401, "Session expired or invalid");
    }

    await sql`DELETE FROM sessions WHERE refresh_token = ${currentRefreshToken}`;

    const user = { id: decoded.id, email: decoded.email };
    const newSession = await createSession(user);

    return newSession;

  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    throw createHttpError(401, "Invalid refresh token");
  }
};

// diğer oturumları kapatma methodu
export const logoutAllOtherSessions = async (userId, currentSessionId) => {
  await sql`
    DELETE FROM sessions 
    WHERE user_id = ${userId} 
    AND id != ${currentSessionId}
  `;
};