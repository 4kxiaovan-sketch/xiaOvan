import { supabase } from '@/lib/supabase';
import type { SeasonRow } from '@/types/supabase';

export async function getActiveSeason(): Promise<SeasonRow | null> {
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .eq('status', 'active')
    .order('start_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data as SeasonRow | null) ?? null;
}
