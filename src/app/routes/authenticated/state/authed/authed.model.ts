export interface AuthedStateDto {
  user: UserDto | undefined;
  token: string | undefined;
}

export interface UserDto {
  id: number;
  username: string;
  characterClass: CharacterClassEnum;
  role: UserRoleEnum;
  guild: GuildDto;
  gender: GenderEnum;
  level: number;
  feedClosingToGuildAndAllies: boolean;
  guildId?: number;
  guildAlliesIds?: number[];
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

export interface GuildDto {
  id: number;
  name: string;
  description: string;
  members: UserDto[];
  allianceRequests: AllianceDto[];
  receivedRequests: AllianceDto[];
  allies: GuildDto[];
}

export interface AllianceDto {
  id: number;
  requesterGuild: GuildDto;
  targetGuild: GuildDto;
  status: string;
}
