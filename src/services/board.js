import { sql } from "../db/connectPostreSQL.js";

export const addBoardService = async (payload) => {
  const board =
    await sql`INSERT INTO board(title,user_id) VALUES(${payload.title},${payload.user_id}) RETURNING *`;

  return board;
};
export const fetchBoardService = async () => {
  const id = 1; // Buraya authenticateden gelen req.user ile yapılacak sabit veri olmayacak
  const board = await sql`SELECT * FROM board WHERE user_id=${id}`;

  return board;
};
export const deleteBoardService = async (id) => {
  const user_id = 1; // Buraya authenticateden gelen req.user ile yapılacak sabit veri olmayacak

  await sql`DELETE FROM board WHERE id=${id} AND user_id=${user_id}`;
};
