import { Router } from "express";
import authRoutes from "./auth.routes";
import adminRoutes from "./admin";
import publicRoutes from "./public";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/admin", adminRoutes);
routes.use("/public", publicRoutes);

export default routes;