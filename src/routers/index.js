import { Router } from "express";
import boardRoute from "./board.js";

const router = Router();

router.use("/board", boardRoute);

export default router;
