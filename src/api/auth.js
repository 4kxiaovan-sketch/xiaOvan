import { supabase } from '@/lib/supabase';
export async function signUp(email, password, nickname) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { nickname }
        }
    });
    if (error)
        throw error;
    return data;
}
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error)
        throw error;
    return data;
}
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error)
        throw error;
}
export async function getCurrentUser() {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError)
        throw sessionError;
    if (!session?.user)
        return null;
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error)
        throw error;
    return user;
}
