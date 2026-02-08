// utils/supabaseServer.js
"server only"
import { createClient } from "@supabase/supabase-js";

export const getSupabasePlus = async () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE; // Matched .env.local

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error("Supabase env vars are missing! Make sure .env.local is loaded.");
    }

    return createClient(supabaseUrl, supabaseServiceRoleKey);
}
