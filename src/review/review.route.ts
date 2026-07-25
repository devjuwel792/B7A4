import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import requireRole from "../middleware/role.middleware";
import { ReviewController } from "./review.controller";

const router = Router();

router.post(
  "/reviews",
  authMiddleware,
  requireRole("TENANT"),
  ReviewController.createReview,
);
router.get(
  "/reviews/property/:propertyId",
  ReviewController.getPropertyReviews,
);

export const reviewRoutes = router;
