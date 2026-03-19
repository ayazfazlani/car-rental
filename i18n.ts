export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const currencies = ["USD", "AED"] as const;
export type Currency = (typeof currencies)[number];

export const defaultLocale: Locale = "en";
export const defaultCurrency: Currency = "AED";

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export const currencyNames: Record<Currency, string> = {
  USD: "US Dollar",
  AED: "UAE Dirham",
};
