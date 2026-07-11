import { Request, Response, NextFunction } from "express";
import { WorksService } from "../services/works.service";
import { WorkMapper } from "../mappers/work.mapper";
import { AppError } from "../utils/AppError";

const worksService = new WorksService();

export class WorksController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const work = await worksService.create(req.body);
      return res.status(201).json(work);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const works = await worksService.list();
      return res.json(works);
    } catch (error) {
      next(error);
    }
  }

  async updateImage(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.file) {
      throw new AppError("Nenhuma imagem foi enviada.", 400);
    }

    const coverImageUrl = `/uploads/works/${req.file.filename}`;

    const work = await worksService.updateImage(
      req.params.id,
      coverImageUrl
    );

    return res.json(work);
  } catch (error) {
    next(error);
  }
}

  async findPublicBySlug(
  req: Request<{ slug: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const work = await worksService.findPublicBySlug(req.params.slug);
    return res.json(WorkMapper.toPublic(work));
  } catch (error) {
    next(error);
  }
}

  async findById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const work = await worksService.findById(req.params.id);
    return res.json(work);
  } catch (error) {
    next(error);
  }
}

  async update(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const work = await worksService.update(req.params.id, req.body);
      return res.json(work);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      await worksService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}