import { Gender } from "@prisma/client";

export interface CreateCharacterDTO {
  name: string;
  imageUrl?: string;
  description?: string;
  gender?: Gender;
  isPlayable?: boolean;
  workId: string;
}

export interface UpdateCharacterDTO {
  name?: string;
  imageUrl?: string;
  description?: string;
  gender?: Gender;
  isPlayable?: boolean;
  workId?: string;
}