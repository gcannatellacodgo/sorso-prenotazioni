import { supabase } from "../api/lib/supabase";

export async function isLoggedIn(): Promise<boolean> {
    const { data, error } = await supabase.auth.getSession();

    if (error) return false;
    return !!data.session;
}