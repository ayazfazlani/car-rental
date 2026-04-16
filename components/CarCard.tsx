"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useCurrency } from "@/lib/contexts/CurrencyContext";
import { Car, CarImage, Contact, ContactType } from "@prisma/client";
import Image from "next/image";
import { whatsAppMessage, getImageUrl } from "@/lib/utils";


export type TCarWithoutDecimal = Omit<Car, 'baseDailyPrice' | 'baseWeeklyPrice' | 'baseMonthlyPrice'> & { baseDailyPrice: number, baseWeeklyPrice?: number | null, baseMonthlyPrice?: number | null }
export type TCarCard = TCarWithoutDecimal & {
  brand?: { name: string };
  category?: { name: string };
  images?: CarImage[];
}

interface CarCardProps {
  car: TCarCard;
  showDetails?: boolean;
  contacts?: Contact[];
}

export function CarCard({
  car,
  showDetails = false,
  contacts,
}: CarCardProps) {
  const t = useTranslations("common");
  const { formatPrice } = useCurrency();

  // Get primary image or first image
  const primaryImage =
    car.images?.find((img) => img.isPrimary)?.url || car.images?.[0]?.url;

  const phone = contacts?.find(c => c.type === ContactType.PHONE)?.value || "971561234567";
  const whatsapp = contacts?.find(c => c.type === ContactType.WHATSAPP)?.value || "+971561234567";

  return (
    <div
      className={`bg-card rounded-xl overflow-hidden hover:shadow-lg hover:border-2 hover:border-primary border border-border transition-all duration-200`}
    >
      <Link href={car.slug ? { pathname: "/cars/[slug]", params: { slug: car.slug } } as any : "/cars"}>
        {/* Image Container */}
        <div className="relative aspect-[4/3] bg-muted">
          {primaryImage ? (
            <Image
              src={getImageUrl(primaryImage)}
              alt={car.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              unoptimized
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
          ) : null}
          {!primaryImage && (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">
                {t("noImage")}
              </span>
            </div>
          )}
        </div>
      </Link>
      {/* Content */}
      <div className="p-4">
        <Link href={car.slug ? { pathname: "/cars/[slug]", params: { slug: car.slug } } as any : "/cars"}>
          <>
            <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 text-[15px]">
              {car.name}
            </h3>

            <div className="flex items-start justify-between mt-2 gap-4">
              {/* Daily Price */}
              <div>
                <p className="text-primary font-semibold text-sm">
                  {formatPrice(car.baseDailyPrice).value}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    / {t("daily").toLowerCase()}
                  </span>
                </p>
              </div>
              {/* Monthly Price */}
              {car.baseMonthlyPrice && (
                <div className="text-right">
                  <p className="text-accent-foreground font-semibold text-sm">
                    {formatPrice(car.baseMonthlyPrice).value}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      / {t("monthly").toLowerCase()}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 mt-2 text-xs text-muted-foreground">
              <span>
                {car.seats} {t("seats")}
              </span>
              <span>{car.transmission}</span>
            </div>

            {/* Optional Details Row */}
            {showDetails && car.brand && car.category && (
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <span>{car.brand.name}</span>
                <span className="text-muted-foreground/50">•</span>
                <span>{car.category.name}</span>
              </p>
            )}
          </>
        </Link>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs h-9 text-white"
            asChild
          >
            <a href={`tel:${phone || '971561234567'}`}>
              <Phone className="h-3 w-3 mr-1.5" />
              {t("callNow")}
            </a>
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs h-9"
            asChild
          >
            <a
              href={whatsAppMessage(whatsapp || '971561234567', car)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="h-3 w-3 mr-1.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("whatsapp")}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
