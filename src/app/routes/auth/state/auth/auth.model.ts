import {CharacterClassEnum, GenderEnum} from "../../../authenticated/state/authed/authed.model";

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
