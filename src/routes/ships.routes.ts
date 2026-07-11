import { Router } from "express";
import { ShipsController } from "../controllers/ships.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateShipSchema } from "../validations/ships.validation";

const shipsRoutes = Router();
const shipsController = new ShipsController();

shipsRoutes.get("/preview", shipsController.preview);
shipsRoutes.get("/", shipsController.list);
shipsRoutes.get("/:id", shipsController.findById);

shipsRoutes.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validate(updateShipSchema),
  shipsController.update
);

shipsRoutes.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  shipsController.delete
);

export default shipsRoutes;