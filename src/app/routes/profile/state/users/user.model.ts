import {UserDto} from "../../../authenticated/state/authed/authed.model";

export interface UserSearchDto {
  username?: string;
  characterClass?: string;
  characterLevel?: number;
  jobName?: string;
  jobLevel?: number;
  page?: number;
  limit?: number;
}


export interface UserSearchResponse {
  data: UserDto[];
  total: number;
  page: number;
  limit: number;
}
