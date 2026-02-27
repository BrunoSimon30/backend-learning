import { Router } from "express";
import { login, register, verifyOtp } from "../Controller/auth.controller.js";
import { uploadFiler } from "../Utils/fileFilter.js";
import { authMiddleware } from "../Middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", uploadFiler.single("image"), register);
authRouter.post("/verify", authMiddleware, verifyOtp);
authRouter.post("/login", login);

export default authRouter;