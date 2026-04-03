import { supabase } from '@/lib/supabase';
import { createActionLog } from './log';
export async function listFactions(seasonId) {
    const { data, error } = await supabase
        .from('factions')
        .select('*')
        .eq('season_id', seasonId)
        .order('created_at', { ascending: true });
    if (error)
        throw error;
    return (data ?? []);
}
export async function getMyRuledFaction(seasonId) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError)
        throw sessionError;
    if (!session?.user)
        return null;
    const { data, error } = await supabase
        .from('factions')
        .select('*')
        .eq('season_id', seasonId)
        .eq('ruler_user_id', session.user.id)
        .maybeSingle();
    if (error)
        throw error;
    return data ?? null;
}
export async function createFaction(payload) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError)
        throw sessionError;
    if (!session?.user)
        throw new Error('User is not authenticated.');
    const insertPayload = {
        season_id: payload.season_id,
        name: payload.name,
        ruler_user_id: session.user.id,
        ruler_character_key: payload.ruler_character_key,
        capital_city_id: payload.capital_city_id ?? null,
        policy: payload.policy ?? null,
        is_npc: false
    };
    const { data, error } = await supabase
        .from('factions')
        .insert(insertPayload)
        .select('*')
        .single();
    if (error)
        throw error;
    const faction = data;
    await createActionLog({
        season_id: payload.season_id,
        faction_id: faction.id,
        action_type: 'create_faction',
        target_type: 'faction',
        target_id: faction.id,
        detail: {
            factionName: faction.name,
            rulerCharacterKey: faction.ruler_character_key
        }
    });
    return faction;
}
