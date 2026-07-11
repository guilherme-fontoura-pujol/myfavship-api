import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Nome da categoria deve ter pelo menos 2 caracteres."),
});