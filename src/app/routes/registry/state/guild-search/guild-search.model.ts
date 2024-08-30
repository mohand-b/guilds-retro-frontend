export interface GuildSearchDto {
  name?: string;
  minAverageLevel?: number;
  page?: number;
  limit?: number;
}

export interface GuildSearchResponseDto {
  id: number;
  name: string;
  logo: Buffer | null;
  membersCount: number;
  averageLevel: number;
}

export interface PaginatedGuildSearchResponseDto {
  total: number;
  page: number;
  limit: number;
  results: GuildSearchResponseDto[];
}
