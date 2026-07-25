import type { Request, Response } from "express";
import { PaymentService } from "./payment.service";

const createStripePayment = async (req: Request, res: Response) => {
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

    const result = await PaymentService.createPaymentIntent(rentalId, userId);
    res.status(201).json({
      success: true,
      message: "Payment intent created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create payment",
    });
  }
};

const confirmStripePayment = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.body;
    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: "paymentIntentId is required",
      });
    }

    const result = await PaymentService.confirmPayment(paymentIntentId);
    res.status(200).json({
      success: true,
      message: "Payment confirmed",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to confirm payment",
    });
  }
};

const createSslCommerzPayment = async (req: Request, res: Response) => {
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

    const result = await PaymentService.createSslCommerzPayment(
      rentalId,
      userId,
    );
    res.status(201).json({
      success: true,
      message: "SSLCommerz payment session created",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create SSLCommerz payment",
    });
  }
};

const confirmSslCommerzPayment = async (req: Request, res: Response) => {
  try {
    const { transactionId, status } = req.body;
    if (!transactionId || !status) {
      return res.status(400).json({
        success: false,
        message: "transactionId and status are required",
      });
    }

    const result = await PaymentService.confirmSslCommerzPayment(
      transactionId,
      status,
    );
    res.status(200).json({
      success: true,
      message: "SSLCommerz payment status updated",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to confirm SSLCommerz payment",
    });
  }
};

const getUserPayments = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const payments = await PaymentService.getUserPayments(userId);
    res.status(200).json({
      success: true,
      message: "Payment history retrieved successfully",
      data: payments,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve payments",
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
      message: error.message || "Failed to retrieve payment",
    });
  }
};

export const PaymentController = {
  createStripePayment,
  confirmStripePayment,
  createSslCommerzPayment,
  confirmSslCommerzPayment,
  getUserPayments,
  getPaymentById,
};
