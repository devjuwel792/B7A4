import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import requireRole from "../middleware/role.middleware";
import { CategoryController } from "./category.controller";

const router = Router();

// Public routes
router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);

// Admin routes
router.post(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
  CategoryController.createCategory,
);
router.put(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  CategoryController.updateCategory,
);
router.delete(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  CategoryController.deleteCategory,
);

export const categoryRoutes = router;
