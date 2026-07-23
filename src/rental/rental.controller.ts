import type { Request, Response } from "express";
import { RentalService } from "./rental.service";

const getLandlordRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const requests = await RentalService.getLandlordRequests(userId);
    res.status(200).json({
      success: true,
      message: "Rental requests retrieved successfully",
      data: requests,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve rental requests",
    });
  }
};

const updateRequestStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either APPROVED or REJECTED",
      });
    }

    const request = await RentalService.updateRequestStatus(id, status, userId);
    res.status(200).json({
      success: true,
      message: `Rental request ${status.toLowerCase()} successfully`,
      data: request,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update rental request status",
    });
  }
};

const createRentalRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { propertyId, moveInDate } = req.body;

    if (!propertyId || !moveInDate) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: propertyId, moveInDate",
      });
    }

    const request = await RentalService.createRentalRequest(
      userId,
      propertyId,
      moveInDate,
    );

    res.status(201).json({
      success: true,
      message: "Rental request submitted successfully",
      data: request,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create rental request",
    });
  }
};

const getUserRentals = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const rentals = await RentalService.getUserRentals(userId);
    res.status(200).json({
      success: true,
      message: "Rental requests retrieved successfully",
      data: rentals,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve rental requests",
    });
  }
};

const getRentalById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;
    const rental = await RentalService.getRentalById(id, userId);
    res.status(200).json({
      success: true,
      message: "Rental request retrieved successfully",
      data: rental,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Failed to retrieve rental request",
    });
  }
};

export const RentalController = {
  getLandlordRequests,
  updateRequestStatus,
  createRentalRequest,
  getUserRentals,
  getRentalById,
};
