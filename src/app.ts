import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, type Request, type Response } from "express";
import morgan from "morgan";

import { authRoutes } from "./auth/auth.route";
import { categoryRoutes } from "./category/category.route";
import config from "./config";
import globalErrorHandler from "./middleware/error.middleware";
import { paymentRoutes } from "./payment/payment.route";
import { propertyRoutes } from "./property/property.route";
import { rentalRoutes } from "./rental/rental.route";
import { reviewRoutes } from "./review/review.route";
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/landlord", rentalRoutes);
app.use("/api", rentalRoutes);
app.use("/api", paymentRoutes);
app.use("/api", reviewRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("RentNest API is running");
});

app.use(globalErrorHandler);
