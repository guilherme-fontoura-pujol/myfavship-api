import { Router } from "express";
import { VotesController } from "../controllers/votes.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createVoteSchema } from "../validations/votes.validation";

const votesRoutes = Router();
const votesController = new VotesController();

votesRoutes.post(
  "/",
  authMiddleware,
  validate(createVoteSchema),
  votesController.create
);

export default votesRoutes;