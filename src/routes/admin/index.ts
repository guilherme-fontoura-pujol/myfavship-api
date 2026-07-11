import { Router } from "express";
import categoriesRoutes from "./categories.routes";
import worksRoutes from "./works.routes";
import charactersRoutes from "./characters.routes";
import shipsRoutes from "./ships.routes";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";
import uploadsRoutes from "./uploads.routes";

const adminRoutes = Router();

adminRoutes.use("/uploads", uploadsRoutes);
adminRoutes.use(authMiddleware);
adminRoutes.use(adminMiddleware);

adminRoutes.use("/categories", categoriesRoutes);
adminRoutes.use("/works", worksRoutes);
adminRoutes.use("/characters", charactersRoutes);
adminRoutes.use("/ships", shipsRoutes);

export default adminRoutes;