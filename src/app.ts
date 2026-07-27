import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, type Request, type Response } from "express";
import morgan from "morgan";

import { authRoutes } from "./modules/auth/auth.route";
import { categoryRoutes } from "./modules/category/category.route";
import config from "./config";
import { adminRoutes } from "./modules/user/user.route";
import { propertyRoutes } from "./modules/property/property.route";
import { rentalRoutes } from "./modules/rental/rental.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { reviewRoutes } from "./modules/review/review.route";
import globalErrorHandler from "./middleware/error.middleware";

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
app.use("/api", rentalRoutes);
app.use("/api", paymentRoutes);
app.use("/api", reviewRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("RentNest API is running");
});

app.use(globalErrorHandler);
