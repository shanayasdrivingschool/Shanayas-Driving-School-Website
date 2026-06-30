import type { PublicCheckoutInvoice } from "@/lib/affiliateTypes";
import { supabase } from "@/lib/supabaseClient";

const ensureSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }

  return supabase;
};

const mapInvoice = (row: Record<string, unknown>): PublicCheckoutInvoice => ({
  id: String(row.id),
  publicToken: String(row.public_token),
  title: String(row.title),
  description: typeof row.description === "string" ? row.description : null,
  amount: Number(row.amount ?? 0),
  currency: typeof row.currency === "string" ? row.currency : "CAD",
  customerName: typeof row.customer_name === "string" ? row.customer_name : null,
  customerEmail: typeof row.customer_email === "string" ? row.customer_email : null,
  status: "open",
  expiresAt: typeof row.expires_at === "string" ? row.expires_at : null,
  createdAt: String(row.created_at),
});

export const getCheckoutInvoiceByToken = async (publicToken: string): Promise<PublicCheckoutInvoice> => {
  const client = ensureSupabase();
  const normalizedToken = publicToken.trim();

  if (!normalizedToken) {
    throw new Error("invalid_invoice_link");
  }

  const { data, error } = await client.rpc("get_checkout_invoice", {
    p_public_token: normalizedToken,
  });

  if (error) {
    throw new Error(error.message);
  }

  const row = Array.isArray(data) ? data[0] : null;
  if (!row || typeof row !== "object") {
    throw new Error("invoice_not_found");
  }

  return mapInvoice(row as Record<string, unknown>);
};

export const buildCheckoutInvoicePath = (publicToken: string) =>
  `/checkout?invoice=${encodeURIComponent(publicToken)}`;
