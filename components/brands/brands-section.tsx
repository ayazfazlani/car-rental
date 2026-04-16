"use client";

import { useRef, use } from "react";
import { CarFrontIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { CarBrand } from "@prisma/client";
import { Link } from "@/i18n/routing";

export function BrandsCardSection({ brands: brandsPromise }: { brands: Promise<(CarBrand & { _count?: { cars: number } })[]> }) {
  const t = useTranslations();
  const brands = use(brandsPromise)
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const getBrandLogo = (brand: CarBrand) => {
    if (brand.logoUrl) {
      return (
        <img
          src={brand.logoUrl}
          alt={brand.name}
          className="h-12 w-auto object-contain"
        />
      );
    }

    return <CarFrontIcon />
  };

  if (brands.length === 0) {
    return <></>
  }

  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl lg:text-[28px] font-bold text-foreground">
            {t("brands.title") || "All Brands"}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("brands.description") ||
              "Explore cars from trusted global brands."}
          </p>
        </div>

        {/* Brands Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-muted/80 backdrop-blur rounded-full h-10 w-10 shadow-sm hidden lg:flex"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </Button>

          {/* Brand Cards */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {brands.map((brand) => (
              <Link
                href={brand.slug ? { pathname: "/brands/[slug]", params: { slug: brand.slug } } as any : "/brands"}
                key={brand.id}
                className="flex-shrink-0 flex flex-col items-center justify-center py-8 px-10 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors min-w-[160px] cursor-pointer"
              >
                <div className="text-foreground mb-3">
                  {getBrandLogo(brand)}
                </div>
                <h3 className="font-semibold text-foreground text-base">
                  {brand.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {brand._count?.cars || 0} {t("brands.carsLabel") || "CARS"}
                </p>
              </Link>
            ))}
          </div>

          {/* Right Arrow */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-primary text-primary-foreground rounded-full h-10 w-10 shadow-sm hidden lg:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
