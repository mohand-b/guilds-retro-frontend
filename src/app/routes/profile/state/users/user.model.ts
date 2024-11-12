import {GuildDto} from "../../../guild/state/guilds/guild.model";
import {JobDto} from "../jobs/job.model";
import {OneWordQuestionnaireDto} from "../questionnaire/questionnaire.model";
import {AppRankEnum, UserRoleEnum} from "../../../authenticated/state/authed/authed.model";

export interface UserDto {
  id: number;
  username: string;
  characterClass: CharacterClassEnum;
  role: UserRoleEnum;
  appRank: AppRankEnum;
  guild: GuildDto;
  gender: GenderEnum;
  characterLevel: number;
  level: number;
  feedClosingToGuildAndAllies: boolean;
  guildId?: number;
  guildAlliesIds?: number[];
  linkedAccounts?: UserDto[];
  hideProfile: boolean;
  jobs: JobDto[];
  questionnaire: OneWordQuestionnaireDto;
}

export enum GenderEnum {
  MALE = "M",
  FEMALE = "F",
}

export enum CharacterClassEnum {
  CRA = "Cra",
  ECAFLIP = "Ecaflip",
  ENIRIPSA = "Eniripsa",
  ENUTROF = "Enutrof",
  FECA = "Feca",
  IOP = "Iop",
  OSAMODAS = "Osamodas",
  PANDAWA = "Pandawa",
  SACRIEUR = "Sacrieur",
  SADIDA = "Sadida",
  SRAM = "Sram",
  XELOR = "Xelor",
}
