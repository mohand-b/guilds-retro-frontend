import {UserDto} from "../../../authenticated/state/authed/authed.model";

export interface JobDto {
  id: number;
  name: JobNameType;
  level: number;
  isForgemaging: boolean;
  user: UserDto;
}

export interface AddJobDto {
  name: JobNameType;
  level: number;
  isForgemaging: boolean;
}

export enum JobNameEnum {
  ALCHEMIST = "Alchimiste",
  BAKER = "Boulanger",
  BUTCHER = "Boucher",
  FISHERMAN = "Pêcheur",
  FISHMONGER = "Poissonnier",
  FARMER = "Paysan",
  HUNTER = "Chasseur",
  JEWELER = "Bijoutier",
  LUMBERJACK = "Bûcheron",
  MINER = "Mineur",
  AXE_SMITH = "Forgeur de Haches",
  DAGGER_SMITH = "Forgeur de Dagues",
  HAMMER_SMITH = "Forgeur de Marteaux",
  SHOVEL_SMITH = "Forgeur de Pelles",
  SWORD_SMITH = "Forgeur d'Épées",
  SHIELD_SMITH = "Forgeur de Boucliers",
  BOW_CARVER = "Sculpteur d'Arcs",
  WAND_CARVER = "Sculpteur de Baguettes",
  STAFF_CARVER = "Sculpteur de Bâtons",
  TAILOR = "Tailleur",
  SHOEMAKER = "Cordonnier",
  HANDYMAN = "Bricoleur"
}

export enum MagusJobNameEnum {
  AXEMAGUS = "Forgemage de Haches",
  DAGGERMAGUS = "Forgemage de Dagues",
  HAMMERMAGUS = "Forgemage de Marteaux",
  SHOVELMAGUS = "Forgemage de Pelles",
  SWORDMAGUS = "Forgemage d'Épées",
  BOWMAGUS = "Sculptemage d'Arcs",
  WANDMAGUS = "Sculptemage de Baguettes",
  STAFFMAGUS = "Sculptemage de Bâtons",
  SHOEMAGUS = "Cordomage",
  JEWELMAGUS = "Joaillomage",
  TAILORMAGUS = "Costumage"
}

export type JobNameType = JobNameEnum | MagusJobNameEnum;
