import { Prisma } from "@prisma/client";
import { shipPublicInclude } from "../prisma/includes";
import { ShipMapper } from "./ship.mapper";
import { WorkResponseDTO } from "../dtos/responses/work.response.dto";

type WorkWithPublicRelations = Prisma.WorkGetPayload<{
  include: {
    category: true;
    characters: true;
    ships: {
      include: typeof shipPublicInclude;
    };
    _count: {
      select: {
        votes: true;
        ships: true;
        characters: true;
      };
    };
  };
}>;

export class WorkMapper {
  static toPublic(work: WorkWithPublicRelations): WorkResponseDTO {
    return {
      id: work.id,
      title: work.title,
      slug: work.slug,
      description: work.description,
      coverImageUrl: work.coverImageUrl,
      releaseYear: work.releaseYear,

      category: {
        id: work.category.id,
        name: work.category.name,
      },

      stats: {
        votes: work._count.votes,
        ships: work._count.ships,
        characters: work._count.characters,
      },

      characters: work.characters.map((character) => ({
        id: character.id,
        name: character.name,
        slug: character.slug,
        imageUrl: character.imageUrl,
        gender: character.gender,
      })),

      topShips: work.ships.map((ship, index) =>
        ShipMapper.toPublic(ship, index + 1)
      ),
    };
  }
}