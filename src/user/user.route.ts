import { Router } from "express";
import { AdminController } from "./user.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.get("/users",authMiddleware, AdminController.getAllUsers);
router.patch("/users/:id",authMiddleware, AdminController.updateUserStatus);
router.get("/properties",authMiddleware, AdminController.getAllProperties);
router.get("/rentals",authMiddleware, AdminController.getAllRentals);

export const adminRoutes = router;
