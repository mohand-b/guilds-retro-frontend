import {GuildDto} from "../../../guild/state/guilds/guild.model";
import {MembershipRequestDto} from "../../../guild/state/membership-requests/membership-request.model";
import {JobDto} from "../../../profile/state/jobs/job.model";
import {OneWordQuestionnaireDto} from "../../../profile/state/questionnaire/questionnaire.model";

export interface AuthedStateDto {
  user: UserDto | undefined;
  token: string | undefined;
  requests: MembershipRequestDto[];
}

export interface UserDto {
  id: number;
  username: string;
  characterClass: CharacterClassEnum;
  role: UserRoleEnum;
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

export enum UserRoleEnum {
  LEADER = 'Meneur',
  OFFICER = 'Bras droit',
  MEMBER = 'Membre',
  CANDIDATE = 'Candidat',
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

