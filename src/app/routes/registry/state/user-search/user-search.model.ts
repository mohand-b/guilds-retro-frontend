import {CharacterClassEnum, GenderEnum} from "../../../profile/state/users/user.model";

export interface UserSearchDto {
  username?: string;
  characterClass?: string;
  characterLevel?: number;
  jobName?: string;
  jobLevel?: number;
  page?: number;
  limit?: number;
}

export interface UserSearchResponseDto {
  id: number;
  username: string;
  characterClass: CharacterClassEnum;
  gender: GenderEnum;
  characterLevel: number;
}

export interface PaginatedUserSearchResponseDto {
  total: number;
  page: number;
  limit: number;
  results: UserSearchResponseDto[];
}
