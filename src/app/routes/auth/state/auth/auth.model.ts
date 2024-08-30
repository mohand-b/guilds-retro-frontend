import {CharacterClassEnum, GenderEnum} from "../../../profile/state/users/user.model";

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterMemberDto {
  username: string;
  password: string;
  characterClass: CharacterClassEnum;
  characterLevel: number;
  gender: GenderEnum;
  guildId: number;
}

export interface RegisterLeaderDto {
  username: string;
  password: string;
  characterClass: CharacterClassEnum;
  characterLevel: number;
  gender: GenderEnum;
  guildName: string;
  description?: string;
  logo?: any;
}
