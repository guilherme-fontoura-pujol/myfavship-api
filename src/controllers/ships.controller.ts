import { Request, Response, NextFunction } from "express";
import { ShipsService } from "../services/ships.service";
import { ShipMapper } from "../mappers/ship.mapper";
import { AppError } from "../utils/AppError";

const shipsService = new ShipsService();

export class ShipsController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const ships = await shipsService.list();
      return res.json(ships);
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

    const imageUrl = `/uploads/ships/${req.file.filename}`;

    const ship = await shipsService.updateImage(
      req.params.id,
      imageUrl
    );

    return res.json(ship);
  } catch (error) {
    next(error);
  }
}

  async findPublicById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const { ship, ranking } = await shipsService.findPublicById(req.params.id);

    return res.json(ShipMapper.toPublic(ship, ranking));
  } catch (error) {
    next(error);
  }
}

  async findById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const ship = await shipsService.findById(req.params.id);
      return res.json(ship);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      const ship = await shipsService.update(req.params.id, req.body);
      return res.json(ship);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
      await shipsService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
  async preview(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await shipsService.preview(
      req.query.workId as string,
      [req.query.character1 as string, req.query.character2 as string]
    );

    return res.json(result);
  } catch (error) {
    next(error);
  }
}
}