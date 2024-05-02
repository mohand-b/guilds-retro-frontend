import {UserDto} from "../../../authenticated/state/authed/authed.model";
import {GuildDto} from "../guilds/guild.model";

export interface MembershipRequestDto {
  id: number;
  user: UserDto;
  guild: GuildDto;
  status: RequestStatusEnum;
}

export enum RequestStatusEnum {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}
