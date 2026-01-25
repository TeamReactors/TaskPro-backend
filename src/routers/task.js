import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validateBody } from "../middlewares/validateBody.js";

// Controller
import {
  fetchTasksByBoardIdController,
  addTaskByBoardIdController,
  deleteTaskByIdController,
  moveTaskByIdController,
} from "../controller/task.js";

// Validation
import { addTaskSchema, moveTaskColumnSchema } from "../validation/task.js";

const router = Router();

// Get all tasks for a specific board
router.get(
  "/:boardId",
  authenticate,
  ctrlWrapper(fetchTasksByBoardIdController),
);
router.post(
  "/:boardId",
  authenticate,
  validateBody(addTaskSchema),
  ctrlWrapper(addTaskByBoardIdController),
);
// Delete a Task By Board ID
router.delete(
  "/:boardId/:taskId",
  authenticate,
  ctrlWrapper(deleteTaskByIdController),
);

// Move Task to another new column
router.patch(
  "/:boardId/:taskId/move",
  authenticate,
  validateBody(moveTaskColumnSchema),
  ctrlWrapper(moveTaskByIdController),
);
export default router;
