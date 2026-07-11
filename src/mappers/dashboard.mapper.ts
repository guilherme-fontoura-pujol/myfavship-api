import {
  ShipPublicPayload,
  TopWorkPayload,
  DiverseWorkPayload,
} from "../prisma/includes";

import { DashboardResponseDTO } from "../dtos/responses/dashboard.response.dto";
import { ShipMapper } from "./ship.mapper";

interface DashboardData {
  topShips: ShipPublicPayload[];
  topWorks: TopWorkPayload[];
  mostDiverseWorks: DiverseWorkPayload[];

  stats: {
    works: number;
    characters: number;
    ships: number;
    votes: number;
  };
}

export class DashboardMapper {
  static toPublic(data: DashboardData): DashboardResponseDTO {
    return {
      topShips: data.topShips.map((ship, index) =>
        ShipMapper.toPublic(ship, index + 1)
      ),

      topWorks: data.topWorks.map((work, index) => ({
        position: index + 1,
        id: work.id,
        title: work.title,
        slug: work.slug,
        coverImageUrl: work.coverImageUrl,
        releaseYear: work.releaseYear,
        category: work.category.name,
        votes: work._count.votes,
        ships: work._count.ships,
        characters: work._count.characters,
      })),

      mostDiverseWorks: data.mostDiverseWorks.map((work, index) => ({
        position: index + 1,
        id: work.id,
        title: work.title,
        slug: work.slug,
        coverImageUrl: work.coverImageUrl,
        category: work.category.name,
        ships: work._count.ships,
        votes: work._count.votes,
      })),

      stats: data.stats,
    };
  }
}