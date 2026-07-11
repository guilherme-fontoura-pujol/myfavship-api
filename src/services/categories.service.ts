import prisma from "../config/database";
import { AppError } from "../utils/AppError";

interface CreateCategoryData {
  name: string;
}

export class CategoriesService {
  async create({ name }: CreateCategoryData) {
    const categoryExists = await prisma.category.findUnique({
      where: { name },
    });

    if (categoryExists) {
      throw new AppError("Categoria já cadastrada.", 400);
    }

    return prisma.category.create({
      data: { name },
    });
  }

  async list() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  }
}