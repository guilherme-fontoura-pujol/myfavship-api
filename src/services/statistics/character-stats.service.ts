import prisma from "../../config/database";
import { CharacterStatsResponseDTO } from "../../dtos/responses/character-stats.response.dto";
import { ShipMapper } from "../../mappers/ship.mapper";
import { shipPublicInclude } from "../../prisma/includes";
import { AppError } from "../../utils/AppError";

export class CharacterStatsService {
  async getStats(
    characterSlug: string,
    workSlug: string
  ): Promise<CharacterStatsResponseDTO> {
    const work = await prisma.work.findUnique({
      where: {
        slug: workSlug,
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    if (!work) {
      throw new AppError("Obra não encontrada.", 404);
    }

    const character = await prisma.character.findUnique({
      where: {
        slug_workId: {
          slug: characterSlug,
          workId: work.id,
        },
      },
      include: {
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

    const orderedShips = character.shipCharacters
      .map((relation) => relation.ship)
      .sort((first, second) => {
        return second._count.votes - first._count.votes;
      });

    const mappedShips = orderedShips.map((ship, index) =>
      ShipMapper.toPublic(ship, index + 1)
    );

    const totalShips = orderedShips.length;

    const knownShips = orderedShips.filter(
      (ship) => ship.isKnown
    ).length;

    const unknownShips = totalShips - knownShips;

    const totalVotes = orderedShips.reduce(
      (total, ship) => total + ship._count.votes,
      0
    );

    const averageVotesPerShip =
      totalShips === 0
        ? 0
        : Number((totalVotes / totalShips).toFixed(2));

    return {
      character: {
        id: character.id,
        name: character.name,
        slug: character.slug,
        imageUrl: character.imageUrl,
      },

      work,

      stats: {
        totalShips,
        knownShips,
        unknownShips,
        totalVotes,
        averageVotesPerShip,
        mostPopularShip: mappedShips[0] ?? null,
      },

      ships: mappedShips,
    };
  }
}