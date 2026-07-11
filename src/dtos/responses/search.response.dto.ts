import { ShipResponseDTO } from "./ship.response.dto";

export interface SearchWorkResponseDTO {
  id: string;
  title: string;
  slug: string;
  coverImageUrl: string | null;
  releaseYear: number | null;
  category: string;
}

export interface SearchCharacterResponseDTO {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  gender: string;

  work: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface SearchResponseDTO {
  query: string;

  works: SearchWorkResponseDTO[];
  characters: SearchCharacterResponseDTO[];
  ships: ShipResponseDTO[];

  totals: {
    works: number;
    characters: number;
    ships: number;
  };
}