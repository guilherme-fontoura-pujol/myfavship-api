export interface ShipCharacterResponseDTO {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
}

export interface ShipWorkResponseDTO {
  id: string;
  title: string;
  slug: string;
  coverImageUrl: string | null;
  category: string;
}

export interface ShipResponseDTO {
  id: string;
  name: string;
  imageUrl: string | null;
  isKnown: boolean;
  votes: number;
  ranking: number | null;

  work: ShipWorkResponseDTO;

  characters: ShipCharacterResponseDTO[];

  aliases: string[];
}