import { Prisma } from "@prisma/client";
import { ShipMapper } from "./ship.mapper";
import { CharacterResponseDTO } from "../dtos/responses/character.response.dto";

type CharacterWithRelations = Prisma.CharacterGetPayload<{
  include: {
    work: {
      include: {
        category: true;
      };
    };
    shipCharacters: {
      include: {
        ship: {
          include: {
            work: {
              include: {
                category: true;
              };
            };
            aliases: true;
            characters: {
              include: {
                character: true;
              };
            };
            _count: {
              select: {
                votes: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export class CharacterMapper {
  static toPublic(
    character: CharacterWithRelations
  ): CharacterResponseDTO {
    const ships = character.shipCharacters.map((item) => item.ship);

    const totalVotes = ships.reduce((sum, ship) => {
      return sum + ship._count.votes;
    }, 0);

    return {
      id: character.id,
      name: character.name,
      slug: character.slug,
      imageUrl: character.imageUrl,
      description: character.description,
      gender: character.gender,
      isPlayable: character.isPlayable,

      work: {
        id: character.work.id,
        title: character.work.title,
        slug: character.work.slug,
        category: character.work.category.name,
      },

      stats: {
        ships: ships.length,
        votes: totalVotes,
      },

      topShips: [...ships]
  .sort((a, b) => b._count.votes - a._count.votes)
        .slice(0, 10)
        .map((ship) => ShipMapper.toPublic(ship)),
    };
  }
}