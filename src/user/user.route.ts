import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { AdminController } from "./user.controller";
import { PropertyService } from "../property/property.service";

const router = Router();

router.get("/landlord", authMiddleware, AdminController.getLandlords);
router.get("/users", authMiddleware, AdminController.getAllUsers);
router.patch("/users/:id", authMiddleware, AdminController.updateUserStatus);
router.get("/properties", authMiddleware, PropertyService.getAllProperties);
router.get("/rentals", authMiddleware, AdminController.getAllRentals);

export const adminRoutes = router;
