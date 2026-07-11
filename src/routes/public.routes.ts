import { Router } from "express";
import worksRoutes from "./works.routes";
import charactersRoutes from "./characters.routes";
import shipsRoutes from "./ships.routes";
import rankingsRoutes from "./rankings.routes";
import votesRoutes from "./votes.routes";

const publicRoutes = Router();

publicRoutes.use("/works", worksRoutes);
publicRoutes.use("/characters", charactersRoutes);
publicRoutes.use("/ships", shipsRoutes);
publicRoutes.use("/rankings", rankingsRoutes);
publicRoutes.use("/votes", votesRoutes);

export default publicRoutes;