'use client'
import { use } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CarCategory } from '@prisma/client';
import { Link } from '@/i18n/routing';

export function CategoriesComponent({
    categories,
}: {
    categories: Promise<CarCategory[]>
}) {
    const t = useTranslations("common");
    const cateGory = use(categories)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors outline-none">
                {t("carType")}
                <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='min-w-40' align='start'>
                {cateGory.map((cat) => (
                    <Link href={cat.slug ? { pathname: "/categories/[slug]", params: { slug: cat.slug } } : "/cars"} key={cat.id}>
                        <DropdownMenuItem key={cat.id}>{cat.name}</DropdownMenuItem>
                    </Link>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}