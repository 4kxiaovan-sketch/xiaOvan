import { supabase } from '@/lib/supabase';
import type { CreateActionLogPayload } from '@/types/game';
import type { ActionLogRow } from '@/types/supabase';

export async function createActionLog(
  payload: CreateActionLogPayload
): Promise<ActionLogRow> {
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;

  const { data, error } = await supabase
    .from('action_logs')
    .insert({
      season_id: payload.season_id,
      user_id: session?.user?.id ?? null,
      faction_id: payload.faction_id ?? null,
      action_type: payload.action_type,
      target_type: payload.target_type ?? null,
      target_id: payload.target_id ?? null,
      detail: payload.detail ?? {}
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as ActionLogRow;
}

export async function listActionLogs(
  seasonId: string,
  factionId?: string
): Promise<ActionLogRow[]> {
  let query = supabase
    .from('action_logs')
    .select('*')
    .eq('season_id', seasonId)
    .order('created_at', { ascending: false });

  if (factionId) {
    query = query.eq('faction_id', factionId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data ?? []) as ActionLogRow[];
}
