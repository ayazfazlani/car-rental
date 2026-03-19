import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "../globals.css";
import AdminLayoutClient from "./layout-client";
import { CurrencyProvider } from "@/lib/contexts/CurrencyContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin Panel - Luxus Car Rental",
  description: "Admin panel for managing Luxus Car Rental",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚗</text></svg>",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cairo.variable} ${inter.className}`}>
        <CurrencyProvider>
          <AdminLayoutClient>{children}</AdminLayoutClient>
        </CurrencyProvider>
      </body>
    </html>
  );
}
