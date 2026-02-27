import {Router} from "express";
import { getIndex } from "../controllers/index.controller.js";
const indexRouter = Router();


indexRouter.get("/", getIndex);

export default indexRouter;