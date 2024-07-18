import {CharacterClassEnum, UserDto} from "../../../authenticated/state/authed/authed.model";

export interface EventDto {
  id: number;
  type: string;
  title?: string;
  dungeonName?: string;
  arenaTargets?: string;
  description: string;
  date: Date;
  maxParticipants: number;
  minLevel?: number;
  requiredClasses?: CharacterClassEnum[];
  requiresOptimization?: boolean;
  creator: UserDto;
  participants: UserDto[];
  createdAt: Date;
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
