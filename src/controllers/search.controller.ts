import { NextFunction, Request, Response } from "express";
import { SearchService } from "../services/search.service";

interface SearchQuery {
  q?: string;
  limit?: string;
}

const searchService = new SearchService();

export class SearchController {
  async search(
    req: Request<object, object, object, SearchQuery>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const query = req.query.q ?? "";
      const parsedLimit = Number(req.query.limit);
      const limit = Number.isInteger(parsedLimit) ? parsedLimit : 5;

      const result = await searchService.search(query, limit);

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}