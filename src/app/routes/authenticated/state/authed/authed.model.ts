import {MembershipRequestDto} from "../../../guild/state/membership-requests/membership-request.model";
import {UserDto} from "../../../profile/state/users/user.model";

export interface AuthedStateDto {
  user: UserDto | undefined;
  token: string | undefined;
  requests: MembershipRequestDto[];
}

export enum UserRoleEnum {
  LEADER = 'Meneur',
  OFFICER = 'Bras droit',
  MEMBER = 'Membre',
  CANDIDATE = 'Candidat',
}

export enum AppRankEnum {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

type RoleHierarchy = {
  [key in UserRoleEnum]: UserRoleEnum[];
};

export const roleHierarchy: RoleHierarchy = {
  [UserRoleEnum.CANDIDATE]: [],
  [UserRoleEnum.MEMBER]: [UserRoleEnum.CANDIDATE],
  [UserRoleEnum.OFFICER]: [UserRoleEnum.MEMBER, UserRoleEnum.CANDIDATE],
  [UserRoleEnum.LEADER]: [UserRoleEnum.OFFICER, UserRoleEnum.MEMBER, UserRoleEnum.CANDIDATE],
};

type RankHierarchy = {
  [key in AppRankEnum]: AppRankEnum[];
}

export const rankHierarchy: RankHierarchy = {
  [AppRankEnum.USER]: [],
  [AppRankEnum.MODERATOR]: [AppRankEnum.USER],
  [AppRankEnum.ADMIN]: [AppRankEnum.MODERATOR, AppRankEnum.USER],
};

