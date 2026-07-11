import { z } from "zod";

export const createWorkSchema = z.object({
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres."),
  description: z.string().optional(),
  categoryId: z.uuid("Categoria inválida."),
  coverImageUrl: z.string().optional(),
  releaseYear: z.number().int().optional(),
});

export const updateWorkSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  categoryId: z.uuid("Categoria inválida.").optional(),
  coverImageUrl: z.string().optional(),
  releaseYear: z.number().int().optional(),
});