import "./config/loadenv.js";
import express from "express";
import logger from "./config/logger.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import http from "http";
import mongooseConnection from "./config/mongoose.connection.js";
import Routes from "./Routes/routes.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


mongooseConnection();
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); 
app.get("/", (req, res) => {
    res.json("Server is healthy! 💪");
});
app.use("/api", Routes());

 
http.createServer(app).listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}` );
});