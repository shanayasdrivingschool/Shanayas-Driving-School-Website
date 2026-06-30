type CaptchaProvider = "turnstile" | "recaptcha";

type TurnstileApi = {
  render: (container: HTMLElement | string, params: Record<string, unknown>) => string;
  execute: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};

type RecaptchaApi = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    grecaptcha?: RecaptchaApi;
  }
}

const CAPTCHA_PROVIDER = (import.meta.env.VITE_CAPTCHA_PROVIDER ?? "").trim().toLowerCase();
const TURNSTILE_SITE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "").trim();
const RECAPTCHA_SITE_KEY = (import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? "").trim();

const RECAPTCHA_SCRIPT_ID = "recaptcha-v3-script";
const TURNSTILE_SCRIPT_ID = "turnstile-script";

const asProvider = (value: string): CaptchaProvider | null => {
  if (value === "turnstile" || value === "recaptcha") return value;
  return null;
};

const configuredProvider = asProvider(CAPTCHA_PROVIDER);

const loadScript = (id: string, src: string) =>
  new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.ready === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("captcha_script_load_failed")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.ready = "true";
      resolve();
    };
    script.onerror = () => reject(new Error("captcha_script_load_failed"));
    document.head.appendChild(script);
  });

const requestRecaptchaToken = async (action: string): Promise<string> => {
  if (!RECAPTCHA_SITE_KEY) {
    throw new Error("captcha_site_key_missing");
  }

  await loadScript(
    RECAPTCHA_SCRIPT_ID,
    `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(RECAPTCHA_SITE_KEY)}`,
  );

  if (!window.grecaptcha) {
    throw new Error("captcha_provider_unavailable");
  }

  return await new Promise<string>((resolve, reject) => {
    window.grecaptcha?.ready(async () => {
      try {
        const token = await window.grecaptcha?.execute(RECAPTCHA_SITE_KEY, { action });
        if (!token) {
          reject(new Error("captcha_token_missing"));
          return;
        }
        resolve(token);
      } catch (error) {
        reject(error instanceof Error ? error : new Error("captcha_verification_failed"));
      }
    });
  });
};

const requestTurnstileToken = async (action: string): Promise<string> => {
  if (!TURNSTILE_SITE_KEY) {
    throw new Error("captcha_site_key_missing");
  }

  await loadScript(
    TURNSTILE_SCRIPT_ID,
    "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",
  );

  const api = window.turnstile;
  if (!api) {
    throw new Error("captcha_provider_unavailable");
  }

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.bottom = "0";
  container.style.width = "1px";
  container.style.height = "1px";
  document.body.appendChild(container);

  return await new Promise<string>((resolve, reject) => {
    let widgetId = "";
    const timeout = window.setTimeout(() => {
      try {
        if (widgetId) api.remove(widgetId);
      } finally {
        container.remove();
      }
      reject(new Error("captcha_timeout"));
    }, 20_000);

    const cleanup = () => {
      window.clearTimeout(timeout);
      try {
        if (widgetId) api.remove(widgetId);
      } finally {
        container.remove();
      }
    };

    try {
      widgetId = api.render(container, {
        sitekey: TURNSTILE_SITE_KEY,
        action,
        appearance: "execute",
        execution: "execute",
        callback: (token: string) => {
          cleanup();
          if (!token) {
            reject(new Error("captcha_token_missing"));
            return;
          }
          resolve(token);
        },
        "error-callback": () => {
          cleanup();
          reject(new Error("captcha_verification_failed"));
        },
        "expired-callback": () => {
          cleanup();
          reject(new Error("captcha_token_expired"));
        },
      });

      api.execute(widgetId);
    } catch (error) {
      cleanup();
      reject(error instanceof Error ? error : new Error("captcha_verification_failed"));
    }
  });
};

export const isCaptchaEnabled = (): boolean => {
  if (!configuredProvider) return false;
  if (configuredProvider === "turnstile") return Boolean(TURNSTILE_SITE_KEY);
  return Boolean(RECAPTCHA_SITE_KEY);
};

export const getCaptchaVerification = async (action: string): Promise<{
  provider: CaptchaProvider | null;
  token: string | null;
  action: string | null;
}> => {
  if (!configuredProvider) {
    return { provider: null, token: null, action: null };
  }

  const normalizedAction = action.trim().slice(0, 64);
  if (!normalizedAction) {
    throw new Error("captcha_action_invalid");
  }

  if (configuredProvider === "recaptcha") {
    const token = await requestRecaptchaToken(normalizedAction);
    return { provider: "recaptcha", token, action: normalizedAction };
  }

  const token = await requestTurnstileToken(normalizedAction);
  return { provider: "turnstile", token, action: normalizedAction };
};
