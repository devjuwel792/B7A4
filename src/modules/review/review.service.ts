import { prisma } from "../../lib/prisma";

const createReview = async (
  tenantId: string,
  propertyId: string,
  rating: number,
  comment: string,
) => {
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
      status: "COMPLETED",
    },
  });

  if (!completedRental) {
    throw new Error("You can only review properties after completing a rental");
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

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const review = await prisma.review.create({
    data: {
      tenantId,
      propertyId,
      rating,
      comment,
    },
    include: {
      tenant: {
        select: { id: true, name: true },
      },
      property: {
        select: { id: true, title: true },
      },
    },
  });

  return review;
};

export const ReviewService = {
  createReview,
};
