import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import requireRole from "../middleware/role.middleware";
import { RentalController } from "./rental.controller";

const router = Router();

// Landlord routes
router.get(
  "/landlord/requests",
  authMiddleware,
  requireRole("LANDLORD"),
  RentalController.getLandlordRequests,
);
router.patch(
  "/landlord/requests/:id",
  authMiddleware,
  requireRole("LANDLORD"),
  RentalController.updateRequestStatus,
);

// Tenant routes
router.post(
  "/rentals",
  authMiddleware,
  requireRole("TENANT"),
  RentalController.createRentalRequest,
);
router.get("/rentals", authMiddleware, RentalController.getUserRentals);
router.get("/rentals/:id", authMiddleware, RentalController.getRentalById);

export const rentalRoutes = router;
