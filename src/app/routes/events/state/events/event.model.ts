import {CharacterClassEnum, UserDto} from "../../../authenticated/state/authed/authed.model";

export interface EventDto {
  id: number;
  title: string;
  description: string;
  type: string;
  dungeonName?: string;
  arenaTargets?: string;
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
  title: string;
  description: string;
  type: string;
  dungeonName?: string;
  arenaTargets?: string;
  date: string;
  maxParticipants: number;
  minLevel?: number;
  requiredClasses?: string[];
  requiresOptimization?: boolean;
}
