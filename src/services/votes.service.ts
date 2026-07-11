import prisma from "../config/database";
import { AppError } from "../utils/AppError";
import { CreateVoteDTO } from "../dtos/requests/vote.request.dto";

export class VotesService {
  async create({ userId, workId, characterIds }: CreateVoteDTO) {
    if (characterIds.length !== 2) {
      throw new AppError("O voto deve conter exatamente 2 personagens.", 400);
    }

    const [firstCharacterId, secondCharacterId] = characterIds.sort();

    if (firstCharacterId === secondCharacterId) {
      throw new AppError("Escolha dois personagens diferentes.", 400);
    }

    const work = await prisma.work.findUnique({
      where: { id: workId },
    });

    if (!work) {
      throw new AppError("Obra não encontrada.", 404);
    }

    const characters = await prisma.character.findMany({
      where: {
        id: {
          in: [firstCharacterId, secondCharacterId],
        },
        workId,
        isPlayable: true,
      },
    });

    if (characters.length !== 2) {
      throw new AppError(
        "Personagens inválidos ou não pertencem à obra informada.",
        400
      );
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_workId: {
          userId,
          workId,
        },
      },
    });

    if (existingVote) {
      throw new AppError("Você já votou em um ship desta obra.", 400);
    }

    let ship = await prisma.ship.findFirst({
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
        characters: true,
      },
    });

    if (!ship || ship.characters.length !== 2) {
      ship = await prisma.ship.create({
        data: {
          workId,
          characters: {
            create: [
              { characterId: firstCharacterId },
              { characterId: secondCharacterId },
            ],
          },
        },
        include: {
          characters: true,
        },
      });
    }

    return prisma.vote.create({
      data: {
        userId,
        workId,
        shipId: ship.id,
      },
      include: {
        ship: {
          include: {
            characters: {
              include: {
                character: true,
              },
            },
          },
        },
        work: true,
      },
    });
  }
}