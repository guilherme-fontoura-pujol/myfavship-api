import { Router } from "express";
import { ShipsController } from "../../controllers/ships.controller";

const shipsRoutes = Router();
const shipsController = new ShipsController();

shipsRoutes.get("/", shipsController.list);
shipsRoutes.get("/preview", shipsController.preview);
shipsRoutes.get("/:id", shipsController.findPublicById);

export default shipsRoutes;