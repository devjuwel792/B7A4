import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, type Request, type Response } from "express";
import morgan from "morgan";

import { authRoutes } from "./auth/auth.route";
import { categoryRoutes } from "./category/category.route";
import config from "./config";
import { propertyRoutes } from "./property/property.route";
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
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/property", propertyRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
