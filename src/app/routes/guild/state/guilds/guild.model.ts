import {UserDto} from "../../../authenticated/state/authed/authed.model";
import {MembershipRequestDto} from "../membership-requests/membership-request.request";

export interface GuildDto {
  id?: number;
  name?: string;
  description?: string;
  members: UserDto[];
  allies: guildAllie[];
  logo?: string;
}

export interface GuildState extends GuildDto {
  membershipRequests: MembershipRequestDto[];
}

export interface guildAllie {
  id: number;
  name: string;
  level: number;
  description?: string;
}
