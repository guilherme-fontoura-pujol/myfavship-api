import { z } from "zod";

export const createCharacterSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "UNKNOWN"]).optional(),
  isPlayable: z.boolean().optional(),
  workId: z.uuid("Obra inválida."),
});

export const updateCharacterSchema = z.object({
  name: z.string().min(2).optional(),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "UNKNOWN"]).optional(),
  isPlayable: z.boolean().optional(),
  workId: z.uuid("Obra inválida.").optional(),
});