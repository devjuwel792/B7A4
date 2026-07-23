import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { PropertyController } from "./property.controller";

const router = Router();

router.post("/", authMiddleware, PropertyController.createProperty);
router.get("/", authMiddleware, PropertyController.getAllProperties);
router.get(
  "/my-properties",
  authMiddleware,
  PropertyController.getMyProperties,
);
router.get("/:id", authMiddleware, PropertyController.getPropertyById);
router.put("/:id", authMiddleware, PropertyController.updateProperty);
router.delete("/:id", authMiddleware, PropertyController.deleteProperty);

export const propertyRoutes = router;
