import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validateBody } from "../middlewares/validateBody.js";

// Controller
import {
  fetchTasksByBoardIdController,
  addTaskByBoardIdController,
} from "../controller/task.js";

// Validation
import { addTaskSchema } from "../validation/task.js";

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
export default router;
