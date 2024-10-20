import {CharacterClassEnum, UserDto} from "../../../profile/state/users/user.model";

export interface EventDto {
  id: number;
  type: string;
  title?: string;
  dungeonName?: string;
  arenaTargets?: string;
  description: string;
  date: string;
  maxParticipants: number;
  minLevel?: number;
  requiredClasses?: CharacterClassEnum[];
  requiresOptimization?: boolean;
  isAccessibleToAllies: boolean;
  creator: UserDto;
  participants: UserDto[];
  createdAt: string;
}

export interface CreateEventDto {
  type: string;
  title?: string;
  dungeonName?: string;
  arenaTargets?: string;
  description: string;
  isAccessibleToAllies?: boolean;
  date: string;
  maxParticipants: number;
  minLevel?: number;
  requiredClasses?: string[];
  requiresOptimization?: boolean;
}

export enum EventTypesEnum {
  DUNGEON = 'DUNGEON',
  ARENA = 'ARENA',
  OTHER = 'OTHER'
}
