import { supabase } from '@/lib/supabase';
export async function listBattleReports(seasonId, limit = 50) {
    const { data, error } = await supabase
        .from('battle_reports')
        .select('*')
        .eq('season_id', seasonId)
        .order('created_at', { ascending: false })
        .limit(limit);
    if (error)
        throw error;
    return (data ?? []);
}
