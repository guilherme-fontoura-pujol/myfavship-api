import { Router } from "express";
import worksRoutes from "./works.routes";
import charactersRoutes from "./characters.routes";
import shipsRoutes from "./ships.routes";
import rankingsRoutes from "./rankings.routes";
import votesRoutes from "./votes.routes";
import searchRoutes from "./search.routes";
import profileRoutes from "./profile.routes";

const publicRoutes = Router();

publicRoutes.use("/profile", profileRoutes);
publicRoutes.use("/search", searchRoutes);
publicRoutes.use("/works", worksRoutes);
publicRoutes.use("/characters", charactersRoutes);
publicRoutes.use("/ships", shipsRoutes);
publicRoutes.use("/rankings", rankingsRoutes);
publicRoutes.use("/votes", votesRoutes);

export default publicRoutes;