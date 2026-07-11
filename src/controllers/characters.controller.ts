import { Request, Response, NextFunction } from "express";
import { CharactersService } from "../services/characters.service";
import { CharacterMapper } from "../mappers/character.mapper";
import { AppError } from "../utils/AppError";

const charactersService = new CharactersService();

export class CharactersController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const character = await charactersService.create(req.body);
      return res.status(201).json(character);
    } catch (error) {
      next(error);
    }
  }

  async findPublicBySlug(
  req: Request<
    { slug: string },
    unknown,
    unknown,
    { work: string }
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const character = await charactersService.findPublicBySlug(
      req.params.slug,
      req.query.work
    );

    return res.json(CharacterMapper.toPublic(character));
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

    const imageUrl = `/uploads/characters/${req.file.filename}`;

    const character = await charactersService.updateImage(
      req.params.id,
      imageUrl
    );

    return res.json(character);
  } catch (error) {
    next(error);
  }
}

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const characters = await charactersService.list();
      return res.json(characters);
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
    const character = await charactersService.findById(req.params.id);
    return res.json(character);
  } catch (error) {
    next(error);
  }
}

  async update(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const character = await charactersService.update(
      req.params.id,
      req.body
    );

    return res.json(character);
  } catch (error) {
    next(error);
  }
}

  async delete(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    await charactersService.delete(req.params.id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}
}