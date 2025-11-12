import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = "https://cuqwvcwkcbgmgkuszgkj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1cXd2Y3drY2JnbWdrdXN6Z2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MjE4MzUsImV4cCI6MjA3Mjk5NzgzNX0.qX-qd73p0XPh5a_N3up2hvkDUAUsW-zF-2i53Bf4gAM";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
