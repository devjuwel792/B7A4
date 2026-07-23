import { prisma } from "../lib/prisma";

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      status: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
 

  return users;
};

const updateUserStatus = async (id: string, status: "ACTIVE" | "BANNED") => {
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  const user = await prisma.user.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      status: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

const getAllProperties = async () => {
  const properties = await prisma.property.findMany({
    include: {
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          rentals: true,
          reviews: true,
        },
      },
    },
  });

  return properties;
};

const getAllRentals = async () => {
  const rentals = await prisma.rentalRequest.findMany({
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
          rent: true,
        },
      },
      payment: true,
    },
  });

  return rentals;
};

export const AdminService = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentals,
}