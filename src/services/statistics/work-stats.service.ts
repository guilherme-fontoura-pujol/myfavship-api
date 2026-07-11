import prisma from "../../config/database";
import { WorkStatsResponseDTO } from "../../dtos/responses/work-stats.response.dto";
import { ShipMapper } from "../../mappers/ship.mapper";
import { shipPublicInclude } from "../../prisma/includes";
import { AppError } from "../../utils/AppError";

export class WorkStatsService {
  async getStats(workSlug: string): Promise<WorkStatsResponseDTO> {
    const work = await prisma.work.findUnique({
      where: {
        slug: workSlug,
      },
      include: {
        category: true,

        characters: {
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
        },
      },
    });

    if (!work) {
      throw new AppError("Obra não encontrada.", 404);
    }

    const mappedShips = work.ships.map((ship, index) =>
      ShipMapper.toPublic(ship, index + 1)
    );

    const totalCharacters = work.characters.length;

    const playableCharacters = work.characters.filter(
      (character) => character.isPlayable
    ).length;

    const totalShips = work.ships.length;

    const knownShips = work.ships.filter(
      (ship) => ship.isKnown
    ).length;

    const unknownShips = totalShips - knownShips;

    const totalVotes = work.ships.reduce(
      (total, ship) => total + ship._count.votes,
      0
    );

    const averageVotesPerShip =
      totalShips === 0
        ? 0
        : Number((totalVotes / totalShips).toFixed(2));

    const characterStats = new Map<
      string,
      {
        id: string;
        name: string;
        slug: string;
        imageUrl: string | null;
        ships: number;
        votes: number;
      }
    >();

    for (const character of work.characters) {
      characterStats.set(character.id, {
        id: character.id,
        name: character.name,
        slug: character.slug,
        imageUrl: character.imageUrl,
        ships: 0,
        votes: 0,
      });
    }

    for (const ship of work.ships) {
      for (const relation of ship.characters) {
        const stats = characterStats.get(
          relation.character.id
        );

        if (!stats) {
          continue;
        }

        stats.ships += 1;
        stats.votes += ship._count.votes;
      }
    }

    const topCharacters = [...characterStats.values()]
      .sort((first, second) => {
        if (second.votes !== first.votes) {
          return second.votes - first.votes;
        }

        if (second.ships !== first.ships) {
          return second.ships - first.ships;
        }

        return first.name.localeCompare(second.name);
      })
      .slice(0, 10);

    return {
      work: {
        id: work.id,
        title: work.title,
        slug: work.slug,
        coverImageUrl: work.coverImageUrl,
        releaseYear: work.releaseYear,

        category: {
          id: work.category.id,
          name: work.category.name,
        },
      },

      stats: {
        totalCharacters,
        playableCharacters,
        totalShips,
        knownShips,
        unknownShips,
        totalVotes,
        averageVotesPerShip,
        mostPopularShip: mappedShips[0] ?? null,
      },

      topCharacters,

      ships: mappedShips,
    };
  }
}