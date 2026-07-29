import { Router } from "express";
import authMiddleware, { roleGuard } from "../../middleware/auth.middleware.js";
import { ReviewController } from "./review.controller.js";

const router = Router();

router.post(
  "/reviews",
  authMiddleware,
  roleGuard("TENANT"),
  ReviewController.createReview,
);

export const reviewRoutes = router;
