/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_CAPTCHA_PROVIDER?: "turnstile" | "recaptcha";
  readonly VITE_TURNSTILE_SITE_KEY?: string;
  readonly VITE_RECAPTCHA_SITE_KEY?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_META_PIXEL_ID?: string;
  readonly VITE_X_PROFILE_URL?: string;
  readonly VITE_LINKEDIN_PROFILE_URL?: string;
  readonly VITE_YOUTUBE_CHANNEL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
