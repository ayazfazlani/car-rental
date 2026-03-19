'use client';

import { useDebouncedCallback } from "@/hooks/use-debounce";
import { SearchIcon } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Search() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term) => {
        const params = searchParams ? new URLSearchParams(searchParams) : new URLSearchParams()
        params.set('page', '1');
        if (term) {
            params.set('search', term);
        } else {
            params.delete('search');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="flex gap-3 justify-end">
            <Input
                placeholder="Search blog posts..."
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
                defaultValue={searchParams ? searchParams.get('search')?.toString() : ''}
                className="max-w-64 border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500"
            />
            <Button
                variant="outline"
                size="icon"
                className="w-10 border-slate-300 hover:bg-slate-100"
            >
                <SearchIcon className="h-4 w-4" />
            </Button>
        </div>
    );
}