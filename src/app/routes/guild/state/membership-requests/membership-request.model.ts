import {GuildSummaryDto} from "../guilds/guild.model";
import {UserDto} from "../../../profile/state/users/user.model";

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
