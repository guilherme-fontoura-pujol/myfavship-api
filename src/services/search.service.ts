import prisma from "../config/database";
import { shipPublicInclude } from "../prisma/includes";
import { ShipMapper } from "../mappers/ship.mapper";
import { SearchResponseDTO } from "../dtos/responses/search.response.dto";
import { AppError } from "../utils/AppError";

export class SearchService {
  async search(query: string, limit = 5): Promise<SearchResponseDTO> {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
      throw new AppError(
        "A pesquisa deve possuir pelo menos 2 caracteres.",
        400
      );
    }

    const safeLimit = Math.min(Math.max(limit, 1), 20);

    const [works, characters, ships] = await Promise.all([
      prisma.work.findMany({
        where: {
          OR: [
            {
              title: {
                contains: normalizedQuery,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: normalizedQuery,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          category: true,
        },
        orderBy: {
          title: "asc",
        },
        take: safeLimit,
      }),

      prisma.character.findMany({
        where: {
          OR: [
            {
              name: {
                contains: normalizedQuery,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: normalizedQuery,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          work: true,
        },
        orderBy: {
          name: "asc",
        },
        take: safeLimit,
      }),

      prisma.ship.findMany({
        where: {
          OR: [
            {
              name: {
                contains: normalizedQuery,
                mode: "insensitive",
              },
            },
            {
              aliases: {
                some: {
                  name: {
                    contains: normalizedQuery,
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              characters: {
                some: {
                  character: {
                    name: {
                      contains: normalizedQuery,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          ],
        },
        include: shipPublicInclude,
        orderBy: {
          votes: {
            _count: "desc",
          },
        },
        take: safeLimit,
      }),
    ]);

    return {
      query: normalizedQuery,

      works: works.map((work) => ({
        id: work.id,
        title: work.title,
        slug: work.slug,
        coverImageUrl: work.coverImageUrl,
        releaseYear: work.releaseYear,
        category: work.category.name,
      })),

      characters: characters.map((character) => ({
        id: character.id,
        name: character.name,
        slug: character.slug,
        imageUrl: character.imageUrl,
        gender: character.gender,

        work: {
          id: character.work.id,
          title: character.work.title,
          slug: character.work.slug,
        },
      })),

      ships: ships.map((ship) => ShipMapper.toPublic(ship)),

      totals: {
        works: works.length,
        characters: characters.length,
        ships: ships.length,
      },
    };
  }
}