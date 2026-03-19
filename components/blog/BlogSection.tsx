import { getBlogs } from '@/lib/data/blog';
import { BlogContent } from './BlogContent';
import { getTranslations } from 'next-intl/server';

export async function BlogSection() {
    const t = await getTranslations()
    const { blogs } = await getBlogs(0, 4)

    if (!blogs || blogs.length === 0) return <></>
    return (
        <div className='flex flex-col items-center px-5 py-10 gap-20'>
            <div className='max-w-2xl flex flex-col items-center justify-center gap-5'>
                <h2 className='text-2xl md:text-6xl font-bold'>{t("admin.blog.latestNews")}</h2>
                <p className='max-w-xl text-avg text-center'>{t("admin.blog.subtitle")}</p>
            </div>
            {blogs && blogs.length > 0 && <BlogContent blogs={blogs} />}
        </div>
    )
}
