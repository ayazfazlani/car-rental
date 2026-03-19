import { Blog } from '@prisma/client';
import { SmallBlog } from './BlogContent';

type BlogContentProps = {
    blogs: Blog[];
    page: number;
}

export function RenderPosts({ blogs, page }: BlogContentProps) {
    return (
        <div className='flex flex-wrap items-center justify-center w-full gap-8 px-6 mob:px-16 pb-16'>
            {blogs && blogs.length > 0 && blogs.map((blog, index) => {
                return <SmallBlog key={blog.id} blog={blog} />
            })}
        </div>
    )
}
