import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const router = Router();

router.get("/", isLoggedIn, userController);

export default router;