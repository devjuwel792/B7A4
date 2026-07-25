import { prisma } from "../lib/prisma";

const getAllUsers = async (role?: string) => {
  const whereClause = role
    ? { role: role as "TENANT" | "LANDLORD" | "ADMIN" }
    : {};

  const users = await prisma.user.findMany({
    where: whereClause,
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
 
  getAllRentals,
};
