
import Image from "next/image";
import Logo from "@/public/images/luxuslogo.png";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LanguageCurrencySwitcher } from "@/components/LanguageCurrencySwitcher";
import HomeBrands from "./brands/brands";
import Category from "./header/category";
import { MobileNav } from "./header/MobileNav";
import { getBrands } from "@/lib/data/brands";
import { getCategory } from "@/lib/data/category";

export function Header() {
    const t = useTranslations();
    const brandsPromise = getBrands();
    const categoriesPromise = getCategory();
    
    return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border backdrop-blur supports-[backdrop-filter]:bg-card/95">
      <div className=" mx-auto w-full max-w-[1200px]  px-2 lg:px-0  ">

        <div className="flex h-[50px] md:h-[82px]  items-center justify-between">
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-2">
            <MobileNav brandsPromise={brandsPromise} categoriesPromise={categoriesPromise} />
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={Logo}
                alt="Lux Car Rental"
                width={120}
                height={40}
                className=" w-auto h-8 md:h-10"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              {t("common.rentACar")}
            </Link>
            <HomeBrands view="header" />
            <Category />
            <Link
              // @ts-expect-error query not in type
              href="/cars?hasChauffeur=true"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {t("common.carWithDriver")}
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {t("admin.blog.title")}
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <LanguageCurrencySwitcher variant="compact" />
          </div>
        </div>
      </div>
    </header>
  );
}
