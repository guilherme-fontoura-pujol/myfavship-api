import { Prisma } from "@prisma/client";

export const shipPublicInclude = {
  work: {
    include: {
      category: true,
    },
  },
  aliases: true,
  characters: {
    include: {
      character: true,
    },
  },
  _count: {
    select: {
      votes: true,
    },
  },
} satisfies Prisma.ShipInclude;

export const topWorkInclude = {
  category: true,
  _count: {
    select: {
      votes: true,
      ships: true,
      characters: true,
    },
  },
} satisfies Prisma.WorkInclude;

export const diverseWorkInclude = {
  category: true,
  _count: {
    select: {
      ships: true,
      votes: true,
    },
  },
} satisfies Prisma.WorkInclude;

export type ShipPublicPayload = Prisma.ShipGetPayload<{
  include: typeof shipPublicInclude;
}>;

export type TopWorkPayload = Prisma.WorkGetPayload<{
  include: typeof topWorkInclude;
}>;

export type DiverseWorkPayload = Prisma.WorkGetPayload<{
  include: typeof diverseWorkInclude;
}>;