import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import requireRole from "../middleware/role.middleware";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post(
  "/payments/create",
  authMiddleware,
  requireRole("TENANT"),
  PaymentController.createStripePayment,
);
router.post(
  "/payments/confirm",
  authMiddleware,
  PaymentController.confirmStripePayment,
);
router.post(
  "/payments/sslcommerz",
  authMiddleware,
  requireRole("TENANT"),
  PaymentController.createSslCommerzPayment,
);
router.post(
  "/payments/sslcommerz/confirm",
  authMiddleware,
  PaymentController.confirmSslCommerzPayment,
);
router.get(
  "/payments",
  authMiddleware,
  PaymentController.getUserPayments,
);
router.get(
  "/payments/:id",
  authMiddleware,
  PaymentController.getPaymentById,
);

export const paymentRoutes = router;
