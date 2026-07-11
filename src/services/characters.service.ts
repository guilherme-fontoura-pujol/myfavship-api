import prisma from "../config/database";
import { AppError } from "../utils/AppError";
import { generateSlug } from "../utils/generateSlug";
import { shipPublicInclude } from "../prisma/includes";
import {
  CreateCharacterDTO,
  UpdateCharacterDTO,
} from "../dtos/requests/character.request.dto";

export class CharactersService {
  async create(data: CreateCharacterDTO) {
    const work = await prisma.work.findUnique({
      where: { id: data.workId },
    });

    if (!work) {
      throw new AppError("Obra não encontrada.", 404);
    }

    return prisma.character.create({
      data: {
        ...data,
        slug: generateSlug(data.name),
      },
      include: {
        work: true,
      },
    });
  }

  async updateImage(id: string, imageUrl: string) {
  await this.findById(id);

  return prisma.character.update({
    where: { id },
    data: { imageUrl },
    include: {
      work: true,
    },
  });
}

  async list() {
    return prisma.character.findMany({
      include: {
        work: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async findPublicBySlug(slug: string, workSlug: string) {
  const work = await prisma.work.findUnique({
    where: { slug: workSlug },
  });

  if (!work) {
    throw new AppError("Obra não encontrada.", 404);
  }

  const character = await prisma.character.findUnique({
    where: {
      slug_workId: {
        slug,
        workId: work.id,
      },
    },
    include: {
      work: {
        include: {
          category: true,
        },
      },
      shipCharacters: {
        include: {
          ship: {
            include: shipPublicInclude,
          },
        },
      },
    },
  });

  if (!character) {
    throw new AppError("Personagem não encontrado.", 404);
  }

  const ships = character.shipCharacters.map((item) => item.ship);

  const totalVotes = ships.reduce((sum, ship) => {
    return sum + ship._count.votes;
  }, 0);

  return character;
}

  async findById(id: string) {
    const character = await prisma.character.findUnique({
      where: { id },
      include: {
        work: true,
        shipCharacters: true,
      },
    });

    if (!character) {
      throw new AppError("Personagem não encontrado.", 404);
    }

    return character;
  }

  async findBySlug(slug: string, workId: string) {
    const character = await prisma.character.findUnique({
      where: {
        slug_workId: {
          slug,
          workId,
        },
      },
      include: {
        work: true,
      },
    });

    if (!character) {
      throw new AppError("Personagem não encontrado.", 404);
    }

    return character;
  }

  async update(id: string, data: UpdateCharacterDTO) {
    await this.findById(id);

    if (data.workId) {
      const work = await prisma.work.findUnique({
        where: { id: data.workId },
      });

      if (!work) {
        throw new AppError("Obra não encontrada.", 404);
      }
    }

    const updateData: any = {
      ...data,
    };

    if (data.name) {
      updateData.slug = generateSlug(data.name);
    }

    return prisma.character.update({
      where: { id },
      data: updateData,
      include: {
        work: true,
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);

    await prisma.character.delete({
      where: { id },
    });
  }
}