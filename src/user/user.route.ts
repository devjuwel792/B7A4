import { Router } from "express";
import authMiddleware, { roleGuard } from "../middleware/auth.middleware";
import { AdminController } from "./user.controller";

const router = Router();

router.get(
  "/users",
  authMiddleware,
  roleGuard("ADMIN"),
  AdminController.getAllUsers,
);
router.patch(
  "/users/:id",
  authMiddleware,
  roleGuard("ADMIN"),
  AdminController.updateUserStatus,
);
router.get(
  "/properties",
  authMiddleware,
  roleGuard("ADMIN"),
  AdminController.getAllProperties,
);
router.get(
  "/rentals",
  authMiddleware,
  roleGuard("ADMIN"),
  AdminController.getAllRentals,
);

export const adminRoutes = router;
