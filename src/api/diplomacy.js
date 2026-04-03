import { supabase } from '@/lib/supabase';
export async function listDiplomacyRelations(seasonId) {
    const { data, error } = await supabase
        .from('diplomacy_relations')
        .select('*')
        .eq('season_id', seasonId)
        .order('updated_at', { ascending: false });
    if (error)
        throw error;
    return (data ?? []);
}
