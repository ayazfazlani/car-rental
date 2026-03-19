"use client";

import { Globe, DollarSign, Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { locales, currencies, localeNames, currencyNames } from "@/i18n";
import { useCurrency } from "@/lib/contexts/CurrencyContext";

interface LanguageCurrencySwitcherProps {
  className?: string;
  variant?: "default" | "compact";
}

export function LanguageCurrencySwitcher({
  className,
  variant = "default",
}: LanguageCurrencySwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations("common");
  const { currency, setCurrency, converstionDisabled } = useCurrency();

  const handleLocaleChange = (newLocale: string) => {
    // Use next-intl's router to properly handle locale switching
    if (pathname === "/") {
      router.replace("/", { locale: newLocale });
    } else if (pathname.startsWith("/cars/") && params.slug) {
      // Use the slug from params instead of extracting from pathname
      router.replace(
        { pathname: "/cars/[slug]", params: { slug: params.slug as string } },
        { locale: newLocale }
      );
    } else {
      // For other routes, redirect to home with new locale
      router.replace("/", { locale: newLocale });
    }
  };

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {/* Language Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{locale.toUpperCase()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[150px]">
            <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {locales.map((loc) => (
              <DropdownMenuItem
                key={loc}
                selected={locale === loc}
                onClick={() => handleLocaleChange(loc)}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{localeNames[loc]}</span>
                  {locale === loc && <Check className="h-4 w-4" />}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Currency Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild >
            <Button variant="outline" size="sm" className="gap-2" disabled={converstionDisabled}>
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">{currency}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[150px]">
            <DropdownMenuLabel>{t("currency")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {currencies.map((curr) => (
              <DropdownMenuItem
                key={curr}
                selected={currency === curr}
                onClick={() => converstionDisabled ? null : setCurrency(curr)}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{currencyNames[curr]}</span>
                  {currency === curr && <Check className="h-4 w-4" />}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col sm:flex-row gap-3", className)}>
      {/* Language Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full sm:w-auto justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>{t("language")}</span>
            </div>
            <span className="font-semibold">{locale.toUpperCase()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[180px]">
          <DropdownMenuLabel>{t("selectLanguage")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {locales.map((loc) => (
            <DropdownMenuItem
              key={loc}
              selected={locale === loc}
              onClick={() => handleLocaleChange(loc)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <span className="font-medium">{localeNames[loc]}</span>
                  <span className="text-xs text-muted-foreground">
                    {loc.toUpperCase()}
                  </span>
                </div>
                {locale === loc && <Check className="h-4 w-4 text-primary" />}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Currency Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full sm:w-auto justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>{t("currency")}</span>
            </div>
            <span className="font-semibold">{currency}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[180px]">
          <DropdownMenuLabel>{t("selectCurrency")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {currencies.map((curr) => (
            <DropdownMenuItem
              key={curr}
              selected={currency === curr}
              onClick={() => setCurrency(curr)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <span className="font-medium">{currencyNames[curr]}</span>
                  <span className="text-xs text-muted-foreground">{curr}</span>
                </div>
                {currency === curr && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
