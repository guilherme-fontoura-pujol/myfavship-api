import { NextFunction, Request, Response } from "express";
import { CharacterStatsService } from "../services/statistics/character-stats.service";

interface CharacterStatsQuery {
  work?: string;
}

const characterStatsService = new CharacterStatsService();

export class CharacterStatsController {
  async getStats(
    req: Request<
      { slug: string },
      unknown,
      unknown,
      CharacterStatsQuery
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const workSlug = req.query.work ?? "";

      const result = await characterStatsService.getStats(
        req.params.slug,
        workSlug
      );

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}