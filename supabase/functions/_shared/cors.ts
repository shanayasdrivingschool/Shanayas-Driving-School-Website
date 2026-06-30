const LOOPBACK_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

const isLoopbackOrigin = (origin: string) => {
  try {
    const url = new URL(origin);
    return LOOPBACK_HOSTNAMES.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
};

export const readAllowedOrigins = (rawValue = Deno.env.get("ALLOWED_ORIGINS") ?? "") =>
  rawValue
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

type BuildCorsHeadersOptions = {
  allowedHeaders: string;
  allowedMethods: string;
  configuredOrigins: string[];
  origin: string | null;
};

export const buildCorsHeaders = ({
  allowedHeaders,
  allowedMethods,
  configuredOrigins,
  origin,
}: BuildCorsHeadersOptions): HeadersInit | null => {
  const baseCorsHeaders = {
    "Access-Control-Allow-Headers": allowedHeaders,
    "Access-Control-Allow-Methods": allowedMethods,
  } as const;

  if (configuredOrigins.length === 0) {
    return {
      ...baseCorsHeaders,
      "Access-Control-Allow-Origin": origin ?? "*",
      Vary: "Origin",
    };
  }

  if (!origin) {
    return {
      ...baseCorsHeaders,
      "Access-Control-Allow-Origin": configuredOrigins[0],
      Vary: "Origin",
    };
  }

  if (!configuredOrigins.includes(origin) && !isLoopbackOrigin(origin)) {
    return null;
  }

  return {
    ...baseCorsHeaders,
    "Access-Control-Allow-Origin": origin,
    Vary: "Origin",
  };
};