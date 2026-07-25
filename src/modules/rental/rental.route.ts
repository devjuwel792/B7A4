import { Router } from "express";
import authMiddleware, { roleGuard } from "../../middleware/auth.middleware";
import { RentalController } from "./rental.controller";

const router = Router();

router.get(
  "/landlord/requests",
  authMiddleware,
  roleGuard("LANDLORD"),
  RentalController.getLandlordRequests,
);
router.patch(
  "/landlord/requests/:id",
  authMiddleware,
  roleGuard("LANDLORD"),
  RentalController.updateRequestStatus,
);

router.post(
  "/rentals",
  authMiddleware,
  roleGuard("TENANT"),
  RentalController.createRentalRequest,
);
router.get("/rentals", authMiddleware, RentalController.getUserRentals);
router.get("/rentals/:id", authMiddleware, RentalController.getRentalById);

export const rentalRoutes = router;
