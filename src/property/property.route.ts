import { Router } from "express";
import authMiddleware, { roleGuard } from "../middleware/auth.middleware";
import { PropertyController } from "./property.controller";

const router = Router();

router.get("/", PropertyController.getAllProperties);
router.get("/:id", PropertyController.getPropertyById);

router.post(
  "/",
  authMiddleware,
  roleGuard("LANDLORD"),
  PropertyController.createProperty,
);
router.get(
  "/my-properties",
  authMiddleware,
  roleGuard("LANDLORD"),
  PropertyController.getMyProperties,
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
