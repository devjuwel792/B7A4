import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, type Request, type Response } from "express";
import morgan from "morgan";

import { authRoutes } from "./auth/auth.route";
import { categoryRoutes } from "./category/category.route";
import config from "./config";
import { adminRoutes } from "./user/user.route";
import { propertyRoutes } from "./property/property.route";
import { rentalRoutes } from "./rental/rental.route";
import { reviewRoutes } from "./review/review.route";

export const app: Application = express();

app.use(
  cors({
    origin: config.client_url,
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/landlord", rentalRoutes);
app.use("/api", rentalRoutes);
app.use("/api", reviewRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("RentNest API is running");
});
