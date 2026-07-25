import type { Request, Response } from "express";
import { ReviewService } from "./review.service";

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
        message: "Missing required fields: propertyId, rating, comment",
      });
    }

    const review = await ReviewService.createReview(
      userId,
      propertyId,
      Number(rating),
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

const getPropertyReviews = async (req: Request, res: Response) => {
  try {
    const propertyId = req.params.propertyId as string;
    const reviews = await ReviewService.getPropertyReviews(propertyId);
    res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      data: reviews,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve reviews",
    });
  }
};

export const ReviewController = {
  createReview,
  getPropertyReviews,
};
