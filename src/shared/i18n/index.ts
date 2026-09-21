import en from "./langs/en";
import pt from "./langs/pt";

type Dictionary = Record<string, string>;

export type langs = "en" | "pt";

type translation = Record<langs, Dictionary>;

const translations = {
  en,
  pt,
} satisfies translation;

export type TranslationKey = keyof typeof en;

export function t(key: TranslationKey, lang: "en" | "pt"): string {
  const dictionary = translations[lang] || translations.en;
  return dictionary[key] || translations.en[key] || key;
}

export default translations;
