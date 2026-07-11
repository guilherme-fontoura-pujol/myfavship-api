import {
  CreateWorkDTO,
  UpdateWorkDTO,
} from "../dtos/requests/work.request.dto";
import prisma from "../config/database";
import { AppError } from "../utils/AppError";
import { generateSlug } from "../utils/generateSlug";
import { shipPublicInclude } from "../prisma/includes";

export class WorksService {
  async create(data: CreateWorkDTO) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new AppError("Categoria não encontrada.", 404);
    }

    return prisma.work.create({
      data: {
        ...data,
        slug: generateSlug(data.title),
      },
      include: {
        category: true,
      },
    });
  }

  async findPublicBySlug(slug: string) {
  const work = await prisma.work.findUnique({
    where: { slug },
    include: {
      category: true,
      characters: {
        where: {
          isPlayable: true,
        },
        orderBy: {
          name: "asc",
        },
      },
      ships: {
  include: shipPublicInclude,
  orderBy: {
    votes: {
      _count: "desc",
    },
  },
  take: 10,
},
      _count: {
        select: {
          votes: true,
          ships: true,
          characters: true,
        },
      },
    },
  });

  if (!work) {
    throw new AppError("Obra não encontrada.", 404);
  }

  return work;
}

async updateImage(id: string, coverImageUrl: string) {
  await this.findById(id);

  return prisma.work.update({
    where: { id },
    data: { coverImageUrl },
    include: {
      category: true,
    },
  });
}

  async list() {
    return prisma.work.findMany({
      include: {
        category: true,
      },
      orderBy: {
        title: "asc",
      },
    });
  }

  async findById(id: string) {
    const work = await prisma.work.findUnique({
      where: { id },
      include: {
        category: true,
        characters: true,
        ships: true,
      },
    });

    if (!work) {
      throw new AppError("Obra não encontrada.", 404);
    }

    return work;
  }

  async update(id: string, data: UpdateWorkDTO) {
    await this.findById(id);

    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new AppError("Categoria não encontrada.", 404);
      }
    }

    const updateData: any = {
      ...data,
    };

    if (data.title) {
      updateData.slug = generateSlug(data.title);
    }

    return prisma.work.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);

    await prisma.work.delete({
      where: { id },
    });
  }
}