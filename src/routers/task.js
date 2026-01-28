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

router.use(authenticate);

// Get all tasks for a specific board
router.get("/:boardId", ctrlWrapper(fetchTasksByBoardIdController));
// Add a Task By Board ID
router.post(
  "/:boardId",
  validateBody(addTaskSchema),
  ctrlWrapper(addTaskByBoardIdController),
);

// Delete a Task By Board ID
router.delete("/:taskId", ctrlWrapper(deleteTaskByIdController));

// Move Task to another new column
router.patch(
  "/:taskId/move",
  validateBody(moveTaskColumnSchema),
  ctrlWrapper(moveTaskByIdController),
);
export default router;
