import { z } from "zod";

export const createVoteSchema = z.object({
  workId: z.uuid("Obra inválida."),
  characterIds: z
    .array(z.uuid("Personagem inválido."))
    .length(2, "Você deve escolher exatamente 2 personagens."),
});