import Joi from "joi";

/**
 * Joi validation schema for adding a new task.
 *
 * @typedef {Object} AddTaskSchema
 * @property {string} title - The title of the task (required)
 * @property {string} [description] - The description of the task (optional, max 500 characters)
 * @property {('low'|'medium'|'high')} priority - The priority level of the task (required)
 * @property {number} column_id - The ID of the column where the task belongs (required)
 * @property {Date} deadline - The deadline for the task (required)
 */
export const addTaskSchema = Joi.object({
  title: Joi.string().required("Title is required"),
  description: Joi.string().max(500),
  priority: Joi.string()
    .valid("low", "medium", "high")
    .required("Priority is required"),
  column_id: Joi.number().required("Column ID is required"),
  deadline: Joi.date().required("Deadline is required"),
});

/**
 * Joi validation schema for moving a task to a different column.
 *
 * @constant {Joi.ObjectSchema} moveTaskColumnSchema
 * @property {number} column_id - The ID of the target column where the task will be moved. Required field.
 */
export const moveTaskColumnSchema = Joi.object({
  column_id: Joi.number().required("New Column ID is required"),
  position: Joi.number().optional(),
});
