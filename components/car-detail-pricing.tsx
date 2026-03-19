"use client";

import { Check } from "lucide-react";
import { useCurrency } from "@/lib/contexts/CurrencyContext";
import Translated from "./translated";

interface CarDetailPricingProps {
  pricePerDay: number;
  pricePerMonth: number;
  pricePerWeek?: number;
  pricePerDayOriginal?: number;
  pricePerWeekOriginal?: number;
  pricePerMonthOriginal?: number;
  mileageLimit?: number;
  additionalMileage?: number;
  oneDayRental?: boolean;
  insurance?: boolean;
}

export function CarDetailPricing({
  pricePerDay,
  pricePerMonth,
  pricePerWeek,
  pricePerDayOriginal,
  pricePerWeekOriginal,
  pricePerMonthOriginal,
  mileageLimit = 250,
  additionalMileage = 10,
  oneDayRental = false,
  insurance = false,
}: CarDetailPricingProps) {
  const { currency, formatPrice } = useCurrency();

  return (
    <div className="space-y-6">
      <h2 className="text-lg sm:text-xl font-bold text-foreground">
        <Translated key="details.pricing" fallback="Pricing" withFragment />
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Daily */}
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          {pricePerDayOriginal && (
            <p className="text-xs sm:text-sm text-muted-foreground line-through">
              {formatPrice(pricePerDayOriginal).value}
            </p>
          )}
          <p className="text-xl sm:text-2xl font-bold text-primary">
            {formatPrice(pricePerDay).value}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">/ <Translated key="details.day" fallback="day" withFragment /></p>
        </div>

        {/* Weekly */}
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          {pricePerWeekOriginal && (
            <p className="text-xs sm:text-sm text-muted-foreground line-through">
              {formatPrice(pricePerWeekOriginal).value}
            </p>
          )}
          <p className="text-xl sm:text-2xl font-bold text-primary">
            {formatPrice(pricePerWeek || Math.round(pricePerDay * 6)).value}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">/ <Translated key="details.week" fallback="week" withFragment /></p>
        </div>

        {/* Monthly */}
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          {pricePerMonthOriginal && (
            <p className="text-xs sm:text-sm text-muted-foreground line-through">
              {formatPrice(pricePerMonthOriginal).value}
            </p>
          )}
          <p className="text-xl sm:text-2xl font-bold text-primary">
            {formatPrice(pricePerMonth).value}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">/ <Translated key="details.month" fallback="month" withFragment /></p>
        </div>
      </div>

      {/* Mileage Info */}
      <div className="flex items-center justify-between py-3 sm:py-4 border-t border-border">
        <span className="text-xs sm:text-sm text-muted-foreground">
          <Translated key="details.includedMileage" fallback="Included mileage limit" withFragment />
        </span>
        <span className="text-xs sm:text-sm text-foreground font-medium">
          {mileageLimit} km
        </span>
      </div>
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-border">
        <span className="text-xs sm:text-sm text-muted-foreground">
          <Translated key="details.additionalMileage" fallback="Additional mileage charge" withFragment />
        </span>
        <span className="text-xs sm:text-sm text-foreground font-medium">
          {currency} {additionalMileage} / km
        </span>
      </div>

      {(oneDayRental || insurance) && <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
        {oneDayRental && <div className="flex items-center gap-2">
          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-accent-foreground flex-shrink-0" />
          <span className="text-xs sm:text-sm text-foreground">
            <Translated key="details.1day" fallback="1 day rental available" withFragment />
          </span>
        </div>}
        {insurance && <div className="flex items-center gap-2">
          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-accent-foreground flex-shrink-0" />
          <span className="text-xs sm:text-sm text-foreground">
            <Translated key="details.insurance" fallback="Insurance included" withFragment />
          </span>
        </div>}
      </div>}
    </div>
  );
}
