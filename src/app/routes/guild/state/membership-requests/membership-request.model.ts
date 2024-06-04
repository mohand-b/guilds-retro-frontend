import {UserDto} from "../../../authenticated/state/authed/authed.model";
import {GuildSummaryDto} from "../guilds/guild.model";

export interface MembershipRequestDto {
  id: number;
  user: UserDto;
  guild: GuildSummaryDto;
  status: RequestStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

export enum RequestStatusEnum {
  PENDING = 'En attente de validation',
  APPROVED = 'Approuvé',
  REJECTED = 'Rejeté',
}
