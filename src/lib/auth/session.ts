import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type CurrentMember = {
  id: string;
  fullName: string;
  role: "LEARNER" | "ADMIN";
};

/**
 * The signed-in member and profile for this request, or null. Cached per request so the
 * header and a page gate share one lookup. Reads cookies, so call it inside <Suspense>.
 */
export const getCurrentMember = cache(async (): Promise<CurrentMember | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return null;

  // RLS limits this to the caller's own profile (profiles_select_own).
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", userId)
    .maybeSingle();
  if (!profile) return null;

  return { id: userId, fullName: profile.full_name, role: profile.role };
});
