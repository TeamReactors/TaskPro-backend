import { sql } from "../db/connectPostreSQL.js";
import createHttpError from "http-errors";

/**
 * Fetches all tasks associated with a specific board ID.
 *
 * @async
 * @function fetchTasksByBoardIdService
 * @param {string|number} boardId - The unique identifier of the board to fetch tasks for
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of task objects containing:
 *   - id: Task identifier
 *   - title: Task title
 *   - description: Task description
 *   - priority: Task priority level
 *   - columnId: Associated column identifier
 *   - deadline: Task deadline date
 *   - create_at: Task creation timestamp
 * @throws {HttpError} Throws a 400 error if boardId is not provided
 * @example
 * const tasks = await fetchTasksByBoardIdService('board-123');
 */
export const fetchTasksByBoardIdService = async (boardId) => {
  if (!boardId) {
    throw createHttpError(400, "Board ID is required");
  }
  const result = await sql`
  Select 
    t.id,
    t.title,
    t.description,
    t.priority,
    t."columnId",
    t.deadline,
    t.create_at
    From
        task as t
    LEFT JOIN
        board as b
    ON 
    t.board_id = b.id
    WHERE
        b.id = ${boardId}`;
  return result;
};

export const createTaskByBoardIdService = async (boardId, payload) => {
  if (!boardId) {
    throw createHttpError(400, "Board ID is required");
  }
  if (!payload) {
    throw createHttpError(400, "Task content is required");
  }
  const result = await sql`
    INSERT INTO 
        task 
        (title,description,priority,"columnId",board_id,deadline) 
    VALUES
        (${payload.title}, ${payload.description}, ${payload.priority}, ${payload.columnId}, ${boardId}, ${payload.deadline})
    RETURNING *
    `;

  return result[0];
};
