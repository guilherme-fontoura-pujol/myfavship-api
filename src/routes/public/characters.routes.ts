import { Router } from "express";
import { CharactersController } from "../../controllers/characters.controller";
import { CharacterStatsController } from "../../controllers/character-stats.controller";

const characterStatsController = new CharacterStatsController();
const charactersRoutes = Router();
const charactersController = new CharactersController();

charactersRoutes.get(
  "/:slug/stats",
  characterStatsController.getStats
);
charactersRoutes.get("/", charactersController.list);
charactersRoutes.get("/:slug", charactersController.findPublicBySlug);

export default charactersRoutes;