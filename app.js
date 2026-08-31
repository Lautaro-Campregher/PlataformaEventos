import express from "express";
import eventsRouter from "./src/routes/events.router.js";
import sessionsRouter from "./src/routes/sessions.router.js";
import { connectDB } from "./src/config/database.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";

const app = express();

dotenv.config();

app.use(express.json());

app.use(cookieParser());

app.use(passport.initialize());

connectDB();

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Servidor activo",
  });
});

app.use("/api/events", eventsRouter);
app.use("/api/sessions", sessionsRouter);

export default app;
