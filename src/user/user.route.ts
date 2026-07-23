import { Router } from "express";
import { AdminController } from "./user.controller";

const router = Router();

router.get("/users", AdminController.getAllUsers);
router.patch("/users/:id", AdminController.updateUserStatus);
router.get("/properties", AdminController.getAllProperties);
router.get("/rentals", AdminController.getAllRentals);

export const adminRoutes = router;
