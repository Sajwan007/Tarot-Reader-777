/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly NEXT_PUBLIC_RAZORPAY_KEY_ID: string;
  readonly SENDGRID_API_KEY: string;
  readonly EMAIL_FROM: string;
  readonly NODE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
