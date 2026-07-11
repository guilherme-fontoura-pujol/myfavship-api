import prisma from "../config/database";
import {
  shipPublicInclude,
  topWorkInclude,
  diverseWorkInclude,
} from "../prisma/includes";

export class RankingsService {
  async topShips() {
    return prisma.ship.findMany({
      include: shipPublicInclude,
      orderBy: {
        votes: {
          _count: "desc",
        },
      },
      take: 10,
    });
  }

  async dashboard() {
  const [topShips, topWorks, mostDiverseWorks, stats] = await Promise.all([
    this.topShips(),
    this.topWorks(),
    this.mostDiverseWorks(),

    Promise.all([
      prisma.work.count(),
      prisma.character.count(),
      prisma.ship.count(),
      prisma.vote.count(),
    ]),
  ]);

  return {
    topShips,
    topWorks,
    mostDiverseWorks,
    stats: {
      works: stats[0],
      characters: stats[1],
      ships: stats[2],
      votes: stats[3],
    },
  };
}

  async topWorks() {
  return prisma.work.findMany({
    include: topWorkInclude,
    orderBy: {
      votes: {
        _count: "desc",
      },
    },
    take: 10,
  });
}
  async workRanking(workId: string) {
  return prisma.ship.findMany({
    where: { workId },
    include: shipPublicInclude,
    orderBy: {
      votes: {
        _count: "desc",
      },
    },
  });
}

async mostDiverseWorks() {
  return prisma.work.findMany({
    include: diverseWorkInclude,
    orderBy: {
      ships: {
        _count: "desc",
      },
    },
    take: 10,
  });
}
}