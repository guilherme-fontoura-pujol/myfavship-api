import { createImageUpload } from "../../config/upload";
import { Router } from "express";
import { WorksController } from "../../controllers/works.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  createWorkSchema,
  updateWorkSchema,
} from "../../validations/works.validation";

const workImageUpload = createImageUpload("works");
const worksRoutes = Router();
const worksController = new WorksController();

worksRoutes.get("/", worksController.list);
worksRoutes.get("/:id", worksController.findById);
worksRoutes.post("/", validate(createWorkSchema), worksController.create);
worksRoutes.put("/:id", validate(updateWorkSchema), worksController.update);
worksRoutes.delete("/:id", worksController.delete);
worksRoutes.patch(
  "/:id/image",
  workImageUpload.single("image"),
  worksController.updateImage
);

export default worksRoutes;