export interface CreateVoteRequestDTO {
  workId: string;
  characterIds: string[];
}

export interface CreateVoteDTO extends CreateVoteRequestDTO {
  userId: string;
}