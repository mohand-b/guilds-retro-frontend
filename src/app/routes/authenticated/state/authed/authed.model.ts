export interface AuthedStateDto {
  user: Omit<UserDto, 'guild'> | undefined;
  guild: Pick<GuildDto, 'id' | 'name' | 'description'> | undefined;
  token: string | undefined;
}

export interface UserDto {
  id: number;
  username: string;
  characterClass: CharacterClassEnum;
  role: UserRoleEnum;
  guild: GuildDto;
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

export enum CharacterClassEnum {
  SADIDA = "Sadida",
  IOP = "Iop",
  SACRIEUR = "Sacrieur",
  ENIRIPSA = "Eniripsa",
  CRA = "Cra",
  ECAFLIP = "Ecaflip",
  ENUTROF = "Enutrof",
  FECA = "Feca",
  XELOR = "Xelor",
  PANDAWA = "Pandawa",
  SRAM = "Sram",
  OSAMODAS = "Osamodas",
}

export enum UserRoleEnum {
  LEADER = 'Meneur',
  OFFICER = 'Bras droit',
  MEMBER = 'Membre',
}
