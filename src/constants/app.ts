export const APP_NAME = "The English Forum";
export const APP_TAGLINE = "Nền tảng học tiếng Anh thông minh với AI";
export const APP_TAGLINE_EN = "AI-Powered English Learning Platform";

export const DEFAULT_LOCALE = "vi" as const;
export const SUPPORTED_LOCALES = ["vi", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];
