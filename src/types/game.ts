import type {
  ActionLogRow,
  BattleReportRow,
  CityRow,
  CityStateRow,
  FactionRow,
  ProfileRow,
  SeasonRow
} from './supabase';

export interface CharacterOption {
  key: string;
  name: string;
  era: string;
  title: string;
  description: string;
}

export interface CreateFactionPayload {
  season_id: string;
  name: string;
  ruler_character_key: string;
  capital_city_id?: string | null;
  policy?: string | null;
}

export interface CreateActionLogPayload {
  season_id: string;
  faction_id?: string | null;
  action_type: string;
  target_type?: string | null;
  target_id?: string | null;
  detail?: Record<string, unknown>;
}

export interface CityMapItem extends CityRow {
  season_id: string;
  owner_faction_id: string | null;
  troops: number;
  defense: number;
  prosperity: number;
  updated_at: string;
}

export type CurrentUserProfile = ProfileRow | null;
export type ActiveSeason = SeasonRow | null;
export type CurrentFaction = FactionRow | null;
export type BattleReportList = BattleReportRow[];
export type ActionLogList = ActionLogRow[];
export type CityList = CityRow[];
export type CityStateList = CityStateRow[];
