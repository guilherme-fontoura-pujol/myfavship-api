import { Router } from "express";
import { CategoriesController } from "../controllers/categories.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createCategorySchema } from "../validations/categories.validation";

const categoriesRoutes = Router();
const categoriesController = new CategoriesController();

categoriesRoutes.get("/", categoriesController.list);
categoriesRoutes.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validate(createCategorySchema),
  categoriesController.create
);

export default categoriesRoutes;