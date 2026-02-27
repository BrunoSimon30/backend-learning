import {Router} from "express";
import { getUser, loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/profile", authenticateUser, getUser);


export default userRouter;