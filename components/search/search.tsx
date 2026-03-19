'use client'
import { use, useEffect, useMemo } from 'react'
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import {
    parseAsString,
    parseAsInteger,
    parseAsFloat,
    parseAsBoolean,
    parseAsStringEnum,
    useQueryStates,
    Values,
} from 'nuqs'
import { API } from '@/lib/api'
import { CarListing } from '@/components/listing/cars'

import { useTranslations } from 'next-intl'
import { useInView } from 'react-intersection-observer';
import { Car, CarBrand, CarCategory, Contact } from '@prisma/client'
import { Loader } from 'lucide-react'
import { CarsSkeleton } from '../listing/cars-skeleton'
import Translated from '../translated'
import Filter from './filter'

const TRANSMISSIONS = ['AUTOMATIC', 'MANUAL'] as const
const FUEL_TYPES = ['DIESEL', 'ELECTRIC', 'HYBRID', 'PETROL'] as const
const PERIODS = ['DAILY', 'WEEKLY', 'MONTHLY'] as const
const PAGE_SIZE = 16

const Query = {
    brandId: parseAsString,
    categoryId: parseAsString,
    transmission: parseAsStringEnum(Array.from(TRANSMISSIONS)),
    fuelType: parseAsStringEnum(Array.from(FUEL_TYPES)),
    seats: parseAsInteger,
    hasChauffeur: parseAsBoolean,
    hasSelfDrive: parseAsBoolean,
    hasGPS: parseAsBoolean,
    hasBluetooth: parseAsBoolean,
    hasSunroof: parseAsBoolean,
    hasLeatherSeats: parseAsBoolean,
    hasBackupCamera: parseAsBoolean,
    affordable: parseAsBoolean,
    recommended: parseAsBoolean,
    search: parseAsString,
    period: parseAsStringEnum(Array.from(PERIODS)).withDefault('DAILY'),
    minPrice: parseAsFloat.withDefault(0),
    maxPrice: parseAsFloat.withDefault(50000),
}

export type TSearchQuery = typeof Query

type Props = {
    brands: Promise<CarBrand[]>
    categories: Promise<CarCategory[]>
    contacts: Promise<Contact[]>
    defaultFilters?: Partial<Values<TSearchQuery>>
}

export default function SearchComponent({ brands: brandsPromise, categories: categoriesPromise, contacts: contactsPromise, defaultFilters }: Props) {
    const t = useTranslations()
    const { ref, inView } = useInView();

    const brands = use(brandsPromise)
    const categories = use(categoriesPromise)
    const contacts = use(contactsPromise)

    const [filters, setFilters] = useQueryStates(Query)

    // Merge default filters with URL filters for the query
    const activeFilters = useMemo(() => {
        const merged = { ...defaultFilters }
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                merged[key as keyof Values<TSearchQuery>] = value as any
            }
        })
        return merged
    }, [filters, defaultFilters])

    const queryKey = useMemo(() => ['public/cars', activeFilters], [activeFilters])

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    } = useInfiniteQuery({
        queryKey: queryKey,
        queryFn: async ({ pageParam }) => {
            const params = new URLSearchParams()
            Object.entries(activeFilters || {}).forEach(([k, v]) => {
                if (v === null || v === undefined) return
                params.append(k, String(v))
            })
            const { start, limit } = getQueryFromPageNumber(pageParam, PAGE_SIZE)
            params.append("start", start.toString())
            params.append("limit", limit.toString())

            const url = `/api/public/cars${params.toString() ? `?${params.toString()}` : ''}`
            const res = await API.queryGet<any>({ url })
            return res
        },
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            const totalPages = Math.ceil((lastPage?.total || 0) / PAGE_SIZE);
            return lastPageParam < totalPages ? lastPageParam + 1 : undefined;
        },
        initialPageParam: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    useEffect(() => {
        if (inView) {
            // Fetch more items when the loading ref is in view
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }
    }, [inView, isFetchingNextPage, hasNextPage, fetchNextPage]);

    const cars = getFlattenUniqueCars(data)

    return (
        <div className="w-full">
            <div className="space-y-2 md:space-y-6 relative">
                <div className="md:sticky md:top-[82px] z-40 border-b bg-card border-border backdrop-blur supports-[backdrop-filter]:bg-card/95">
                    <Filter
                        filters={activeFilters as any}
                        setFilters={setFilters}
                        brands={brands}
                        categories={categories}
                        hideBrand={!!defaultFilters?.brandId}
                    />
                </div>

                {/* Results column */}
                <main>
                    {isLoading && <CarsSkeleton count={PAGE_SIZE} compact={false} />}
                    {error && <div className="text-red-600">
                        <Translated key="search.errorLoadingCars" fallback="Error loading cars" />
                    </div>}

                    {!isLoading && !error && (
                        <CarListing
                            cars={cars}
                            contacts={contacts}
                            endComponent={hasNextPage && (
                                <div ref={ref} className="flex item-center justify-center my-4" >
                                    <Loader className="h-10 w-10 animate-spin" />
                                </div>
                            )}
                        />
                    )}
                    {!isLoading && cars.length === 0 && (
                        <div className="text-center text-muted-foreground mt-20">
                            <Translated key="search.noResults" fallback="No results found" className='text-3xl' />
                            <Translated key="search.noResultsDesc" fallback="Try adjusting your filters" className='text-sm' />
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}


export const getQueryFromPageNumber = (pageNumber: number, limit = 10) => {
    return {
        start: (pageNumber - 1) * limit,
        limit: limit,
    };
};


export const getFlattenUniqueCars = (cars: InfiniteData<{ cars: Car[], total: number }, unknown> | undefined) => {
    if (!cars) return [];
    const list = cars.pages.flatMap((page) => page.cars);

    const unique = Array.from(
        new Map(list.map(item => [item.id, item])).values()
    );

    return unique;
};