import { Router } from "express";
import { ShipsController } from "../../controllers/ships.controller";
import { validate } from "../../middlewares/validate.middleware";
import { updateShipSchema } from "../../validations/ships.validation";
import { createImageUpload } from "../../config/upload";

const shipImageUpload = createImageUpload("ships");
const shipsRoutes = Router();
const shipsController = new ShipsController();

shipsRoutes.patch(
  "/:id/image",
  shipImageUpload.single("image"),
  shipsController.updateImage
);
shipsRoutes.get("/", shipsController.list);
shipsRoutes.get("/preview", shipsController.preview);
shipsRoutes.get("/:id", shipsController.findById);
shipsRoutes.put("/:id", validate(updateShipSchema), shipsController.update);
shipsRoutes.delete("/:id", shipsController.delete);

export default shipsRoutes;