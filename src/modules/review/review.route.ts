import { Router } from "express";
import authMiddleware, { roleGuard } from "../../middleware/auth.middleware";
import { ReviewController } from "./review.controller";

const router = Router();

router.post(
  "/reviews",
  authMiddleware,
  roleGuard("TENANT"),
  ReviewController.createReview,
);

export const reviewRoutes = router;
