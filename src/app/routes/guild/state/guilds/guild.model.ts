import {MembershipRequestDto} from "../membership-requests/membership-request.model";
import {AllianceRequestDto} from "../alliances/alliance.model";
import {CharacterClassEnum, GenderEnum} from "../../../profile/state/users/user.model";
import {UserRoleEnum} from "../../../authenticated/state/authed/authed.model";

export interface GuildDto {
  id?: number;
  name?: string;
  description?: string;
  nbOfMembers?: number;
  members: MemberDto[];
  allies: GuildSummaryDto[];
  memberClassesCount?: Record<CharacterClassEnum, number>;
  level: number;
  logo?: string;
}

export interface GuildWithPaginatedMembersDto extends Omit<GuildDto, 'members'> {
  members: PaginatedMemberResponseDto;
}

export interface PaginatedMemberResponseDto {
  results: MemberDto[];
  total: number;
  page: number;
  limit: number;
}

export interface GuildAllianceRequestsDto {
  receivedAllianceRequests: AllianceRequestDto[];
  sentAllianceRequests: AllianceRequestDto[];
}

export interface GuildState extends GuildDto, GuildAllianceRequestsDto {
  membershipRequests: MembershipRequestDto[];
}

export interface GuildSummaryDto {
  id: number;
  name: string;
  level: number;
  logo: string;
  capacity: number;
  averageLevelOfMembers: number;
  memberClassesCount: Record<CharacterClassEnum, number>;
  description: string;
  nbOfMembers: number;
  nbOfAllies: number;
  leaderUsername: string;
}

export interface PaginatedMemberResponseDto {
  results: MemberDto[];
  total: number;
  page: number;
  limit: number;
}

export interface MemberDto {
  id: number;
  username: string;
  characterClass: CharacterClassEnum;
  gender: GenderEnum;
  characterLevel: number;
  role: UserRoleEnum;
}
