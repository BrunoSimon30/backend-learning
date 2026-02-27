import { Router } from "express";
import { HomeController } from "../controllers/index.controller.js";


const router = Router();

router.get("/", HomeController);

export default router;