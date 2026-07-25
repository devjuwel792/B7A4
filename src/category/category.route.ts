import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { CategoryController } from "./category.controller";

const router = Router();

router.post("/", authMiddleware, CategoryController.createCategory);
router.get("/", authMiddleware, CategoryController.getAllCategories);
router.get("/:id", authMiddleware, CategoryController.getCategoryById);
router.put("/:id", authMiddleware, CategoryController.updateCategory);
router.delete("/:id", authMiddleware, CategoryController.deleteCategory);


export const categoryRoutes = router;
