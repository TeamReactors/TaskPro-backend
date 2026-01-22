import { sql } from "../db/connectPostreSQL.js";
import createHttpError from "http-errors"; 

export const addBoardService = async (payload) => {
  const board = await sql`
    INSERT INTO board(title, user_id) 
    VALUES(${payload.title}, ${payload.user_id}) 
    RETURNING *
  `;
  return board;
};

export const fetchBoardService = async (userId) => {
  const board = await sql`SELECT * FROM board WHERE user_id=${userId}`;
  return board;
};

export const deleteBoardService = async (boardId, userId) => {
  const result = await sql`
    DELETE FROM board 
    WHERE id=${boardId} AND user_id=${userId} 
    RETURNING id
  `;

  if (result.length === 0) {
    throw createHttpError(404, "Board not found");
  }
};

