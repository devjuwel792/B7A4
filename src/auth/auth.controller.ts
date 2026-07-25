import type { Request, Response } from "express";
import { AuthService } from "./auth.service";

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and role are required",
      });
    }

    if (!["TENANT", "LANDLORD", "ADMIN"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be TENANT, LANDLORD, or ADMIN",
      });
    }

    const user = await AuthService.registerUser({
      name,
      email,
      password,
      phone,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    const statusCode = error.message === "User already exists" ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to register user",
    });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await AuthService.loginUser(email, password);

    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error: any) {
    const statusCode =
      error.message === "Invalid email or password" ||
      error.message === "Your account has been banned"
        ? 401
        : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to login",
    });
  }
};

const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await AuthService.getMe(userId);

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Failed to retrieve user",
    });
  }
};

export const AuthController = {
  register,
  login,
  getMe,
};
