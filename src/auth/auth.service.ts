import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import config from "../config";
import { prisma } from "../lib/prisma";

const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
}) => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (isUserExist) {
    throw new Error("User already exists");
  }

  const hashPassword = await bcrypt.hash(
    data.password,
    Number(config.bcrypt_salt_rounds),
  );

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashPassword,
      phone: data.phone,
      status: "ACTIVE",
      role: data.role,
    },
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

const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.status === "BANNED") {
    throw new Error("Your account has been banned");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const { accessToken, refreshToken } = generateTokens(user.id, user.role);

  // Remove password from user object
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const generateTokens = (userId: string, role: string) => {
  const accessTokenOptions: SignOptions = {
    expiresIn: (config.jwt_access_expires_in ||
      "1h") as SignOptions["expiresIn"],
  };
  const refreshTokenOptions: SignOptions = {
    expiresIn: (config.jwt_refresh_expires_in ||
      "7d") as SignOptions["expiresIn"],
  };

  const accessToken = jwt.sign(
    { userId, role },
    config.jwt_access_secret as string,
    accessTokenOptions,
  );

  const refreshToken = jwt.sign(
    { userId, role },
    config.jwt_refresh_secret as string,
    refreshTokenOptions,
  );

  return { accessToken, refreshToken };
};

export const AuthService = {
  registerUser,
  loginUser,
  getMe,
  generateTokens,
};
