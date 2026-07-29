import { Router } from "express";
import authMiddleware, { roleGuard } from "../../middleware/auth.middleware.js";
import { PropertyController } from "./property.controller.js";

const router = Router();

router.get("/", PropertyController.getAllProperties);
router.get(
  "/my-properties",
  authMiddleware,
  roleGuard("LANDLORD"),
  PropertyController.getMyProperties,
);
router.get("/:id", PropertyController.getPropertyById);

router.post(
  "/",
  authMiddleware,
  roleGuard("LANDLORD"),
  PropertyController.createProperty,
);
router.put(
  "/:id",
  authMiddleware,
  roleGuard("LANDLORD"),
  PropertyController.updateProperty,
);
router.patch(
  "/:id/availability",
  authMiddleware,
  roleGuard("LANDLORD"),
  PropertyController.togglePropertyAvailability,
);
router.delete(
  "/:id",
  authMiddleware,
  roleGuard("LANDLORD"),
  PropertyController.deleteProperty,
);

export const propertyRoutes = router;
