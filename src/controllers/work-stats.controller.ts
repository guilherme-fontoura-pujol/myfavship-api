import { NextFunction, Request, Response } from "express";
import { WorkStatsService } from "../services/statistics/work-stats.service";

const workStatsService = new WorkStatsService();

export class WorkStatsController {
  async getStats(
    req: Request<{ slug: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await workStatsService.getStats(
        req.params.slug
      );

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}