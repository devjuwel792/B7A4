import { prisma } from "../lib/prisma";

const getLandlordRequests = async (landlordId: string) => {
  const requests = await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId,
      },
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          address: true,
          location: true,
          rent: true,
          images: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return requests;
};

const updateRequestStatus = async (
  id: string,
  status: "APPROVED" | "REJECTED",
  landlordId: string,
) => {
  const request = await prisma.rentalRequest.findUnique({
    where: { id },
    include: {
      property: {
        select: { landlordId: true },
      },
    },
  });

  if (!request) {
    throw new Error("Rental request not found");
  }

  if (request.property.landlordId !== landlordId) {
    throw new Error("You can only manage requests for your own properties");
  }

  if (request.status !== "PENDING") {
    throw new Error("This request has already been processed");
  }

  const updatedRequest = await prisma.rentalRequest.update({
    where: { id },
    data: { status },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          address: true,
          location: true,
          rent: true,
          images: true,
        },
      },
    },
  });

  return updatedRequest;
};

const createRentalRequest = async (
  tenantId: string,
  propertyId: string,
  moveInDate: string,
) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  if (!property.available) {
    throw new Error("Property is not available for rent");
  }

  if (property.landlordId === tenantId) {
    throw new Error("You cannot rent your own property");
  }

  const existingRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenantId,
      propertyId,
      status: { in: ["PENDING", "APPROVED", "ACTIVE"] },
    },
  });

  if (existingRequest) {
    throw new Error(
      "You already have an active or pending request for this property",
    );
  }

  const request = await prisma.rentalRequest.create({
    data: {
      tenantId,
      propertyId,
      moveInDate: new Date(moveInDate),
      status: "PENDING",
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          address: true,
          location: true,
          rent: true,
          images: true,
        },
      },
    },
  });

  return request;
};

const getUserRentals = async (userId: string) => {
  const rentals = await prisma.rentalRequest.findMany({
    where: { tenantId: userId },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          address: true,
          location: true,
          rent: true,
          images: true,
          landlord: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return rentals;
};

const getRentalById = async (id: string, userId: string) => {
  const rental = await prisma.rentalRequest.findUnique({
    where: { id },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          description: true,
          address: true,
          location: true,
          rent: true,
          bedrooms: true,
          bathrooms: true,
          area: true,
          amenities: true,
          images: true,
          landlordId: true,
          landlord: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      payment: true,
    },
  });

  if (!rental) {
    throw new Error("Rental request not found");
  }

  if (rental.tenantId !== userId && rental.property.landlordId !== userId) {
    throw new Error("You are not authorized to view this rental request");
  }

  return rental;
};

export const RentalService = {
  getLandlordRequests,
  updateRequestStatus,
  createRentalRequest,
  getUserRentals,
  getRentalById,
};
