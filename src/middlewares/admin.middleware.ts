import { Response, NextFunction } from "express";
import prisma from "../config/database";
import { AuthRequest } from "./auth.middleware";

export async function adminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      error: "Usuário não autenticado.",
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({
      error: "Acesso permitido apenas para administradores.",
    });
  }

  return next();
}