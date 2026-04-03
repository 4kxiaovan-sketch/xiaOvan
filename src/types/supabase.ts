export type SeasonStatus = 'pending' | 'active' | 'settled';
export type TerrainType = 'plain' | 'mountain' | 'fortress';
export type DiplomacyStatus = 'neutral' | 'allied' | 'war' | 'truce';
export type BattleTactic = 'assault' | 'defend' | 'raid';

export interface ProfileRow {
  id: string;
  nickname: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SeasonRow {
  id: string;
  name: string;
  status: SeasonStatus;
  start_at: string | null;
  end_at: string | null;
  created_at: string;
}

export interface FactionRow {
  id: string;
  season_id: string;
  name: string;
  ruler_user_id: string | null;
  ruler_character_key: string;
  ruler_name: string | null;
  is_npc: boolean;
  capital_city_id: string | null;
  gold: number;
  food: number;
  population: number;
  morale: number;
  public_support: number;
  troops: number;
  policy: string | null;
  season_score: number;
  is_eliminated: boolean;
  created_at: string;
  updated_at: string;
}

export interface FactionMemberRow {
  id: string;
  season_id: string;
  faction_id: string;
  user_id: string;
  position: 'ruler' | 'domestic' | 'diplomat' | 'strategist' | 'general';
  joined_at: string;
}

export interface CityRow {
  id: string;
  code: string;
  name: string;
  terrain: TerrainType;
  x: number | null;
  y: number | null;
  neighbor_codes: string[] | null;
  created_at: string;
}

export interface CityStateRow {
  id: string;
  season_id: string;
  city_id: string;
  owner_faction_id: string | null;
  troops: number;
  defense: number;
  prosperity: number;
  updated_at: string;
}

export interface DiplomacyRelationRow {
  id: string;
  season_id: string;
  faction_a_id: string;
  faction_b_id: string;
  relation_score: number;
  status: DiplomacyStatus;
  updated_at: string;
}

export interface BattleReportRow {
  id: string;
  season_id: string;
  attacker_faction_id: string;
  defender_faction_id: string;
  from_city_id: string | null;
  target_city_id: string;
  attacker_troops: number;
  defender_troops: number;
  attacker_tactic: BattleTactic;
  defender_tactic: BattleTactic | null;
  weather: string | null;
  winner_faction_id: string | null;
  summary: string;
  created_at: string;
}

export interface ActionLogRow {
  id: string;
  season_id: string;
  user_id: string | null;
  faction_id: string | null;
  action_type: string;
  target_type: string | null;
  target_id: string | null;
  detail: Record<string, unknown>;
  created_at: string;
}
