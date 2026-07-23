import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, type Request, type Response } from "express";
import morgan from "morgan";

import config from "./config";
import { prisma } from "./lib/prisma";
import { adminRoutes } from "./user/user.route";

export const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/admin", adminRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});


