import { ShipResponseDTO } from "./ship.response.dto";

export interface CharacterWorkResponseDTO {
  id: string;
  title: string;
  slug: string;
  category: string;
}

export interface CharacterStatsResponseDTO {
  ships: number;
  votes: number;
}

export interface CharacterResponseDTO {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  description: string | null;
  gender: string;
  isPlayable: boolean;

  work: CharacterWorkResponseDTO;

  stats: CharacterStatsResponseDTO;

  topShips: ShipResponseDTO[];
}