import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getImageUrl } from "@/lib/utils";
import { Phone, MapPin, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DealerCardProps {
  dealer: {
    name: string;
    logoUrl?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    location?: string | null;
    hours?: string | null;
    note?: string | null;
  };
}

export function DealerCard({ dealer }: DealerCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-6 lg:sticky lg:top-24">
      <h3 className="text-center text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
        {dealer.name}
      </h3>

      {dealer.logoUrl && (
        <div className="flex justify-center mb-4 sm:mb-6">
          <Image
            src={getImageUrl(dealer.logoUrl)}
            alt={dealer.name}
            width={120}
            height={60}
            className="h-12 sm:h-16 w-auto object-contain"
          />
        </div>
      )}

      <p className="text-center text-xs sm:text-sm text-foreground mb-4 sm:mb-6">
        Book Directly from the Dealer
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
        {dealer.phone && (
          <Button
            asChild
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm"
          >
            <a href={`tel:${dealer.phone}`}>
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </a>
          </Button>
        )}
        {dealer.whatsapp && (
          <Button
            asChild
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg text-sm"
          >
            <a
              href={`https://wa.me/${dealer.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="h-4 w-4 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </Button>
        )}
      </div>

      {/* Dealer Note */}
      {dealer.note && (
        <div className="bg-secondary rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
          <div className="flex gap-2 sm:gap-3">
            <span className="text-lg sm:text-xl flex-shrink-0">💡</span>
            <div className="min-w-0">
              <h4 className="font-semibold text-foreground text-xs sm:text-sm">
                Dealer Note
              </h4>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                {dealer.note}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dealer Info */}
      {dealer.location && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs sm:text-sm text-muted-foreground">
              {dealer.location}
            </span>
          </div>
          <Link
            href="/"
            className="text-xs text-primary hover:underline whitespace-nowrap"
          >
            More Ads by the Dealer →
          </Link>
        </div>
      )}

      {/* Open Status */}
      {dealer.hours && (
        <div className="mt-3 sm:mt-4 bg-accent/10 rounded-xl p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-accent-foreground flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-accent-foreground">
                Open Now
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {dealer.hours}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        </div>
      )}
    </div>
  );
}
