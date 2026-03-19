'use client';
import Link from 'next/link';
import { parseAsBoolean, parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { PlusCircle } from 'lucide-react';
import { RenderSkeleton, RenderBlogs } from '@/components/admin/blog/components';
import { Pagination } from '@/components/pagination';
import { getPaginationMeta, querify } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { API } from '@/lib/api';
import { Blog } from '@prisma/client';


export default function Page() {
    const [query, setQuery] = useQueryStates({
        page: parseAsInteger.withDefault(1),
        limit: parseAsInteger.withDefault(10),
        search: parseAsString.withDefault(''),
        draft: parseAsBoolean,
    });

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['blogs', query],
        queryFn: () => API.queryGet<{ blogs: Blog[], total: number }>({
            url: '/api/admin/blog' + querify(query),
            auth: true,
        }),
    })

    const { blogs, total } = data || { blogs: [], total: 0 }

    const meta = getPaginationMeta(total, query.page, query.limit)

    return (
        <div>
            <div className="flex  items-center justify-between p-16">
                <h1 className={`text-3xl md:text-4xl text-veryDarkGray`}>Blogs:</h1>
                <Link href="/admin/blog/create" className='flex gap-2 items-center justify-center px-5 py-2 rounded-md bg-green-600 text-white ' >
                    <PlusCircle />
                    <h2 >Create</h2>
                </Link>
            </div>

            {isLoading ? <RenderSkeleton /> : <RenderBlogs blogs={blogs} refetch={refetch} />}
            {!isLoading && blogs.length === 0 && <div className='mt-5 flex w-full justify-center'>
                <p className='text-center text-muted-foreground mb-20'>No blogs found</p>
            </div>}
            <div className='mt-5 flex w-full justify-center'>
                <Pagination
                    total={total}
                    page={query.page}
                    limit={query.limit}
                    onPageChange={(page) => {
                        setQuery({ page })
                    }}
                    onLimitChange={(limit) => {
                        setQuery({ limit })
                    }}
                    totalPages={meta.totalPages}
                />
            </div>
        </div>
    )
}
