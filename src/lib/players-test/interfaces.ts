export type TeamNamingV3 = "captain" | "number" | "animal" | "europeClub";

export type PlayerLevelV1 = "unknown" | "notbad" | "normal" | "good" | "star";

export type MatchResultV1 = [number, number, number, number];

export interface PlayerV1 {
  name: string;
  level?: PlayerLevelV1;
}

export interface TeamV3 {
  id: number;
  name: string;
  players: PlayerV1[];
  captain: string;
}

export interface PlayerDataV3 {
  time: string;
  duration: string;
  brake: string;
  date: string;
  vectorTeamIds: number[];
  togetherGroups: string[][];
  matchResults: MatchResultV1[];
  useColor: boolean;
  showLevel: boolean;
  naming: TeamNamingV3;
  teams: TeamV3[];
}
