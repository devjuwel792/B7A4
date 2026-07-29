import type { Request, Response } from "express";
import { PaymentService } from "./payment.service.js";

const createCheckout = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { rentalId } = req.body;

    if (!rentalId) {
      return res.status(400).json({
        success: false,
        message: "rentalId is required",
      });
    }

    const session = await PaymentService.createCheckoutSession(rentalId, userId);
    res.status(201).json({
      success: true,
      message: "Checkout session created successfully",
      data: session,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create checkout session",
    });
  }
};

const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({
        success: false,
        message: "session_id query parameter is required",
      });
    }

    const payment = await PaymentService.confirmPayment(session_id as string);
    res.status(200).json({
      success: true,
      message: "Payment confirmed successfully",
      data: payment,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to confirm payment",
    });
  }
};

const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const payments = await PaymentService.getPaymentHistory(userId);
    res.status(200).json({
      success: true,
      message: "Payment history retrieved successfully",
      data: payments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve payment history",
    });
  }
};

const getPaymentById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const id = req.params.id as string;
    const payment = await PaymentService.getPaymentById(id, userId);
    res.status(200).json({
      success: true,
      message: "Payment details retrieved successfully",
      data: payment,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Failed to retrieve payment details",
    });
  }
};

export const PaymentController = {
  createCheckout,
  confirmPayment,
  getPaymentHistory,
  getPaymentById,
};
