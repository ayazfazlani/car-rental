import { getBlogs } from '@/lib/data/blog';
import { BlogPagination } from '@/components/blog/pagination';
import { RenderPosts } from './RenderPostList';

export default async function ListBlogs({ page, limit, search }: { page: number, limit: number, search: string }) {
    const start = page === 1 ? 0 : (page - 1) * limit;
    const { blogs, total } = await getBlogs(start, limit, search)

    return (
        <>
            <RenderPosts page={page} blogs={blogs} />
            <BlogPagination
                total={total}
                limit={limit}
                page={page}
            />
        </>
    )
}
