export interface ProfileVoteResponseDTO {
  id: string;
  createdAt: Date;

  work: {
    id: string;
    title: string;
    slug: string;
    coverImageUrl: string | null;
  };

  ship: {
    id: string;
    name: string;
    imageUrl: string | null;
    isKnown: boolean;

    characters: {
      id: string;
      name: string;
      slug: string;
      imageUrl: string | null;
    }[];
  };
}

export interface ProfileResponseDTO {
  id: string;
  name: string;
  email: string;
  role: string;

  stats: {
    votes: number;
    knownShips: number;
    unknownShips: number;
    worksVoted: number;
  };

  votes: ProfileVoteResponseDTO[];
}