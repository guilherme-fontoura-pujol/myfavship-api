import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export class UploadsController {
  async uploadImage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        throw new AppError("Nenhuma imagem foi enviada.", 400);
      }

      const folder = req.params.folder;

      return res.status(201).json({
        filename: req.file.filename,
        imageUrl: `/uploads/${folder}/${req.file.filename}`,
        mimeType: req.file.mimetype,
        size: req.file.size,
      });
    } catch (error) {
      next(error);
    }
  }
}