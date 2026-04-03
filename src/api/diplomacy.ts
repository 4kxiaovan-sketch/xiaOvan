import { supabase } from '@/lib/supabase';
import type { DiplomacyRelationRow } from '@/types/supabase';

export async function listDiplomacyRelations(
  seasonId: string
): Promise<DiplomacyRelationRow[]> {
  const { data, error } = await supabase
    .from('diplomacy_relations')
    .select('*')
    .eq('season_id', seasonId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as DiplomacyRelationRow[];
}
