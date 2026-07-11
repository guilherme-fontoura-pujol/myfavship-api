export interface CreateWorkDTO {
  title: string;
  description?: string;
  categoryId: string;
  coverImageUrl?: string;
  releaseYear?: number;
}

export interface UpdateWorkDTO {
  title?: string;
  description?: string;
  categoryId?: string;
  coverImageUrl?: string;
  releaseYear?: number;
}