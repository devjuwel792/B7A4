import type { Request, Response } from "express";
import { AdminService } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const role = req.query.role as string | undefined;
    const users = await AdminService.getAllUsers(role);
    res.status(200).json({
      success: true,
      message: role
        ? `${role} users retrieved successfully`
        : "All users retrieved successfully",
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve users",
    });
  }
};

const getLandlords = async (req: Request, res: Response) => {
  try {
    const landlords = await AdminService.getAllUsers("LANDLORD");
    res.status(200).json({
      success: true,
      message: "Landlords retrieved successfully",
      data: landlords,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve landlords",
    });
  }
};

const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    if (!status || !["ACTIVE", "BANNED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either ACTIVE or BANNED",
      });
    }

    const user = await AdminService.updateUserStatus(id, status);
    res.status(200).json({
      success: true,
      message: `User ${status === "BANNED" ? "banned" : "unbanned"} successfully`,
      data: user,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Failed to update user status",
    });
  }
};

const getAllProperties = async (req: Request, res: Response) => {
  try {
    const properties = await AdminService.getAllProperties();
    res.status(200).json({
      success: true,
      message: "All properties retrieved successfully",
      data: properties,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve properties",
    });
  }
};

const getAllRentals = async (req: Request, res: Response) => {
  try {
    const rentals = await AdminService.getAllRentals();
    res.status(200).json({
      success: true,
      message: "All rental requests retrieved successfully",
      data: rentals,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve rental requests",
    });
  }
};

export const AdminController = {
  getAllUsers,
  getLandlords,
  updateUserStatus,
  getAllProperties,
  getAllRentals,
