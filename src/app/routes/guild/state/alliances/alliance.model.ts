import {GuildSummaryDto} from "../guilds/guild.model";

export interface AllianceDto {
  id: number;
  requesterGuild: GuildSummaryDto;
  targetGuild: GuildSummaryDto;
  status: AllianceStatusEnum;
}

export interface AllianceRequestDto {
  id: number;
  requesterGuild?: GuildSummaryDto;
  targetGuild?: GuildSummaryDto;
  status: AllianceStatusEnum;
}

export enum AllianceStatusEnum {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export type PendingAllianceRequestDto = Extract<AllianceRequestDto, { status: AllianceStatusEnum.PENDING }>;
