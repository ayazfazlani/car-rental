"use client";
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { useTranslations } from 'next-intl'
import { CarBrand, CarCategory } from '@prisma/client'
import { Slider } from "@/components/ui/slider";
import { TSearchQuery } from './search';
import { Values, SetValues } from 'nuqs';
import { ChevronDownIcon, FilterX } from 'lucide-react';
import { useEffect, useState } from 'react';

const TRANSMISSIONS = ['AUTOMATIC', 'MANUAL'] as const
const FUEL_TYPES = ['DIESEL', 'ELECTRIC', 'HYBRID', 'PETROL'] as const
const PERIODS = ['DAILY', 'WEEKLY', 'MONTHLY'] as const

type Props = {
    filters: Values<TSearchQuery>
    setFilters: SetValues<TSearchQuery>
    brands: CarBrand[]
    categories: CarCategory[]
    hideBrand?: boolean
}

export default function Filter(props: Props) {
    // Always render the same horizontal filter layout for mobile and desktop
    return <FilterMain {...props} />
}

const FilterMain = ({ filters, setFilters, brands, categories, hideBrand }: Props) => {
    const t = useTranslations()

    const extras: [string, string][] = [
        ['hasChauffeur', 'chauffeurAvailable'],
        ['hasSelfDrive', 'selfDrive'],
        ['hasGPS', 'gpsNavigation'],
        ['hasBluetooth', 'bluetooth'],
        ['hasSunroof', 'sunroof'],
        ['hasLeatherSeats', 'leatherSeats'],
        ['hasBackupCamera', 'backupCamera'],
        ['affordable', 'affordable'],
        ['recommended', 'recommended'],
    ]

    const [isMoblie, setIsMoblie] = useState(true)

    useEffect(() => {
        setIsMoblie(window.innerWidth < 768)

        window.addEventListener('resize', () => {
            setIsMoblie(window.innerWidth < 768)
        })

    }, [])

    return (
        <div className="flex flex-row flex-1 overflow-x-scroll gap-x-2 gap-y-0.5 md:gap-y-2 items-center py-2">

            <div className='md:space-y-1'>
                <Label className='text-xs md:text-sm'>{t("search.search")}</Label>
                <Input
                    placeholder={t("search.searchCars")}
                    value={filters?.search ?? ''}
                    className='min-w-24 max-w-52'
                    onChange={(e) => setFilters({ search: e.target.value || null })}
                />
            </div>

            <div className='md:space-y-1'>
                <Label className='text-xs md:text-sm'>{t("search.period")}</Label>
                <Select value={filters?.period ?? ''} onValueChange={(v) => setFilters({ period: v as any })}>
                    <SelectTrigger className='h-6 md:h-10'>
                        <SelectValue placeholder={t("search.selectPeriod")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {PERIODS.map((p) => (
                                <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className='flex gap-2'>
                <div className='md:space-y-1'>
                    <Label className='text-xs md:text-sm'>{t("search.minPrice")}</Label>
                    <Input
                        type='number'
                        placeholder={t("search.minPrice")}
                        value={filters?.minPrice ?? ''}
                        className='min-w-14 max-w-32'
                        onChange={(e) => setFilters({ minPrice: e.target.value ? Number(e.target.value) : 0 })}
                    />
                </div>
                <div className='md:space-y-1'>
                    <Label className='text-xs md:text-sm'>{t("search.maxPrice")}</Label>
                    <Input
                        type='number'
                        placeholder={t("search.maxPrice")}
                        value={filters?.maxPrice ?? ''}
                        className='min-w-14 max-w-32'
                        onChange={(e) => setFilters({ maxPrice: e.target.value ? Number(e.target.value) : 0 })}
                    />
                </div>
            </div>

            {!hideBrand && (
                <div className='md:space-y-1'>
                    <Label className='text-xs md:text-sm'>{t("search.brand")}</Label>
                    <Select value={filters?.brandId ?? ''} onValueChange={(v) => {
                        const brand = brands.find(b => b.id === v)
                        if (brand && document) {
                            document.title = brand.name + " | Luxus Car Rental"
                        }
                        setFilters({ brandId: v as any })
                    }}>
                        <SelectTrigger className='w-24 md:w-44 h-6 md:h-10'>
                            <SelectValue placeholder={t("search.selectBrand")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {brands.map((brand) => (
                                    <SelectItem key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div className='md:space-y-1'>
                <Label className='text-xs md:text-sm'>{t("search.category")}</Label>
                <Select value={filters?.categoryId ?? ''} onValueChange={(v) => setFilters({ categoryId: v as any })}>
                    <SelectTrigger className='w-24 md:w-44 h-6 md:h-10'>
                        <SelectValue placeholder={t("search.selectCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {!isMoblie &&
                <>
                    <div className='md:space-y-1'>
                        <Label className='text-xs md:text-sm'>{t("search.seats")}</Label>
                        <Input
                            type="number"
                            value={filters?.seats ?? ''}
                            className='max-w-24'
                            onChange={(e) => setFilters({ seats: e.target.value ? Number(e.target.value) : null })}
                        />
                    </div>
                    <div className='md:space-y-1'>
                        <Label className='text-xs md:text-sm'>&nbsp;</Label>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="px-3 py-2 border rounded-md w-44 flex justify-between text-muted-foreground">
                                <div>
                                    {t('search.extras')}
                                </div>
                                <ChevronDownIcon className='h-4 w-4' />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="p-2">
                                <DropdownMenuLabel>{t('search.extras')}</DropdownMenuLabel>
                                <div className="flex flex-col gap-2 p-1">
                                    {extras.map(([key, label]) => (
                                        <label key={key} className="flex items-center gap-2 text-sm">
                                            <Checkbox
                                                checked={Boolean((filters as any)?.[key])}
                                                onCheckedChange={(val) => setFilters({ [key]: val ? true : null })}
                                            />
                                            <span>{t("search." + label)}</span>
                                        </label>
                                    ))}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </>
            }
            <div className='md:space-y-1'>
                <Label className='text-xs md:text-sm'>&nbsp;</Label>
                <div>
                    <Button className="hidden md:block" variant="secondary" onClick={() => setFilters(null)}>{t("search.resetFilters")}</Button>
                    <button className="md:hidden" onClick={() => setFilters(null)}><FilterX className='h-4 w-4' /></button>
                </div>
            </div>
        </div>
    )
}