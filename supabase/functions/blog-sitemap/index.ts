import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_ORIGIN = "https://www.shanayasdrivingschool.com";

const escapeXml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

Deno.serve(async (request) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }

  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !key) return new Response("Sitemap unavailable", { status: 503 });

  const client = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await client
    .from("public_blog_posts")
    .select("slug,snapshot,published_at,updated_at")
    .order("published_at", { ascending: false });

  if (error) return new Response("Sitemap unavailable", { status: 503 });

  const urls = (data ?? []).flatMap((row) => {
    const snapshot = row.snapshot as Record<string, unknown>;
    const robots = typeof snapshot.robots === "string" ? snapshot.robots : "index, follow";
    const canonical = typeof snapshot.canonicalPath === "string" ? snapshot.canonicalPath : `/blog/${row.slug}/`;
    const ownPath = `/blog/${row.slug}/`;
    const canonicalUrl = new URL(canonical, SITE_ORIGIN).toString();
    const ownUrl = new URL(ownPath, SITE_ORIGIN).toString();
    if (robots.includes("noindex") || canonicalUrl !== ownUrl) return [];
    const lastModified = new Date(String(snapshot.dateModified ?? row.updated_at)).toISOString().slice(0, 10);
    return [
      "  <url>",
      `    <loc>${escapeXml(`${SITE_ORIGIN}${ownPath}`)}</loc>`,
      `    <lastmod>${lastModified}</lastmod>`,
      "    <changefreq>monthly</changefreq>",
      "    <priority>0.7</priority>",
      "  </url>",
    ].join("\n");
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(request.method === "HEAD" ? null : xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
});
