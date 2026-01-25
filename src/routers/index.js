import { Router } from "express";
import boardRoute from "./board.js";
import authRoute from "./auth.js";
import taskRoute from "./task.js";
const router = Router();

router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Task Pro Backend API is running!",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoute);
router.use("/board", boardRoute);
router.use("/tasks", taskRoute); // Assuming taskRoute is similar to boardRoute

export default router;
