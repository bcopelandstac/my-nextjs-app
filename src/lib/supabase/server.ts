import { createClient } from "@supabase/supabase-js";

// Server client — uses service_role key, bypasses RLS
// Only use in server actions / API routes for admin tasks
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
