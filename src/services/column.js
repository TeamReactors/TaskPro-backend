import { sql } from "../db/connectPostreSQL.js";

export const addColumnService = async (payload) => {
  const maxPositionResult = await sql`
    SELECT MAX(position) as max_pos 
    FROM columns 
    WHERE board_id = ${payload.board_id}
  `;

  const nextPosition = (maxPositionResult[0]?.max_pos !== null) 
    ? maxPositionResult[0].max_pos + 1 
    : 0;

  const finalPosition = payload.position !== undefined ? payload.position : nextPosition;

  const column = await sql`
    INSERT INTO columns (title, board_id, position) 
    VALUES (${payload.title}, ${payload.board_id}, ${finalPosition}) 
    RETURNING *
  `;
  return column;
};

export const fetchColumnService = async (id) => {
  const columns = await sql`SELECT * FROM columns WHERE board_id=${id} ORDER BY position ASC`;
  return columns;
};

export const deleteColumnService = async (id) => {
  await sql`DELETE FROM columns WHERE id = ${id}`;
};

export const updateColumnService = async (payload, id) => {
  const column = await sql`UPDATE columns SET title=${payload.title} WHERE id=${id} RETURNING *`;
  return column;
};