import { Router } from "express";
import { ProfileController } from "../../controllers/profile.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const profileRoutes = Router();
const profileController = new ProfileController();

profileRoutes.get(
  "/me",
  authMiddleware,
  profileController.me
);

export default profileRoutes;