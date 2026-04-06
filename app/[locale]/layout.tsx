import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
import { CurrencyProvider } from "@/lib/contexts/CurrencyContext";
import { Cairo } from "next/font/google";
import { Manrope } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google'
import { ScrollToTopButton } from "@/components/scroll-to-top";
import OrganizationSchema from "@/components/seo/OrganizationSchema";

import "../globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await params in Next.js 16
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning>
      <body className={locale === "ar" ? cairo.className : manrope.className}>
        <NextIntlClientProvider messages={messages}>
          <CurrencyProvider>
            <OrganizationSchema />
            {children}
          </CurrencyProvider>
        </NextIntlClientProvider>
        <ScrollToTopButton />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}