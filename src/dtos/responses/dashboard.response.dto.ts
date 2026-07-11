import { ShipResponseDTO } from "./ship.response.dto";

export interface DashboardWorkResponseDTO {
  position: number;
  id: string;
  title: string;
  slug: string;
  coverImageUrl: string | null;
  category: string;
  votes: number;
  ships: number;
}

export interface TopWorkResponseDTO extends DashboardWorkResponseDTO {
  releaseYear: number | null;
  characters: number;
}

export interface DashboardStatsResponseDTO {
  works: number;
  characters: number;
  ships: number;
  votes: number;
}

export interface DashboardResponseDTO {
  topShips: ShipResponseDTO[];
  topWorks: TopWorkResponseDTO[];
  mostDiverseWorks: DashboardWorkResponseDTO[];
  stats: DashboardStatsResponseDTO;
}