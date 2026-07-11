import { Router } from "express";
import { UploadsController } from "../../controllers/uploads.controller";
import { createImageUpload } from "../../config/upload";

const uploadsRoutes = Router();
const uploadsController = new UploadsController();

const allowedFolders = ["works", "characters", "ships"];

uploadsRoutes.post(
  "/:folder",
  (req, res, next) => {
    const { folder } = req.params;

    if (
      typeof folder !== "string" ||
      !allowedFolders.includes(folder)
    ) {
      return res.status(400).json({
        error: "Tipo de upload inválido.",
      });
    }

    return createImageUpload(folder).single("image")(
      req,
      res,
      next
    );
  },
  uploadsController.uploadImage
);

export default uploadsRoutes;