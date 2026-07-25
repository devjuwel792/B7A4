import { Router } from "express";
import authMiddleware, { roleGuard } from "../middleware/auth.middleware";
import { CategoryController } from "./category.controller";

const router = Router();

router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);

router.post("/", authMiddleware, roleGuard("ADMIN"), CategoryController.createCategory);
router.put("/:id", authMiddleware, roleGuard("ADMIN"), CategoryController.updateCategory);
router.delete("/:id", authMiddleware, roleGuard("ADMIN"), CategoryController.deleteCategory);

export const categoryRoutes = router;
