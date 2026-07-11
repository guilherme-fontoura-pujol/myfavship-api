import { Router } from "express";
import { CharactersController } from "../../controllers/characters.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  createCharacterSchema,
  updateCharacterSchema,
} from "../../validations/characters.validation";
import { createImageUpload } from "../../config/upload";

const characterImageUpload = createImageUpload("characters");
const charactersRoutes = Router();
const charactersController = new CharactersController();

charactersRoutes.patch(
  "/:id/image",
  characterImageUpload.single("image"),
  charactersController.updateImage
);
charactersRoutes.get("/", charactersController.list);
charactersRoutes.get("/:id", charactersController.findById);
charactersRoutes.post("/", validate(createCharacterSchema), charactersController.create);
charactersRoutes.put("/:id", validate(updateCharacterSchema), charactersController.update);
charactersRoutes.delete("/:id", charactersController.delete);

export default charactersRoutes;