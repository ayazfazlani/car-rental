'use server'
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFilterdCars } from "@/lib/data/features";
import Translated from "../translated";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { getActiveContacts } from "@/lib/data/contact";
import HorizontalListing from "./horizontal-listing";

interface CarSectionProps {
  titleKey?: string;
  titleFallback: string;
  subtitleKey?: string;
  subtitleFallback: string;
  query: Prisma.CarWhereInput;
  className?: string;
}

export async function CarFilterdSection({
  query,
  titleKey,
  titleFallback,
  subtitleKey,
  subtitleFallback,
  className = "",
}: CarSectionProps) {
  const cars = await getFilterdCars(query, 0, 12)
  const contacts = await getActiveContacts();

  if (!cars.length) return <></>

  return (
    <section className={`py-10 ${className}`}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-start justify-between mb-6">
          <div>
            <Translated key={titleKey} fallback={titleFallback} className="text-2xl lg:text-[28px] font-bold text-foreground" />
            <Translated key={subtitleKey} fallback={subtitleFallback} className="text-muted-foreground mt-1 text-sm" />
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-lg hidden md:flex text-sm px-5 h-10">
            <Link href={`/cars?${Object.entries(query).map(([k, v]) => `${k}=${v}`).join('&')}`}>
              <Translated key="carSection.viewAll" fallback="View All" />{" "}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <HorizontalListing cars={cars} contacts={contacts} />
      </div>
    </section>
  );
}
