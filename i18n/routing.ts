import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { defaultLocale } from "@/i18n";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "ar"],

  // Used when no locale matches
  defaultLocale: defaultLocale,
  localeDetection: true,

  // The `pathnames` object holds pairs of internal and
  // external pathnames. Based on the locale, the
  // external pathnames are rewritten while the internal
  // ones always stay the same.
  pathnames: {
    "/": "/",
    "/cars/[slug]": {
      en: "/cars/[slug]",
      ar: "/cars/[slug]",
    },
    "/cars": {
      en: "/cars",
      ar: "/cars",
    },
    "/company/about": {
      en: "/company/about",
      ar: "/company/about",
    },
    "/company/contact": {
      en: "/company/contact",
      ar: "/company/contact",
    },
    "/contact": {
      en: "/contact",
      ar: "/contact",
    },
    "/blog/[slug]": {
      en: "/blog/[slug]",
      ar: "/blog/[slug]",
    },
    "/blog": {
      en: "/blog",
      ar: "/blog",
    },
    "/brands/[slug]": {
      en: "/brands/[slug]",
      ar: "/brands/[slug]",
    },
    "/categories/[slug]": {
      en: "/categories/[slug]",
      ar: "/categories/[slug]",
    },
  },
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

