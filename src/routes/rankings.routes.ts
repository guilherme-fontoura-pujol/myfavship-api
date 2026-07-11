import { Router } from "express";
import { RankingsController } from "../controllers/rankings.controller";

const rankingsRoutes = Router();
const rankingsController = new RankingsController();

rankingsRoutes.get("/top-ships", rankingsController.topShips);
rankingsRoutes.get("/top-works", rankingsController.topWorks);
rankingsRoutes.get("/works/:workId", rankingsController.workRanking);
rankingsRoutes.get("/most-diverse-works", rankingsController.mostDiverseWorks);

export default rankingsRoutes;