"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Tag,
  FolderTree,
  LogOut,
  Menu,
  X,
  Globe,
  DollarSign,
  Check,
  Home,
  Lock,
  Settings,
  Newspaper,
  Users,
  SearchCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AdminAuthGuard } from "./AdminAuthGuard";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { locales, currencies, localeNames, currencyNames } from "@/i18n";
import { useCurrency } from "@/lib/contexts/CurrencyContext";
import { useAdminTranslation, setAdminLocale } from "@/lib/admin-translations";
import { API } from "@/lib/api";
import { useIsSuperAdmin } from "@/hooks/useIsSuperAdmin";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSuperAdmin = useIsSuperAdmin()
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { currency, setCurrency } = useCurrency();
  const { t, locale, setLocale } = useAdminTranslation();

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem("adminLocale") as
      | "en"
      | "ar"
      | null;
    if (savedLocale && (savedLocale === "en" || savedLocale === "ar")) {
      setLocale(savedLocale);
      // Update HTML dir attribute for RTL support
      document.documentElement.dir = savedLocale === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = savedLocale;
      // Update body font class
      if (savedLocale === "ar") {
        document.body.classList.add("font-cairo");
        document.body.classList.remove("font-inter");
      } else {
        document.body.classList.add("font-inter");
        document.body.classList.remove("font-cairo");
      }
    }
  }, []);

  useEffect(() => {
    checkAuthToken()
  }, [])

  const handleLocaleChange = (newLocale: "en" | "ar") => {
    setAdminLocale(newLocale);
    setLocale(newLocale);
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLocale;
    // Update body font class
    if (newLocale === "ar") {
      document.body.classList.add("font-cairo");
      document.body.classList.remove("font-inter");
    } else {
      document.body.classList.add("font-inter");
      document.body.classList.remove("font-cairo");
    }
    // Trigger a re-render
    window.dispatchEvent(new Event("localechange"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  const navItems = useMemo(() => {
    const navItems = [
      { href: "/admin", label: t("admin.dashboard"), icon: LayoutDashboard },
      { href: "/admin/cars", label: t("admin.cars"), icon: Car },
      { href: "/admin/brands", label: t("admin.brands"), icon: Tag },
      {
        href: "/admin/categories",
        label: t("admin.categories"),
        icon: FolderTree,
      },
      { href: "/admin/home-hero", label: t("admin.homeHero.title"), icon: Home },
      { href: "/admin/home-sections", label: t("admin.homeSections"), icon: LayoutDashboard },
      { href: "/admin/blog", label: t("admin.blog.title"), icon: Newspaper },
      { href: "/admin/settings", label: t("admin.settings.title") || "Settings", icon: Settings },
      { href: "/admin/faq", label: t("admin.faqTitle") || "FAQ", icon: Tag }, { href: "/admin/contacts", label: t("admin.contact.name"), icon: Globe },
      { href: "/admin/metadata", label: t("admin.metaData.title"), icon: SearchCheck },
      { href: "/admin/change-password", label: t("admin.changePassword"), icon: Lock },
    ];

    if (isSuperAdmin) {
      const hasUser = navItems.find(item => item.href === '/admin/users')
      if (!hasUser)
        navItems.push({ href: "/admin/users", label: t("admin.users.title"), icon: Users })
    }

    return navItems;
  }, [isSuperAdmin])

  const checkAuthToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
    }
    const res = await API.get({
      url: "/api/auth/me",
      auth: true,
    })
    if (res.logout) {
      localStorage.removeItem("token");
      router.push("/admin/login");
    }
  }

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-background">
        {/* Mobile Header */}
        <div className="lg:hidden border-b bg-card">
          <div className="flex items-center justify-between p-4">
            <Link href="/admin" className="text-xl font-bold">
              Luxus Admin
            </Link>
            <div className="flex items-center gap-2">
              {/* Language & Currency Switcher for Mobile */}
              <div className="flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Globe className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t("admin.language")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {locales.map((loc) => (
                      <DropdownMenuItem
                        key={loc}
                        selected={locale === loc}
                        onClick={() => handleLocaleChange(loc as "en" | "ar")}>
                        <div className="flex items-center justify-between w-full">
                          <span>{localeNames[loc]}</span>
                          {locale === loc && <Check className="h-4 w-4" />}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <DollarSign className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t("admin.currency")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {currencies.map((curr) => (
                      <DropdownMenuItem
                        key={curr}
                        selected={currency === curr}
                        onClick={() => setCurrency(curr)}>
                        <div className="flex items-center justify-between w-full">
                          <span>{currencyNames[curr]}</span>
                          {currency === curr && <Check className="h-4 w-4" />}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <aside
            className={cn(
              "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0",
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
            <div className="flex flex-col h-screen sticky top-0">
              <div className="p-6 border-b">
                <Link href="/admin" className="text-xl font-bold">
                  Luxus Admin
                </Link>
                {/* Language & Currency Switcher */}
                <div className="mt-4 flex flex-col gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <span className="text-sm">{t("admin.language")}</span>
                        </div>
                        <span className="text-xs font-semibold">
                          {locale.toUpperCase()}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="min-w-[150px]">
                      <DropdownMenuLabel>
                        {t("admin.selectLanguage")}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {locales.map((loc) => (
                        <DropdownMenuItem
                          key={loc}
                          selected={locale === loc}
                          onClick={() =>
                            handleLocaleChange(loc as "en" | "ar")
                          }>
                          <div className="flex items-center justify-between w-full">
                            <span>{localeNames[loc]}</span>
                            {locale === loc && <Check className="h-4 w-4" />}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-sm">{t("admin.currency")}</span>
                        </div>
                        <span className="text-xs font-semibold">
                          {currency}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="min-w-[150px]">
                      <DropdownMenuLabel>
                        {t("admin.selectCurrency")}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {currencies.map((curr) => (
                        <DropdownMenuItem
                          key={curr}
                          selected={currency === curr}
                          onClick={() => setCurrency(curr)}>
                          <div className="flex items-center justify-between w-full">
                            <span>{currencyNames[curr]}</span>
                            {currency === curr && <Check className="h-4 w-4" />}
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <nav className="flex-1 p-4 space-y-2 overflow-scroll">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      )}>
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleLogout}>
                  <LogOut className="h-5 w-5 mr-3" />
                  {t("admin.logout")}
                </Button>
              </div>
            </div>
          </aside>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 lg:ml-0">
            <div className="p-6">{children}</div>
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
