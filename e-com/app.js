import "./config/loadenv.js";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import express from "express";
import mongooseConnection from "./config/mongoose.connection.js";
import indexRouter from "./routes/index.router.js";
import userRouter from "./routes/user.router.js";
import productsRouter from "./routes/products.router.js";
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
mongooseConnection();


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); 
app.use("/", indexRouter);
app.use("/auth", userRouter);
app.use("/products", productsRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});