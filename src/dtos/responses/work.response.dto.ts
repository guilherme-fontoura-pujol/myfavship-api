import { ShipResponseDTO } from "./ship.response.dto";

export interface WorkCategoryResponseDTO {
  id: string;
  name: string;
}

export interface WorkCharacterResponseDTO {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  gender: string;
}

export interface WorkStatsResponseDTO {
  votes: number;
  ships: number;
  characters: number;
}

export interface WorkResponseDTO {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  releaseYear: number | null;

  category: WorkCategoryResponseDTO;

  stats: WorkStatsResponseDTO;

  characters: WorkCharacterResponseDTO[];

  topShips: ShipResponseDTO[];
}