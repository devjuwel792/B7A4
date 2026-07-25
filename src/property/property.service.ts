import { prisma } from "../lib/prisma";

interface PropertyFilter {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  bedrooms?: number;
  amenities?: string;
  search?: string;
}

const createProperty = async (
  data: {
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
  },
  landlordId: string,
) => {
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
      category: { select: { id: true, name: true } },
      landlord: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  return property;
};

const getAllProperties = async (filters?: PropertyFilter) => {
  const where: Record<string, any> = {};

  if (filters?.location) {
    where.location = { contains: filters.location, mode: "insensitive" };
  }

  if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
    where.rent = {};
    if (filters.minPrice !== undefined) where.rent.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.rent.lte = filters.maxPrice;
  }

  if (filters?.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters?.bedrooms) {
    where.bedrooms = filters.bedrooms;
  }

  if (filters?.amenities) {
    const amenityList = filters.amenities.split(",").map((a) => a.trim());
    where.amenities = { hasSome: amenityList };
  }

  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { address: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const properties = await prisma.property.findMany({
    where,
    include: {
      category: { select: { id: true, name: true } },
      landlord: { select: { id: true, name: true, email: true, phone: true } },
      _count: { select: { rentals: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return properties;
};

const getPropertyById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true } },
      landlord: { select: { id: true, name: true, email: true, phone: true } },
      reviews: {
        include: {
          tenant: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { rentals: true, reviews: true } },
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
      category: { select: { id: true, name: true } },
      _count: { select: { rentals: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return properties;
};

const updateProperty = async (
  id: string,
  data: Record<string, any>,
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
      category: { select: { id: true, name: true } },
      landlord: { select: { id: true, name: true, email: true, phone: true } },
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

  await prisma.property.delete({ where: { id } });
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
      category: { select: { id: true, name: true } },
      landlord: { select: { id: true, name: true, email: true, phone: true } },
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
