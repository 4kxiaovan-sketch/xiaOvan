import { supabase } from '@/lib/supabase';
import type { ProfileRow } from '@/types/supabase';

export async function getMyProfile(): Promise<ProfileRow | null> {
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;
  if (!session?.user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error) throw error;
  return (data as ProfileRow | null) ?? null;
}
