import {CharacterClassEnum, UserDto} from "../../../authenticated/state/authed/authed.model";
import {MembershipRequestDto} from "../membership-requests/membership-request.model";
import {AllianceRequestDto} from "../alliances/alliance.model";

export interface GuildDto {
  id?: number;
  name?: string;
  description?: string;
  members: UserDto[];
  allies: GuildSummaryDto[];
  memberClassesCount?: Record<CharacterClassEnum, number>;
  level: number;
  logo?: string;
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
