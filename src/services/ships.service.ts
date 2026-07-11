import prisma from "../config/database";
import { AppError } from "../utils/AppError";
import { shipPublicInclude } from "../prisma/includes";
import { UpdateShipDTO } from "../dtos/requests/ship.request.dto";

export class ShipsService {
  async list() {
    return prisma.ship.findMany({
      include: {
        work: true,
        aliases: true,
        characters: {
          include: {
            character: true,
          },
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async updateImage(id: string, imageUrl: string) {
  await this.findById(id);

  return prisma.ship.update({
    where: { id },
    data: { imageUrl },
    include: {
      work: true,
      aliases: true,
      characters: {
        include: {
          character: true,
        },
      },
    },
  });
}

  async findById(id: string) {
    const ship = await prisma.ship.findUnique({
      where: { id },
      include: {
        work: true,
        aliases: true,
        characters: {
          include: {
            character: true,
          },
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
    });

    if (!ship) {
      throw new AppError("Ship não encontrado.", 404);
    }

    return ship;
  }

  async findPublicById(id: string) {
  const ship = await prisma.ship.findUnique({
    where: { id },
    include: shipPublicInclude,
  });

  if (!ship) {
    throw new AppError("Ship não encontrado.", 404);
  }

  const ranking = await prisma.ship.findMany({
    where: {
      workId: ship.workId,
    },
    include: {
      _count: {
        select: {
          votes: true,
        },
      },
    },
    orderBy: {
      votes: {
        _count: "desc",
      },
    },
  });

  const position = ranking.findIndex((item) => item.id === ship.id) + 1;

  return {
  ship,
  ranking: position,
};
}

  async update(id: string, data: UpdateShipDTO) {
    await this.findById(id);

    const { aliases, ...shipData } = data;

    const ship = await prisma.ship.update({
      where: { id },
      data: shipData,
      include: {
        work: true,
        aliases: true,
        characters: {
          include: {
            character: true,
          },
        },
      },
    });

    if (aliases) {
      await prisma.shipAlias.deleteMany({
        where: { shipId: id },
      });

      await prisma.shipAlias.createMany({
        data: aliases.map((alias) => ({
          name: alias,
          shipId: id,
        })),
      });
    }

    return this.findById(id);
  }

  async delete(id: string) {
    await this.findById(id);

    await prisma.ship.delete({
      where: { id },
    });
  }
  async preview(workId: string, characterIds: string[]) {
  if (characterIds.length !== 2) {
    throw new AppError("Selecione exatamente 2 personagens.", 400);
  }

  const [firstCharacterId, secondCharacterId] = characterIds.sort();

  if (firstCharacterId === secondCharacterId) {
    throw new AppError("Escolha dois personagens diferentes.", 400);
  }

  const characters = await prisma.character.findMany({
    where: {
      id: { in: [firstCharacterId, secondCharacterId] },
      workId,
      isPlayable: true,
    },
  });

  if (characters.length !== 2) {
    throw new AppError("Personagens inválidos para esta obra.", 400);
  }

  const ship = await prisma.ship.findFirst({
    where: {
      workId,
      characters: {
        every: {
          characterId: {
            in: [firstCharacterId, secondCharacterId],
          },
        },
      },
    },
    include: {
      aliases: true,
      characters: {
        include: {
          character: true,
        },
      },
    },
  });

  if (ship && ship.isKnown && ship.name) {
    return {
      exists: true,
      type: "KNOWN_SHIP",
      ship,
    };
  }

  return {
    exists: false,
    type: "CHARACTER_PAIR",
    characters,
  };
}
}