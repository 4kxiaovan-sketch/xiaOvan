import { supabase } from '@/lib/supabase';
export async function getMyProfile() {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError)
        throw sessionError;
    if (!session?.user)
        return null;
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
    if (error)
        throw error;
    return data ?? null;
}
