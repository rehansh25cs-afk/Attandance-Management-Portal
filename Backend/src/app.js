import express from "express";
import authRouter from "./Routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import announcementsRouter from "./Routes/announcements.routes.js";
import tasksRouter from "./Routes/tasks.routes.js";
import leavesRouter from "./Routes/leaves.routes.js";

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


// routes
app.use("/api/auth", authRouter);

app.use("/api/announcements", announcementsRouter);

app.use("/api/tasks", tasksRouter);

app.use("/api/leaves", leavesRouter);

export default app;