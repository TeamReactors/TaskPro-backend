import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerSchema, loginSchema } from "../validation/auth.js";
import { 
  registerController, 
  loginController, 
  logoutController, 
  refreshController,
  logoutOtherSessionsController 
} from "../controller/auth.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.post("/register", validateBody(registerSchema), ctrlWrapper(registerController));
router.post("/login", validateBody(loginSchema), ctrlWrapper(loginController));
router.post("/logout", ctrlWrapper(logoutController));
router.post("/refresh", ctrlWrapper(refreshController));
router.post("/logout-others", authenticate, ctrlWrapper(logoutOtherSessionsController));

export default router;