import { ShipResponseDTO } from "./ship.response.dto";

export interface WorkTopCharacterResponseDTO {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  ships: number;
  votes: number;
}

export interface WorkStatsSummaryDTO {
  totalCharacters: number;
  playableCharacters: number;
  totalShips: number;
  knownShips: number;
  unknownShips: number;
  totalVotes: number;
  averageVotesPerShip: number;
  mostPopularShip: ShipResponseDTO | null;
}

export interface WorkStatsResponseDTO {
  work: {
    id: string;
    title: string;
    slug: string;
    coverImageUrl: string | null;
    releaseYear: number | null;

    category: {
      id: string;
      name: string;
    };
  };

  stats: WorkStatsSummaryDTO;

  topCharacters: WorkTopCharacterResponseDTO[];

  ships: ShipResponseDTO[];
}