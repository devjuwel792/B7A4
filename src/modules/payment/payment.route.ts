import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post("/payments/create", authMiddleware, PaymentController.createCheckout);
router.get("/payments/confirm", PaymentController.confirmPayment);
router.get("/payments", authMiddleware, PaymentController.getPaymentHistory);
router.get("/payments/:id", authMiddleware, PaymentController.getPaymentById);

export const paymentRoutes = router;
