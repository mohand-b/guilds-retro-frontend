import {UserDto} from "../../../authenticated/state/authed/authed.model";
import {LightGuildDto} from "../guilds/guild.model";

export interface MembershipRequestDto {
  id: number;
  user: UserDto;
  guild: LightGuildDto;
  status: RequestStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

export enum RequestStatusEnum {
  PENDING = 'En attente de validation',
  APPROVED = 'Approuvé',
  REJECTED = 'Rejeté',
}
