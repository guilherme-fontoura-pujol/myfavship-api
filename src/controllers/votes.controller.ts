import { Response, NextFunction } from "express";
import { VotesService } from "../services/votes.service";
import { AuthRequest } from "../middlewares/auth.middleware";

const votesService = new VotesService();

export class VotesController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const vote = await votesService.create({
        userId: req.userId!,
        workId: req.body.workId,
        characterIds: req.body.characterIds,
      });

      return res.status(201).json(vote);
    } catch (error) {
      next(error);
    }
  }
}