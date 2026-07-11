import { Router } from "express";
import { WorksController } from "../controllers/works.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createWorkSchema, updateWorkSchema } from "../validations/works.validation";

const worksRoutes = Router();
const worksController = new WorksController();

worksRoutes.get("/", worksController.list);
worksRoutes.get("/:id", worksController.findById);

worksRoutes.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validate(createWorkSchema),
  worksController.create
);

worksRoutes.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validate(updateWorkSchema),
  worksController.update
);

worksRoutes.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  worksController.delete
);

export default worksRoutes;