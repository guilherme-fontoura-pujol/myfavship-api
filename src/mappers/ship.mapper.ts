import { ShipResponseDTO } from "../dtos/responses/ship.response.dto";
import { ShipPublicPayload } from "../prisma/includes";

export class ShipMapper {
  static toPublic(
    ship: ShipPublicPayload,
    ranking: number | null = null
  ): ShipResponseDTO {
    return {
      id: ship.id,
      name: this.getDisplayName(ship),
      imageUrl: ship.imageUrl,
      isKnown: ship.isKnown,
      votes: ship._count.votes,
      ranking,

      work: {
        id: ship.work.id,
        title: ship.work.title,
        slug: ship.work.slug,
        coverImageUrl: ship.work.coverImageUrl,
        category: ship.work.category.name,
      },

      characters: ship.characters.map((item) => ({
        id: item.character.id,
        name: item.character.name,
        slug: item.character.slug,
        imageUrl: item.character.imageUrl,
      })),

      aliases: ship.aliases.map((alias) => alias.name),
    };
  }

  static getDisplayName(ship: ShipPublicPayload): string {
    if (ship.name?.trim()) {
      return ship.name;
    }

    return ship.characters
      .map((item) => item.character.name)
      .sort((firstName, secondName) =>
        firstName.localeCompare(secondName)
      )
      .join(" × ");
  }

  static generateNameFromCharacters(
  characters: { name: string }[]
): string {
  return characters
    .map((character) => character.name)
    .sort((firstName, secondName) =>
      firstName.localeCompare(secondName)
    )
    .join(" × ");
}
}