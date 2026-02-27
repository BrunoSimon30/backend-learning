import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
import { uploadFiler } from "../utils/fileFilter.js";

const authRouter = Router();

authRouter.route("/register").post(
  uploadFiler.fields([
    {
        name: "profileImage",
        maxCount: 1,
    },
    {
        name: "coverImage",
        maxCount: 1,
    }
  ]),
  register,
);

export default authRouter;
