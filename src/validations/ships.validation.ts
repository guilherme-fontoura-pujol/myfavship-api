import { z } from "zod";

export const updateShipSchema = z.object({
  name: z.string().min(2).optional(),
  imageUrl: z.string().optional(),
  isKnown: z.boolean().optional(),
  aliases: z.array(z.string().min(2)).optional(),
});