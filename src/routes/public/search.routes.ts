import { Router } from "express";
import { SearchController } from "../../controllers/search.controller";

const searchRoutes = Router();
const searchController = new SearchController();

searchRoutes.get("/", searchController.search);

export default searchRoutes;