import { Request, Response, NextFunction } from "express";
import { RankingsService } from "../services/rankings.service";
import { DashboardMapper } from "../mappers/dashboard.mapper";
import { ShipMapper } from "../mappers/ship.mapper";

const rankingsService = new RankingsService();

export class RankingsController {
  async topShips(req: Request, res: Response, next: NextFunction) {
  try {
    const ranking = await rankingsService.topShips();

    return res.json(
      ranking.map((ship, index) => ShipMapper.toPublic(ship, index + 1))
    );
  } catch (error) {
    next(error);
  }
}

  async topWorks(req: Request, res: Response, next: NextFunction) {
    try {
      const ranking = await rankingsService.topWorks();
      return res.json(ranking);
    } catch (error) {
      next(error);
    }
  }

  async dashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const dashboard = await rankingsService.dashboard();
    return res.json(DashboardMapper.toPublic(dashboard));
  } catch (error) {
    next(error);
  }
}

  async workRanking(
  req: Request<{ workId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const ranking = await rankingsService.workRanking(
      req.params.workId
    );

    return res.json(
      ranking.map((ship, index) =>
        ShipMapper.toPublic(ship, index + 1)
      )
    );
  } catch (error) {
    next(error);
  }
}

  async mostDiverseWorks(req: Request, res: Response, next: NextFunction) {
  try {
    const ranking = await rankingsService.mostDiverseWorks();
    return res.json(ranking);
  } catch (error) {
    next(error);
  }
}
}