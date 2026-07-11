import { Router } from "express";
import { WorksController } from "../../controllers/works.controller";
import { WorkStatsController } from "../../controllers/work-stats.controller";

const workStatsController = new WorkStatsController();
const worksRoutes = Router();
const worksController = new WorksController();

worksRoutes.get(
  "/:slug/stats",
  workStatsController.getStats
);
worksRoutes.get("/", worksController.list);
worksRoutes.get("/:slug", worksController.findPublicBySlug);

export default worksRoutes;