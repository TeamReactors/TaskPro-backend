import { sql } from "../db/connectPostreSQL.js";

export const addColumnService = async (payload) => {
  const column =
    await sql`INSERT INTO column(title,board_id) VALUES(${payload.title},${payload.boardId}) RETURNING *`;

  return column;
};
export const fetchColumnService = async (id) => {
  const columns = await sql`SELECT * FROM column WHERE board_id=${id}`;

  return columns;
};
export const deleteColumnService = async (id) => {
  await sql`DELETE FROM column WHERE id = ${id}`;
};
export const updateColumnService = async (payload, id) => {
  const column =
    await sql`UPDATE column SET title=${payload.title} WHERE id=${id}`;

  return column;
};
