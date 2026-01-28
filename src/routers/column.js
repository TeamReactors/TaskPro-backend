import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  addColumnController,
  deleteColumnController,
  fetchColumnController,
  updateColumnController,
} from "../controller/column.js";
import { addColumnSchema, updateColumnSchema } from "../validation/column.js";

const router = Router();

router.use(authenticate);

router.post("/", validateBody(addColumnSchema), addColumnController);
router.get("/:boardId", fetchColumnController);
router.delete("/:columnId", deleteColumnController);
router.patch(
  "/:columnId",
  validateBody(updateColumnSchema),
  updateColumnController,
);

export default router;
