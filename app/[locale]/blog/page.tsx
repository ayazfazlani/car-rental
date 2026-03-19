import React, { Suspense } from 'react'
import { parseAsFloat, createLoader, parseAsString, SearchParams } from 'nuqs/server'
import { Search } from '@/components/blog/Search';
import { RenderSkeleton } from '@/components/blog/Skeletons';
import ListBlogs from '@/components/blog/ListBlogs';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { PAGE_METATAGS } from '@/lib/constants';
import { getMetaData } from '@/lib/data/meta-data';
import { formatMetadata } from '@/lib/utils';


export async function generateMetadata(): Promise<Metadata> {
    const meta = await getMetaData(PAGE_METATAGS.BLOGS)
    return formatMetadata(meta)
}


export const queryParams = {
    page: parseAsFloat.withDefault(1),
    search: parseAsString.withDefault(''),
}

export const loadSearchParams = createLoader(queryParams)

type PageProps = {
    searchParams: Promise<SearchParams>
}

const limit = 10

export default async function Page({ searchParams }: PageProps) {
    const t = await getTranslations()
    const { page, search } = await loadSearchParams(searchParams)

    return (
        <div className='w-full min-h-screen bg-gradient-to-b from-slate-50 to-white'>
            <div className="flex flex-col md:flex-row gap-6 mob:flex-row w-full items-start mob:items-center justify-between p-6 mob:p-12 lg:p-16">
                <div className='flex flex-col gap-2 flex-1'>
                    <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900'>{t("admin.blog.latestNews")}</h1>
                    <p className='text-slate-600'>{t("admin.blog.subtitle")}</p>
                </div>
                <Search />
            </div>

            {/* Blog Content */}
            <div className='w-full'>
                <Suspense key={page} fallback={<RenderSkeleton page={page} />}>
                    <ListBlogs page={page} limit={limit} search={search} />
                </Suspense>
            </div>
        </div>
    )
}
