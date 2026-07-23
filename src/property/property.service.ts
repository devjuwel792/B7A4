import { prisma } from "../lib/prisma";

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

const getAllProperties = async () => {
  const properties = await prisma.property.findMany({
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

export const PropertyService = {
  createProperty,
  getAllProperties,
  getPropertyById,
  getMyProperties,
  updateProperty,
  deleteProperty,
};
