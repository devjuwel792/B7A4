import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { RentalController } from "./rental.controller";

const router = Router();

// Landlord routes
router.get(
  "/landlord/requests",
  authMiddleware,
  RentalController.getLandlordRequests,
);
router.patch(
  "/landlord/requests/:id",
  authMiddleware,
  RentalController.updateRequestStatus,
);

// Tenant routes
router.post("/rentals", authMiddleware, RentalController.createRentalRequest);
router.get("/rentals", authMiddleware, RentalController.getUserRentals);
router.get("/rentals/:id", authMiddleware, RentalController.getRentalById);

export const rentalRoutes = router;
