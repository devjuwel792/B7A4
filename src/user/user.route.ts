import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import requireRole from "../middleware/role.middleware";
import { AdminController } from "./user.controller";

const router = Router();

// All admin routes require authentication + ADMIN role
router.use(authMiddleware);
router.use(requireRole("ADMIN"));

router.get("/users", AdminController.getAllUsers);
router.get("/users/landlords", AdminController.getLandlords);
router.patch("/users/:id", AdminController.updateUserStatus);
router.get("/properties", AdminController.getAllProperties);
router.get("/rentals", AdminController.getAllRentals);

export const adminRoutes = router;
