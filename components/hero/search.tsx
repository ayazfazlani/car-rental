"use client"
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function SearchSection() {
    const t = useTranslations()
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")

    const handleSearch = () => {
        let query = ''
        if (searchQuery.trim()) {
            query = 'search=' + encodeURIComponent(searchQuery.trim())
        }
        router.push(`/cars?${query}`)
    }
    return (
        //  <div className="relative  container mx-auto flex justify-center  bg-white p-8 rounded-2xl">
        <div className="w-full max-w-2xl flex items-center  bg-background border border-border-warm rounded-full shadow-sm overflow-hidden mb-4">
            
            <div className="flex items-center flex-1 min-w-0 px-2 sm:px-4">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mr-1.5 sm:mr-3 shrink-0" />
                <input
                    type="text"
                    placeholder={t("hero.searchPlaceholder") || "Search by name"}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1 min-w-0 py-2 sm:py-3 md:py-3.5 bg-transparent text-xs sm:text-sm outline-none placeholder:text-muted-foreground"
                />
            </div>
            <Button
                onClick={handleSearch}
                className="bg-primary hover:bg-primary/90 text-white rounded-full h-7 sm:h-8 md:h-9 lg:h-10 px-2.5 sm:px-3 md:px-4 lg:px-6 mx-0.5 sm:m-0.5 md:m-1 lg:m-1.5 text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-medium whitespace-nowrap shrink-0"
            >
                {t("hero.viewAllCars") || "View All Cars"}
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
           
        </div>
        // </div>
        
    )
}
