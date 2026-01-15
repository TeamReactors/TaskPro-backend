import { Router } from "express";
import boardRoute from "./board.js";
import authRoute from "./auth.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/board", boardRoute);

export default router;