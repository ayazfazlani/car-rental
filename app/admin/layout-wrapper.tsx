import { Inter } from "next/font/google";
import "../globals.css";
import AdminLayoutClient from "./layout-client";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={inter.className}>
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </body>
    </html>
  );
}
