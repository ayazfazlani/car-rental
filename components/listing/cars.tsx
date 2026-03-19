import { CarCard } from "@/components/CarCard";
import { Car, Contact, } from "@prisma/client";
import { cn, removeAllDecimal } from "@/lib/utils";

type CarListingProps = {
    cars: Car[];
    endComponent?: React.ReactNode;
    compact?: boolean;
    contacts?: Contact[];
}

export function CarListing({
    cars,
    endComponent,
    compact = true,
    contacts,
}: CarListingProps) {

    return (
        <>
            <div className={cn(
                compact && "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5",
                !compact && "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            )}>
                {cars.map((car, index) => (
                    <CarCard
                        key={car.id}
                        car={removeAllDecimal(car)}
                        showDetails={true}
                        contacts={contacts}
                    />
                ))}
            </div>
            {endComponent}
        </>
    );
}
