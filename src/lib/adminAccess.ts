import { isSupabaseConfigured, supabase, supabaseAnonKey, supabaseUrl } from "@/lib/supabaseClient";

type SupabaseClient = NonNullable<typeof supabase>;

export const ensureSupabaseClient = () => {
  if (!supabase || !isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }

  return supabase;
};

/* getSession() reads the stored session locally and only spends a round trip when the
   access token has actually expired, where getUser() always calls GET /auth/v1/user.
   The admin panel used to call getUser() three times during a single sign-in and twice
   more on every page navigation. Nothing is weakened by the swap: every admin table is
   RLS-protected, so this check only decides which UI to render -- a forged or stale
   session is still rejected by the database. */
export const getSessionUser = async (client: SupabaseClient) => {
  const {
    data: { session },
    error,
  } = await client.auth.getSession();

  if (error) {
    throw error;
  }

  return session?.user ?? null;
};

export const requireSessionUser = async (client: SupabaseClient) => {
  const user = await getSessionUser(client);

  if (!user) {
    throw new Error("You must be signed in to continue.");
  }

  return user;
};

/* The admin_users lookup is verified once per signed-in user and shared from here.
   requireAdminUser() runs ahead of all 17 admin API calls, so without this cache every
   dashboard, table and mutation re-read the same row before doing any real work. The
   promise is cached rather than the result so concurrent callers -- the route guard and
   the page query it unblocks -- collapse into one request instead of racing. */
let cachedAdminCheck: { userId: string; result: Promise<boolean> } | null = null;

export const isAdminUser = (client: SupabaseClient, userId: string) => {
  if (cachedAdminCheck?.userId === userId) {
    return cachedAdminCheck.result;
  }

  const result = (async () => {
    const { data, error } = await client
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userId)
      .eq("status", "active")
      .maybeSingle();

    if (error) {
      throw error;
    }

    return Boolean(data);
  })();

  /* A lookup that failed on a network blip must not become the cached answer. */
  void result.catch(() => {
    if (cachedAdminCheck?.result === result) {
      cachedAdminCheck = null;
    }
  });

  cachedAdminCheck = { userId, result };
  return result;
};

/* Called on sign-out. The cache is keyed by user id, so a different account can never
   read another account's answer; this covers the case where the same account signs back
   in after its admin access was changed. */
export const clearAdminAccessCache = () => {
  cachedAdminCheck = null;
};

export const requireAdminUser = async () => {
  const client = ensureSupabaseClient();
  const user = await requireSessionUser(client);

  if (!(await isAdminUser(client, user.id))) {
    throw new Error("This account does not have admin access.");
  }

  return { client, user };
};
