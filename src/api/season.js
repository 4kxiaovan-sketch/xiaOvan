import { supabase } from '@/lib/supabase';
export async function getActiveSeason() {
    const { data, error } = await supabase
        .from('seasons')
        .select('*')
        .eq('status', 'active')
        .order('start_at', { ascending: false })
        .limit(1)
        .maybeSingle();
    if (error)
        throw error;
    return data ?? null;
}
