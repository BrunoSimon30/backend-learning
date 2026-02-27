import "./config/loadenv.js";
import express from "express";
import cookieParser from "cookie-parser";
import indexRouter from "./routes/index.router.js";
import userRouter from "./routes/user.router.js";
import path from "path";
import { fileURLToPath } from "url";
import mongooseConnection from "./config/mongoose.connection.js";
import logger from "./config/logger.js";
import config from "config";
import authRouter from "./routes/auth.router.js";
import passport from "passport";
import expressSession from "express-session";
import "./config/passport.google.js";
import { Server } from "socket.io";
import http from "http";
import { log } from "console";

mongooseConnection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
  socket.on("message", (message) => {
    console.log("message received:", message);
  });
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(
  expressSession({
    secret: process.env.EXPRESS_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);

httpServer.listen(config.get("PORT"), () => {
  logger.info(`Server is running on port ${config.get("PORT")}`);
});
