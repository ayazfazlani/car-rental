'use client';
import { RentalTerm } from '@prisma/client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Translated from './translated';
import { useLocale } from 'next-intl';

interface CarDetailRentalTermsProps {
  rentalTerms?: RentalTerm[];
}

export function CarDetailRentalTerms({ rentalTerms }: CarDetailRentalTermsProps) {
  const locale = useLocale();
  const isAr = locale === "ar";

  if (!rentalTerms || rentalTerms.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-6 ">
      <h3 className="font-semibold text-foreground mb-4 text-sm sm:text-base">
        <Translated
          key="details.rentalTerms"
          fallback="Rental Terms"
        />
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {rentalTerms.map((term) => {
          return (
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-muted-foreground">
                {isAr ? term.title_ar : term.title}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="h-4 w-4 rounded-full border border-muted-foreground flex items-center justify-center text-[10px]">
                      i
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <div className="text-sm prose prose-sm prose-invert" dangerouslySetInnerHTML={{ __html: isAr ? term.description_ar || '' : term.description || '' }} />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )
        })}
      </div>
      <div className="mt-4 p-3 sm:p-4 bg-secondary/90 rounded-lg">
        <p className="text-xs sm:text-sm text-muted-foreground">
          <Translated
            key="details.rentalTermsNote"
            fallback="Please review all rental terms and policies before booking. Additional fees may apply based on your rental period and requirements."
          />
        </p>
      </div>
    </div>
  );
}
