import AppProviders from "@/provider/Providers";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner"
import { NuqsAdapter } from 'nuqs/adapters/next/app'
// import { Manrope } from "next/font/google";
// import { Analytics } from "@vercel/analytics/next";
// import "./globals.css";

// const manrope = Manrope({
//   subsets: ['latin'],
// })
export const metadata: Metadata = {
  title: "Luxus Car Rental - Premium Car Rentals in Dubai & UAE",
  description:
    "Premium car rental services in Dubai and across the UAE. Experience luxury with our fleet of prestigious vehicles.",
  icons: {
    // icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚗</text></svg>",
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚘</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      <NuqsAdapter>
        {children}
      </NuqsAdapter>
      <Toaster />
    </AppProviders>
  )
}
