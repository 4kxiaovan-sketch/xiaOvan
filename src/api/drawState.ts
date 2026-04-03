import { supabase } from '@/lib/supabase';
import type { DrawState } from '@/utils/drawSimulator';

interface DrawStateRow {
  faction_id: string;
  current_date: string;
  free_draw_used: number;
  pity_s_progress: number;
  pity_sss_progress: number;
  soul: number;
  owned_character_ids: string[];
  updated_at?: string;
}

function rowToDrawState(row: DrawStateRow): DrawState {
  return {
    currentDate: row.current_date,
    freeDrawUsed: row.free_draw_used,
    pitySProgress: row.pity_s_progress,
    pitySSSProgress: row.pity_sss_progress,
    soul: row.soul,
    ownedCharacterIds: row.owned_character_ids ?? []
  };
}

function drawStateToRow(factionId: string, state: DrawState): DrawStateRow {
  return {
    faction_id: factionId,
    current_date: state.currentDate,
    free_draw_used: state.freeDrawUsed,
    pity_s_progress: state.pitySProgress,
    pity_sss_progress: state.pitySSSProgress,
    soul: state.soul,
    owned_character_ids: state.ownedCharacterIds
  };
}

export async function getFactionDrawState(factionId: string): Promise<DrawState | null> {
  const { data, error } = await supabase
    .from('faction_draw_state')
    .select('*')
    .eq('faction_id', factionId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return rowToDrawState(data as DrawStateRow);
}

export async function upsertFactionDrawState(
  factionId: string,
  state: DrawState
): Promise<DrawState> {
  const { data, error } = await supabase
    .from('faction_draw_state')
    .upsert(drawStateToRow(factionId, state), {
      onConflict: 'faction_id'
    })
    .select('*')
    .single();

  if (error) throw error;

  return rowToDrawState(data as DrawStateRow);
}
