import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { PaymentController } from "./payment.controller.js";

const router = Router();

router.post("/payments/create", authMiddleware, PaymentController.createCheckout);
router.get("/payments/confirm", PaymentController.confirmPayment);
router.get("/payments", authMiddleware, PaymentController.getPaymentHistory);
router.get("/payments/:id", authMiddleware, PaymentController.getPaymentById);

export const paymentRoutes = router;
