import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookie from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { securityMiddleware } from "./Middleware/security.middlware.js";
import logger from "./Config/logger.js";
import moviesRouter from "./Routes/movies.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(urlencoded());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } })
);

app.use(securityMiddleware);

app.get("/", (req, res) => {
  logger.info("Hello from Movies app");
  res.status(200).send("Hello from movies app");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/api", (req, res) => {
  res.status(200).send("Movies API is running");
});

app.use("/api/v1/movies", moviesRouter);

export default app;
