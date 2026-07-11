import prisma from "../config/database";
import { AppError } from "../utils/AppError";
import { ProfileResponseDTO } from "../dtos/responses/profile.response.dto";
import { ShipMapper } from "../mappers/ship.mapper";

export class ProfileService {
  async getProfile(userId: string): Promise<ProfileResponseDTO> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        votes: {
          include: {
            work: true,
            ship: {
              include: {
                characters: {
                  include: {
                    character: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    const knownShips = user.votes.filter(
      (vote) => vote.ship.isKnown
    ).length;

    const unknownShips = user.votes.length - knownShips;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,

      stats: {
        votes: user.votes.length,
        knownShips,
        unknownShips,
        worksVoted: user.votes.length,
      },

      votes: user.votes.map((vote) => ({
        id: vote.id,
        createdAt: vote.createdAt,

        work: {
          id: vote.work.id,
          title: vote.work.title,
          slug: vote.work.slug,
          coverImageUrl: vote.work.coverImageUrl,
        },

        ship: {
          id: vote.ship.id,
          name:
  vote.ship.name?.trim() ||
  ShipMapper.generateNameFromCharacters(
    vote.ship.characters.map((item) => item.character)
  ),
          imageUrl: vote.ship.imageUrl,
          isKnown: vote.ship.isKnown,

          characters: vote.ship.characters.map((item) => ({
            id: item.character.id,
            name: item.character.name,
            slug: item.character.slug,
            imageUrl: item.character.imageUrl,
          })),
        },
      })),
    };
  }
}