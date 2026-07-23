import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { AdminController } from "./user.controller";

const router = Router();

router.get("/landlord", authMiddleware, AdminController.getLandlords);
router.get("/users", authMiddleware, AdminController.getAllUsers);
router.patch("/users/:id", authMiddleware, AdminController.updateUserStatus);
router.get("/properties", authMiddleware, AdminController.getAllProperties);


export const adminRoutes = router;
