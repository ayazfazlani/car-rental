'use client'
import { use } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CarBrand } from '@prisma/client';
import Link from 'next/link';

export default function HeaderBrands({
    brands,
}: {
    brands: Promise<CarBrand[]>
}) {
    const t = useTranslations("common");
    const allBrands = use(brands)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors outline-none">
                {t("carBrands")}
                <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='min-w-40' align='start'>
                {allBrands.map((brand) => (
                    <Link href={`/cars?brandId=${brand.id}`} key={brand.id}>
                        <DropdownMenuItem key={brand.id}>{brand.name}</DropdownMenuItem>
                    </Link>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}