'use client'

import { useState } from 'react'
import { cn, removeAllDecimal } from '@/lib/utils'
import { CarCard } from '../CarCard'
import { Car, Contact } from '@prisma/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

type CarListingProps = {
    cars: Car[];
    contacts?: Contact[];
}

const CARS_PER_PAGE = 4;

export default function HorizontalListing({ cars, contacts }: CarListingProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const visibleCars = cars.slice(currentIndex, currentIndex + CARS_PER_PAGE);
    const canGoBack = currentIndex > 0;
    const canGoForward = currentIndex + CARS_PER_PAGE < cars.length;

    const goBack = () => {
        if (canGoBack) {
            setCurrentIndex(prev => Math.max(0, prev - CARS_PER_PAGE));
        }
    };

    const goForward = () => {
        if (canGoForward) {
            setCurrentIndex(prev => prev + CARS_PER_PAGE);
        }
    };

    if (cars.length === 0) {
        return <div className="text-center py-8">No cars available</div>;
    }

    return (
        <div className="relative">
            {canGoBack && <Button
                size="icon"
                onClick={goBack}
                disabled={!canGoBack}
                className={cn(
                    "absolute -left-4 top-1/2 -translate-y-1/2 z-10 rounded-full transition-colors",
                    canGoBack ? "bg-primary text-primary-foreground" :
                        "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
                aria-label="Previous cars"
            >
                <ChevronLeft size={24} />
            </Button>}

            {/* Cars Grid */}
            <div className="flex-1">
                <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5")}>
                    {visibleCars.map((car, index) => (
                        <div
                            key={car.id}
                            style={{
                                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                            }}
                        >
                            <CarCard
                                car={removeAllDecimal(car)}
                                showDetails={true}
                                contacts={contacts}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Forward Arrow */}
            {canGoForward && <Button
                variant="ghost"
                size="icon"
                onClick={goForward}
                disabled={!canGoForward}
                className={cn(
                    "absolute -right-4 top-1/2 -translate-y-1/2 z-10 rounded-full transition-colors",
                    canGoForward ?
                        "bg-primary text-primary-foreground" :
                        "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
            >
                <ChevronRight className="h-5 w-5" />
            </Button>}
        </div>
    )
}
