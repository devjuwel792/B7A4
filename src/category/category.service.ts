import { prisma } from "../lib/prisma";

const createCategory = async (name: string) => {
  const existingCategory = await prisma.category.findUnique({
    where: { name },
  });

  if (existingCategory) {
    throw new Error("Category with this name already exists");
  }

  const category = await prisma.category.create({
    data: { name },
  });

  return category;
};

const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { properties: true },
      },
    },
  });

  return categories;
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { properties: true },
      },
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

const updateCategory = async (id: string, name: string) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new Error("Category not found");
  }

  const duplicateCategory = await prisma.category.findUnique({
    where: { name },
  });

  if (duplicateCategory && duplicateCategory.id !== id) {
    throw new Error("Category with this name already exists");
  }

  const category = await prisma.category.update({
    where: { id },
    data: { name },
  });

  return category;
};

const deleteCategory = async (id: string) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new Error("Category not found");
  }

  await prisma.category.delete({
    where: { id },
  });

  return { message: "Category deleted successfully" };
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
