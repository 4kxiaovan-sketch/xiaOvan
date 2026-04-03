import { supabase } from '@/lib/supabase';
import type { BattleReportRow } from '@/types/supabase';

export async function listBattleReports(
  seasonId: string,
  limit = 50
): Promise<BattleReportRow[]> {
  const { data, error } = await supabase
    .from('battle_reports')
    .select('*')
    .eq('season_id', seasonId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as BattleReportRow[];
}
