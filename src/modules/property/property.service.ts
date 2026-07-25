import { prisma } from "../../lib/prisma";
import type { Prisma } from "../../../generated/prisma/client";

interface CreatePropertyData {
  title: string;
  description: string;
  address: string;
  location: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  amenities: string[];
  images: string[];
  categoryId: string;
}

const createProperty = async (data: CreatePropertyData, landlordId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const property = await prisma.property.create({
    data: {
      ...data,
      landlordId,
    },
    include: {
      category: {
        select: { id: true, name: true },
      },
      landlord: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  });

  return property;
};

const getAllProperties = async (query?: {
  location?: string;
  minRent?: string;
  maxRent?: string;
  categoryId?: string;
  bedrooms?: string;
  search?: string;
}) => {
  const where: Prisma.PropertyWhereInput = {
    available: true,
  };

  if (query?.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
      { location: { contains: query.search, mode: "insensitive" } },
      { address: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query?.location) {
    where.location = { contains: query.location, mode: "insensitive" };
  }

  if (query?.minRent || query?.maxRent) {
    where.rent = {};
    if (query.minRent) where.rent.gte = Number(query.minRent);
    if (query.maxRent) where.rent.lte = Number(query.maxRent);
  }

  if (query?.categoryId) {
    where.categoryId = query.categoryId;
  }

  if (query?.bedrooms) {
    where.bedrooms = Number(query.bedrooms);
  }

  const properties = await prisma.property.findMany({
    where,
    include: {
      category: {
        select: { id: true, name: true },
      },
      landlord: {
        select: { id: true, name: true, email: true, phone: true },
      },
      _count: {
        select: { rentals: true, reviews: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return properties;
};

const getPropertyById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      category: {
        select: { id: true, name: true },
      },
      landlord: {
        select: { id: true, name: true, email: true, phone: true },
      },
      reviews: {
        include: {
          tenant: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { rentals: true, reviews: true },
      },
    },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  return property;
};

const getMyProperties = async (landlordId: string) => {
  const properties = await prisma.property.findMany({
    where: { landlordId },
    include: {
      category: {
        select: { id: true, name: true },
      },
      _count: {
        select: { rentals: true, reviews: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return properties;
};

const updateProperty = async (
  id: string,
  data: Partial<CreatePropertyData>,
  userId: string,
) => {
  const existingProperty = await prisma.property.findUnique({
    where: { id },
  });

  if (!existingProperty) {
    throw new Error("Property not found");
  }

  if (existingProperty.landlordId !== userId) {
    throw new Error("You can only update your own properties");
  }

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new Error("Category not found");
    }
  }

  const property = await prisma.property.update({
    where: { id },
    data,
    include: {
      category: {
        select: { id: true, name: true },
      },
      landlord: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  });

  return property;
};

const deleteProperty = async (id: string, userId: string) => {
  const existingProperty = await prisma.property.findUnique({
    where: { id },
  });

  if (!existingProperty) {
    throw new Error("Property not found");
  }

  if (existingProperty.landlordId !== userId) {
    throw new Error("You can only delete your own properties");
  }

  await prisma.property.delete({
    where: { id },
  });

  return { message: "Property deleted successfully" };
};

const togglePropertyAvailability = async (id: string, userId: string) => {
  const existingProperty = await prisma.property.findUnique({
    where: { id },
  });

  if (!existingProperty) {
    throw new Error("Property not found");
  }

  if (existingProperty.landlordId !== userId) {
    throw new Error("You can only update your own properties");
  }

  const property = await prisma.property.update({
    where: { id },
    data: { available: !existingProperty.available },
    include: {
      category: {
        select: { id: true, name: true },
      },
      landlord: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  });

  return property;
};

export const PropertyService = {
  createProperty,
  getAllProperties,
  getPropertyById,
  getMyProperties,
  updateProperty,
  deleteProperty,
  togglePropertyAvailability,
};
