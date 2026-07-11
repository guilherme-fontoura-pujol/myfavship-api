import { ShipResponseDTO } from "./ship.response.dto";

export interface CharacterStatsSummaryDTO {
  totalShips: number;
  knownShips: number;
  unknownShips: number;
  totalVotes: number;
  averageVotesPerShip: number;
  mostPopularShip: ShipResponseDTO | null;
}

export interface CharacterStatsResponseDTO {
  character: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
  };

  work: {
    id: string;
    title: string;
    slug: string;
  };

  stats: CharacterStatsSummaryDTO;

  ships: ShipResponseDTO[];
}