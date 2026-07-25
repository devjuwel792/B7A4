import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import requireRole from "../middleware/role.middleware";
import { PropertyController } from "./property.controller";

const router = Router();

// Public routes
router.get("/", PropertyController.getAllProperties);
router.get("/:id", PropertyController.getPropertyById);

// Landlord routes
router.post(
  "/",
  authMiddleware,
  requireRole("LANDLORD"),
  PropertyController.createProperty,
);
router.get(
  "/my-properties",
  authMiddleware,
  requireRole("LANDLORD"),
  PropertyController.getMyProperties,
);
router.put(
  "/:id",
  authMiddleware,
  requireRole("LANDLORD"),
  PropertyController.updateProperty,
);
router.patch(
  "/:id/availability",
  authMiddleware,
  requireRole("LANDLORD"),
  PropertyController.togglePropertyAvailability,
);
router.delete(
  "/:id",
  authMiddleware,
  requireRole("LANDLORD"),
  PropertyController.deleteProperty,
);

export const propertyRoutes = router;
