import { Router } from "express";
import { CharactersController } from "../controllers/characters.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createCharacterSchema,
  updateCharacterSchema,
} from "../validations/characters.validation";

const charactersRoutes = Router();
const charactersController = new CharactersController();

charactersRoutes.get("/", charactersController.list);
charactersRoutes.get("/:id", charactersController.findById);

charactersRoutes.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validate(createCharacterSchema),
  charactersController.create
);

charactersRoutes.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validate(updateCharacterSchema),
  charactersController.update
);

charactersRoutes.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  charactersController.delete
);

export default charactersRoutes;