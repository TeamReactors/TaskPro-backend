import { sql } from "../db/connectPostreSQL.js";
import createHttpError from "http-errors";

/**
 * Fetches all tasks associated with a specific board ID from the database.
 *
 * @async
 * @function fetchTasksByBoardIdService
 * @param {string|number} boardId - The unique identifier of the board to fetch tasks for
 * @returns {Promise<Array>} A promise that resolves to an array of task objects from the database
 * @throws {HttpError} Throws a 400 HTTP error if boardId is not provided
 * @example
 * const tasks = await fetchTasksByBoardIdService(123);
 */
export const fetchTasksByBoardIdService = async (boardId) => {
  if (!boardId) {
    throw createHttpError(400, "Board ID is required");
  }
  const result = await sql`
  Select * From task WHERE board_id = ${boardId} ORDER BY position ASC
    `;
  return result;
};

/**
 * Creates a new task in the database for a specific board.
 *
 * @async
 * @function createTaskByBoardIdService
 * @param {string|number} boardId - The ID of the board to which the task belongs
 * @param {Object} payload - The task data object
 * @param {string} payload.title - The title of the task
 * @param {string} payload.description - The description of the task
 * @param {string} payload.priority - The priority level of the task
 * @param {string|number} payload.column_id - The ID of the column where the task will be placed
 * @param {string|Date} payload.deadline - The deadline for the task
 * @returns {Promise<Object>} The created task object
 * @throws {Error} If the database operation fails
 */
export const createTaskByBoardIdService = async (boardId, payload) => {
  console.log("Creating task with payload:", payload);

  const maxPositionResult = await sql`
    SELECT MAX(position) as max_pos 
    FROM task 
    WHERE column_id = ${payload.column_id}
  `;

  const newPosition = (maxPositionResult[0]?.max_pos || 0) + 1;

  const result = await sql`
    INSERT INTO 
        task 
        (title,description,priority,column_id,board_id,deadline,position) 
    VALUES
        (${payload.title}, ${payload.description}, ${payload.priority}, ${payload.column_id}, ${boardId}, ${payload.deadline}, ${newPosition})
    RETURNING *
    `;
  return result;
};

/**
 * Deletes a task from the database by its ID.
 *
 * @async
 * @function deleteTaskByIdService
 * @param {string|number} taskId - The unique identifier of the task to delete
 * @returns {Promise<Object>} The deleted task object
 * @throws {HttpError} 404 error if the task with the specified ID is not found
 * @example
 * const deletedTask = await deleteTaskByIdService(123);
 */
export const deleteTaskByIdService = async (taskId) => {
  const result = await sql`
    DELETE FROM task 
    WHERE id = ${taskId}
    RETURNING *
    `;

  if (result.length === 0) {
    throw createHttpError(404, "Task not found");
  }
  return result[0];
};

/**
 * Moves a task to a different column OR position within a board
 * @async
 * @function moveTaskByIdService
 * @param {string|number} taskId - The ID of the task to move
 * @param {string|number} boardId - The ID of the board containing the task
 * @param {Object} payload - The data containing new column and position
 * @param {number} payload.column_id - The ID of the destination column
 * @param {number} [payload.position] - The new position index (optional)
 * @returns {Promise<Object>} The updated task object
 * @throws {Error} 404 error if task not found or doesn't belong to the specified board
 */
export const moveTaskByIdService = async (taskId, boardId, payload) => {
  const { column_id: newColumnId, position: newPosition } = payload;

  const currentTaskResult = await sql`SELECT * FROM task WHERE id = ${taskId} AND board_id = ${boardId}`;
  if (currentTaskResult.length === 0) {
    throw createHttpError(404, "Task not found");
  }
  const currentTask = currentTaskResult[0];
  const oldColumnId = currentTask.column_id;
  const oldPosition = currentTask.position;

  let targetPosition = newPosition;
  if (targetPosition === undefined || targetPosition === null) {
      const maxPos = await sql`SELECT MAX(position) as max_pos FROM task WHERE column_id = ${newColumnId}`;
      targetPosition = (maxPos[0].max_pos || 0) + 1;
  }

  if (oldColumnId === newColumnId) {
      if (oldPosition === targetPosition) return currentTask;

      if (targetPosition > oldPosition) {
          await sql`
              UPDATE task SET position = position - 1
              WHERE column_id = ${oldColumnId}
              AND position > ${oldPosition} AND position <= ${targetPosition}
          `;
      } else {
          await sql`
              UPDATE task SET position = position + 1
              WHERE column_id = ${oldColumnId}
              AND position >= ${targetPosition} AND position < ${oldPosition}
          `;
      }
  }
  else {
      await sql`
          UPDATE task SET position = position - 1
          WHERE column_id = ${oldColumnId} AND position > ${oldPosition}
      `;
      await sql`
          UPDATE task SET position = position + 1
          WHERE column_id = ${newColumnId} AND position >= ${targetPosition}
      `;
  }

  const result = await sql`
    UPDATE task SET column_id = ${newColumnId}, position = ${targetPosition}
    WHERE id = ${taskId} and board_id = ${boardId}
    RETURNING *
  `;
  
  return result[0];
};
