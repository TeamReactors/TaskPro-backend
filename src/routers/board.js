import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  addBoardController,
  deleteBoardController,
  fetchBoardController,
} from "../controller/board.js";
import { validateBody } from "../middlewares/validateBody.js";
import { addBoardSchema } from "../validation/board.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.use(authenticate);

router.post("/",
  validateBody(addBoardSchema),
  ctrlWrapper(addBoardController));
router.get("/",
  ctrlWrapper(fetchBoardController));
router.delete("/:boardId",
  ctrlWrapper(deleteBoardController));

export default router;