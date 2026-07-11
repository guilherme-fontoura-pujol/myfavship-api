import { Request, Response, NextFunction } from "express";
import { CategoriesService } from "../services/categories.service";

const categoriesService = new CategoriesService();

export class CategoriesController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoriesService.create(req.body);
      return res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoriesService.list();
      return res.json(categories);
    } catch (error) {
      next(error);
    }
  }
}