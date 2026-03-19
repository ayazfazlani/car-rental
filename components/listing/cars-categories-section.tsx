import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Car, Contact } from "@prisma/client";
import Translated from "../translated";
import Link from "next/link";
import HorizontalListing from "./horizontal-listing";

interface CarSectionProps {
  id: string;
  title: string;
  subtitle: string;
  cars: Car[];
  contacts: Contact[];
}

export function CarCategoriesSection({
  id,
  title,
  subtitle,
  cars,
  contacts,
}: CarSectionProps) {
  if (!cars.length) return <></>

  return (
    <section className="py-10 ">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-start justify-between mb-6 ">
          <div>
            <h2 className="text-2xl lg:text-[28px] font-bold text-foreground">
              {title}
            </h2>
            {/* <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p> */}
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg hidden md:flex text-sm px-5 h-10">
            <Link href={'/cars?categoryId=' + id}>
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
