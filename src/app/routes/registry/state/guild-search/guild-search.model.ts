export interface GuildSearchDto {
  name?: string;
  minAverageLevel?: number;
  page?: number;
  limit?: number;
}

export interface GuildResponseDto {
  id: number;
  name: string;
  logo: Buffer | null;
  membersCount: number;
  averageLevel: number;
}

export interface PaginatedUserGuildResponseDto {
  total: number;
  page: number;
  limit: number;
  results: GuildResponseDto[];
}
