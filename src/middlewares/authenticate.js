import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { env } from "../utils/env.js";
import { sql } from "../db/connectPostreSQL.js";

export const authenticate = async (req, res, next) => {
  let token;
  const { authorization = "" } = req.headers;
  const [bearer, headerToken] = authorization.split(" ");

  if (bearer === "Bearer" && headerToken) {
    token = headerToken;
  } 
  else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    next(createHttpError(401, "Not authorized"));
    return;
  }

  try {
    const { id } = jwt.verify(token, env("JWT_SECRET"));
    
    const userResult = await sql`SELECT id, name, email FROM users WHERE id = ${id}`;
    const user = userResult[0];

    if (!user) {
      next(createHttpError(401, "Not authorized"));
      return;
    }

    req.user = user;
    next();
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    next(createHttpError(401, "Not authorized"));
  }
};