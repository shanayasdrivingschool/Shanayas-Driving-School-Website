import type { SupabaseClient } from "@supabase/supabase-js";
import { ensureSupabaseClient, isAdminUser, requireSessionUser } from "@/lib/adminAccess";

const SEO_CHECK_TTL_MS = 5 * 60_000;
let cachedSeoCheck: { userId: string; checkedAt: number; result: Promise<boolean> } | null = null;

export const isSeoUser = (client: SupabaseClient, userId: string) => {
  if (cachedSeoCheck?.userId === userId && Date.now() - cachedSeoCheck.checkedAt < SEO_CHECK_TTL_MS) {
    return cachedSeoCheck.result;
  }

  const result = (async () => {
    const { data, error } = await client
      .from("seo_users")
      .select("user_id")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();
    if (error) throw error;
    return Boolean(data);
  })();

  void result.catch(() => {
    if (cachedSeoCheck?.result === result) cachedSeoCheck = null;
  });

  cachedSeoCheck = { userId, checkedAt: Date.now(), result };
  return result;
};

export const clearSeoAccessCache = () => {
  cachedSeoCheck = null;
};

export const hasSeoPortalAccess = async (client: SupabaseClient, userId: string) => {
  const [adminAccess, seoAccess] = await Promise.all([
    isAdminUser(client, userId),
    isSeoUser(client, userId),
  ]);
  return adminAccess || seoAccess;
};

export const requireBlogEditorUser = async () => {
  const client = ensureSupabaseClient();
  const user = await requireSessionUser(client);
  if (!(await hasSeoPortalAccess(client, user.id))) {
    throw new Error("This account does not have SEO portal access.");
  }
  return { client, user };
};
