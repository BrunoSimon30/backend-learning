import { uploadFiler } from "../utils/fileFilter.js";
import { Router } from "express";
import { authenticateUser, isAuthenticatedSeller } from "../middlewares/auth.middleware.js";
import { createProduct, getProductById, getProducts } from "../controllers/product.controller.js";
const productsRouter = Router();



productsRouter.get("/", getProducts);
productsRouter.get("/:id", getProductById);
productsRouter.use(authenticateUser).use(isAuthenticatedSeller);
productsRouter.post("/create",  uploadFiler.single("image"), createProduct);



export default productsRouter;