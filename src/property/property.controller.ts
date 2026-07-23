import type { Request, Response } from "express";
import { PropertyService } from "./property.service";

const createProperty = async (req: Request, res: Response) => {
  try {
    const landlordId = req.user?.userId;
    if (!landlordId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      title,
      description,
      address,
      location,
      rent,
      bedrooms,
      bathrooms,
      area,
      amenities,
      images,
      categoryId,
    } = req.body;

    if (
      !title ||
      !description ||
      !address ||
      !location ||
      !rent ||
      !bedrooms ||
      !bathrooms ||
      !categoryId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: title, description, address, location, rent, bedrooms, bathrooms, categoryId",
      });
    }

    const property = await PropertyService.createProperty(
      {
        title,
        description,
        address,
        location,
        rent,
        bedrooms,
        bathrooms,
        area,
        amenities: amenities || [],
        images: images || [],
        categoryId,
      },
      landlordId,
    );

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create property",
    });
  }
};

const getAllProperties = async (req: Request, res: Response) => {
  try {
    const properties = await PropertyService.getAllProperties();
    res.status(200).json({
      success: true,
      message: "Properties retrieved successfully",
      data: properties,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve properties",
    });
  }
};

const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const property = await PropertyService.getPropertyById(id);
    res.status(200).json({
      success: true,
      message: "Property retrieved successfully",
      data: property,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Failed to retrieve property",
    });
  }
};

const getMyProperties = async (req: Request, res: Response) => {
  try {
    const landlordId = req.user?.userId;
    if (!landlordId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const properties = await PropertyService.getMyProperties(landlordId);
    res.status(200).json({
      success: true,
      message: "Your properties retrieved successfully",
      data: properties,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve your properties",
    });
  }
};

const updateProperty = async (req: Request, res: Response) => {
  try {
    const landlordId = req.user?.userId;
    if (!landlordId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;
    const {
      title,
      description,
      address,
      location,
      rent,
      bedrooms,
      bathrooms,
      area,
      amenities,
      images,
      categoryId,
    } = req.body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (address) updateData.address = address;
    if (location) updateData.location = location;
    if (rent) updateData.rent = rent;
    if (bedrooms) updateData.bedrooms = bedrooms;
    if (bathrooms) updateData.bathrooms = bathrooms;
    if (area !== undefined) updateData.area = area;
    if (amenities) updateData.amenities = amenities;
    if (images) updateData.images = images;
    if (categoryId) updateData.categoryId = categoryId;

    const property = await PropertyService.updateProperty(
      id,
      updateData,
      landlordId,
    );
    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: property,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update property",
    });
  }
};

const deleteProperty = async (req: Request, res: Response) => {
  try {
    const landlordId = req.user?.userId;
    if (!landlordId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;
    const result = await PropertyService.deleteProperty(id, landlordId);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete property",
    });
  }
};

const togglePropertyAvailability = async (req: Request, res: Response) => {
  try {
    const landlordId = req.user?.userId;
    if (!landlordId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;
    const property = await PropertyService.togglePropertyAvailability(
      id,
      landlordId,
    );
    res.status(200).json({
      success: true,
      message: `Property ${property.available ? "made available" : "marked as unavailable"} successfully`,
      data: property,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to toggle property availability",
    });
  }
};

export const PropertyController = {
  createProperty,
  getAllProperties,
  getPropertyById,
  getMyProperties,
  updateProperty,
  deleteProperty,
  togglePropertyAvailability,
};
