import { prisma } from "../lib/prisma";

const createReview = async (
  tenantId: string,
  propertyId: string,
  rating: number,
  comment: string,
) => {
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  const completedRental = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId,
      status: "ACTIVE",
    },
  });

  if (!completedRental) {
    throw new Error(
      "You can only review properties you have an active rental for",
    );
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      tenantId,
      propertyId,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this property");
  }

  const review = await prisma.review.create({
    data: {
      tenantId,
      propertyId,
      rating,
      comment,
    },
    include: {
      tenant: { select: { id: true, name: true, email: true } },
      property: { select: { id: true, title: true } },
    },
  });

  return review;
};

const getPropertyReviews = async (propertyId: string) => {
  const reviews = await prisma.review.findMany({
    where: { propertyId },
    include: {
      tenant: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return reviews;
};

export const ReviewService = {
  createReview,
  getPropertyReviews,
};
