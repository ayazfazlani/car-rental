"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/lib/contexts/CurrencyContext";

interface CarFilterProps {
  brands: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  brandId?: string;
  categoryId?: string;
  transmission?: string;
  driverOption?: string;
  priceRange: [number, number];
}

export function CarFilter({
  brands,
  categories,
  onFilterChange,
}: CarFilterProps) {
  const t = useTranslations("common");
  const { currency, formatPrice } = useCurrency();
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000],
  });

  useEffect(() => {
    onFilterChange(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      return newFilters;
    });
  };

  const hasActiveFilters =
    filters.brandId ||
    filters.categoryId ||
    filters.transmission ||
    filters.driverOption ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 5000;

  const resetFilters = () => {
    const resetFilters: FilterState = {
      priceRange: [0, 5000],
    };
    setFilters(resetFilters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("filterCars")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t("brand")}</Label>
          <Select value={filters.brandId || ""} onValueChange={(v) => handleFilterChange("brandId", v)}>
            <SelectTrigger>
              <SelectValue placeholder={t("allBrands")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {(brands || [])?.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("carType")}</Label>
          <Select value={filters.categoryId || ""} onValueChange={(v) => handleFilterChange("categoryId", v)}>
            <SelectTrigger>
              <SelectValue placeholder={t("allTypes")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {(categories || [])?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("transmission")}</Label>
          <Select value={filters.transmission || ""} onValueChange={(v) => handleFilterChange("transmission", v)}>
            <SelectTrigger>
              <SelectValue placeholder={t("all")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="AUTOMATIC">{t("automatic")}</SelectItem>
                <SelectItem value="MANUAL">{t("manual")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("driverOption")}</Label>
          <Select value={filters.driverOption || ""} onValueChange={(v) => handleFilterChange("driverOption", v)}>
            <SelectTrigger>
              <SelectValue placeholder={t("all")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="self-drive">{t("selfDrive")}</SelectItem>
                <SelectItem value="with-driver">{t("withDriver")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("dailyPriceRange")}</Label>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatPrice(filters.priceRange[0]).value}</span>
              <span>{formatPrice(filters.priceRange[1]).value}+</span>
            </div>
            <Slider
              min={0}
              max={5000}
              step={100}
              value={filters.priceRange}
              onValueChange={(value) => handleFilterChange("priceRange", value)}
            />
          </div>
        </div>

        <Button
          variant={hasActiveFilters ? "default" : "outline"}
          onClick={resetFilters}
          className="w-full"
          disabled={!hasActiveFilters}>
          {hasActiveFilters ? t("resetFilters") : t("noFiltersApplied")}
        </Button>
      </CardContent>
    </Card>
  );
}
