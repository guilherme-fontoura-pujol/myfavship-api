import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

const uploadsRoot = path.resolve(process.cwd(), "uploads");

function ensureDirectory(directory: string) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

function createStorage(folder: string) {
  const destination = path.join(uploadsRoot, folder);

  ensureDirectory(destination);

  return multer.diskStorage({
    destination: (_req, _file, callback) => {
      callback(null, destination);
    },

    filename: (_req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const filename = `${crypto.randomUUID()}${extension}`;

      callback(null, filename);
    },
  });
}

function imageFileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      new Error("Formato inválido. Envie uma imagem JPG, PNG ou WEBP.")
    );
  }

  callback(null, true);
}

export function createImageUpload(folder: string) {
  return multer({
    storage: createStorage(folder),

    fileFilter: imageFileFilter,

    limits: {
      fileSize: 5 * 1024 * 1024,
      files: 1,
    },
  });
}