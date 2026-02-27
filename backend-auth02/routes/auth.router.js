import { Router } from "express";
import { getUserProfile, loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/protect.js";
import passport from "passport";
import { uploadFiler } from "../utils/fileFilter.js";


const authRouter = Router();
authRouter.post("/register", uploadFiler.single("profilePicture"), registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/logout", logoutUser);
authRouter.get("/profile",protect, getUserProfile);
authRouter.get("/google", passport.authenticate("google", { scope: ["profile","email"] }));
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.json({ user: req.user });
  }
);

export default authRouter;