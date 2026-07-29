import type { Request, Response } from "express";
import { ReviewService } from "./review.service.js";

const createReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { propertyId, rating, comment } = req.body;

    if (!propertyId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "propertyId, rating, and comment are required",
      });
    }

    const review = await ReviewService.createReview(
      userId,
      propertyId,
      rating,
      comment,
    );

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create review",
    });
  }
};

export const ReviewController = {
  createReview,
};
