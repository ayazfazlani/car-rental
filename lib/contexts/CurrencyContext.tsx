"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Currency } from "@/i18n";
import { API } from "../api";

interface CurrencyContextType {
  currency: Currency;
  converstionDisabled: boolean
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => { value: string, type: Currency };
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

type TExchangeRates = Record<string, number>
type TExchangeRatesAPI = {
  date: string,
  aed: TExchangeRates
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [converstionDisabled, setConversionDisabled] = useState(true)
  const [rates, setRate] = useState<Record<string, number>>()
  const [locale, setLocale] = useState<"en" | "ar">("en");
  const [currency, setCurrencyState] = useState<Currency>("AED");

  useEffect(() => {
    fetchConversionRates();
  }, []);

  const fetchConversionRates = async () => {
    const res = await API.get<TExchangeRatesAPI>({
      url: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/aed.json',
      auth: false,
    })
    if (res.success) {
      setRate(res.data.aed)
      setConversionDisabled(false)
    } else {
      setRate(undefined)
      setConversionDisabled(true)
      setCurrency('AED')
    }
  }

  useEffect(() => {
    // Function to update locale
    const updateLocale = () => {
      // Check if we're in admin panel (no next-intl context)
      const adminLocale = localStorage.getItem("adminLocale") as
        | "en"
        | "ar"
        | null;
      if (adminLocale && (adminLocale === "en" || adminLocale === "ar")) {
        setLocale(adminLocale);
      } else {
        // Try to get from document lang attribute (works for main app with next-intl)
        const docLang = document.documentElement.lang;
        if (docLang === "ar" || docLang === "en") {
          setLocale(docLang as "en" | "ar");
        }
      }
    };

    // Initial load
    updateLocale();

    // Listen for locale changes (from admin panel)
    window.addEventListener("localechange", updateLocale);

    return () => {
      window.removeEventListener("localechange", updateLocale);
    };
  }, []);

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency") as Currency | null;
    if (savedCurrency && ["USD", "AED"].includes(savedCurrency)) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("currency", newCurrency);
    // Trigger a re-render of components using currency
    window.dispatchEvent(new Event("currencychange"));
  };

  const convertPrice = (
    price: number,
  ) => {
    if (currency === 'AED') return price

    if (converstionDisabled) return null

    if (currency === 'USD') {
      const rate = rates?.['usd']
      if (!rate) return null
      return price * rate
    }
  };

  const formatPrice = (
    price: number
  ) => {
    const numberLocale = locale === "ar" ? "ar-AE" : "en-US";
    const convertedPrice = convertPrice(price);
    if (!convertedPrice) {
      const formated = new Intl.NumberFormat(numberLocale, {
        style: 'currency',
        currency: "AED",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price)

      return {
        value: formated,
        type: "AED" as Currency
      }
    }

    const formated = new Intl.NumberFormat(numberLocale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(convertedPrice)

    return {
      value: formated,
      type: currency
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        converstionDisabled
      }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}
