'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getPaginationMeta } from "@/lib/utils"
import { Pagination } from "../pagination"

export const BlogPagination = ({ total, limit, page }: { total: number, limit: number, page: number }) => {
    const router = useRouter()
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number | string) => {
        const params = searchParams ? new URLSearchParams(searchParams) : new URLSearchParams();
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const meta = getPaginationMeta(total, page, limit)

    return (
        <div className="mt-5 flex w-full justify-center">
            <Pagination
                totalPages={meta.totalPages}
                limit={limit}
                page={page}
                total={total}
                onPageChange={(page) => {
                    router.push(
                        createPageURL(page)
                    )
                }}
            />
        </div>
    )
}