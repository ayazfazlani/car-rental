import Link from 'next/link';
import { Blog } from '@prisma/client';
import Image from 'next/image';
import { formatDate, getImageUrl } from '@/lib/utils';
import { Slug } from './Slug';

type BlogContentProps = {
    blogs: Blog[];
}

export function SmallBlog({ blog }: { blog: Blog }) {
    return (
        <Link href={`blog/${blog.slug}`} className='flex flex-col w-full md:w-[350px] gap-2 border border-border rounded-xl overflow-hidden'>
            <div className='h-[300px] relative'>
                <Image
                    src={getImageUrl(blog?.cover)}
                    alt={blog?.title || ''}
                    fill={true}
                    className='rounded-xl overflow-hidden'
                    style={{ objectFit: "cover" }}
                />
            </div>
            <div className='flex flex-col gap-2 p-4'>
                <div className='flex flex-col gap-4'>
                    {blog?.tags && blog?.tags?.length > 0 ?
                        <div className='flex flex-wrap gap-3'>
                            {blog?.tags?.map((tag, index) => {
                                return <Slug key={index} text={tag} color='#FF592C' />
                            })}
                        </div>
                        :
                        <Slug text='New' />
                    }
                    <h2 className={`text-lg md:text-xl lg:text-2xl font-bold text-gray-700 min-h-[64px] `}>{blog?.title || ''}</h2>
                </div>
                <div className='flex w-full justify-between items-center'>
                    <p className='text-sm'>{formatDate(blog?.createdAt) || ''}</p>
                </div>
            </div>
        </Link>
    )
}

export function BlogContent({ blogs }: BlogContentProps) {
    return (
        <div className='flex flex-wrap items-center justify-center w-full gap-8'>
            {blogs && blogs.length > 0 && blogs.map((blog) => {
                return <SmallBlog key={blog.id} blog={blog} />
            })}
        </div>
    )
}
