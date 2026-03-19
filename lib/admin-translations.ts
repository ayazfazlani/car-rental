"use client";

import { useState, useEffect } from "react";
import enMessages from "@/messages/en.json";
import arMessages from "@/messages/ar.json";

type Locale = "en" | "ar";
type Messages = typeof enMessages;

let currentLocale: Locale = "en";
let listeners: Array<() => void> = [];

// Get current locale from localStorage or default
export function getAdminLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("adminLocale") as Locale | null;
  return saved && (saved === "en" || saved === "ar") ? saved : "en";
}

// Set locale and notify listeners
export function setAdminLocale(locale: Locale) {
  currentLocale = locale;
  localStorage.setItem("adminLocale", locale);
  listeners.forEach((listener) => listener());
  // Also trigger localechange event for other components
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("localechange"));
  }
}

// Subscribe to locale changes
export function subscribeToLocale(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

// Get messages for current locale
export function getMessages(): Messages {
  return currentLocale === "ar" ? arMessages : enMessages;
}

// Translation hook for admin panel
export function useAdminTranslation() {
  const [locale, setLocaleState] = useState<Locale>(getAdminLocale());
  const [messages, setMessages] = useState<Messages>(getMessages());

  useEffect(() => {
    const updateMessages = () => {
      const newLocale = getAdminLocale();
      setLocaleState(newLocale);
      setMessages(newLocale === "ar" ? arMessages : enMessages);
    };

    // Initial load
    updateMessages();

    // Subscribe to locale changes
    const unsubscribe = subscribeToLocale(updateMessages);

    // Listen for localechange event
    window.addEventListener("localechange", updateMessages);

    return () => {
      unsubscribe();
      window.removeEventListener("localechange", updateMessages);
    };
  }, []);

  const t = (key: string, params?: Record<string, string | number>) => {
    const keys = key.split(".");
    let value: any = messages;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    if (typeof value !== "string") {
      return key;
    }

    // Replace parameters
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };

  return { t, locale, setLocale: setAdminLocale };
}
