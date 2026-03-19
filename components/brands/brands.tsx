import { CONSTANTS } from '@/lib/constants'
import { getBrands } from '@/lib/data/brands'
import { Suspense } from 'react'
import { BrandsCardSkeleton, BrandsPillsSkeleton, HeaderBrandSkeleton } from './skeletons'
import { BrandsCardSection } from './brands-section'
import BrandPills from './pills'
import HeaderBrands from './header'
export const revalidate = CONSTANTS.REVALIDATE

export default function HomeBrands({ view }: { view: 'pills' | 'cards' | 'header' }) {
    const brands = getBrands()

    return view === 'cards' ? <Suspense fallback={<BrandsCardSkeleton />}>
        <BrandsCardSection brands={brands} />
    </Suspense> : view === 'header' ? <Suspense fallback={<HeaderBrandSkeleton />}>
        <HeaderBrands brands={brands} />
    </Suspense> : <Suspense fallback={<BrandsPillsSkeleton />}>
        <BrandPills brands={brands} />
    </Suspense>
}
