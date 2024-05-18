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
