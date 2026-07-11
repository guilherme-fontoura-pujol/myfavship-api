import { NextFunction, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ProfileService } from "../services/profile.service";
import { AppError } from "../utils/AppError";

const profileService = new ProfileService();

export class ProfileController {
  async me(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.userId) {
        throw new AppError("Usuário não autenticado.", 401);
      }

      const profile = await profileService.getProfile(req.userId);

      return res.json(profile);
    } catch (error) {
      next(error);
    }
  }
}