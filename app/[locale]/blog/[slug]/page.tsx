import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit'
import ListItem from '@tiptap/extension-list-item'
import TipTapImage from '@tiptap/extension-image'
import Image from 'next/image';
import './content.css';
import { notFound } from 'next/navigation';
import { getBlog } from '@/lib/data/blog';
import { formatDate, getImageUrl, } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import { JSONContent } from '@tiptap/react';
import { Metadata } from 'next';
import BlogSchema from '@/components/seo/BlogSchema';


type Params = Promise<{
    slug: string;
    locale: string;
}>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { slug } = await params;
    const blog = await getBlog(slug)
    if (!blog) return {
        title: 'Blog Not Found',
    }

    return {
        title: {
            template: '%s | Luxus Car Rental',
            default: blog.title
        },
        description: blog.info,
        keywords: blog.keywords,
        alternates: {
            canonical: blog.canonical || `https://luxuscarrental.com/blog/${blog.slug}`,
        },
        robots: {
            index: true,
            follow: true,
        },
        assets: [getImageUrl(blog.cover) || ""],
        openGraph: {
            title: blog.title,
            description: blog.info,
            siteName: "Luxus Car Rental",
            locale: 'en_US, ar',
            images: [getImageUrl(blog.cover) || ""],
            type: 'article'
        },
    }
}

export default async function page({ params }: { params: Params }) {
    const { slug, locale } = await params;
    const blog = await getBlog(slug)
    if (!blog) {
        return notFound();
    }
    const tags = blog.tags || [];
    return (
        <div className='w-full'>
            <BlogSchema blog={blog} locale={locale} />
            <div className='py-16 max-w-[1288px] mx-auto px-5 mob:px-10 xl:px-0'>
                {blog &&
                    <>
                        <div className='flex flex-wrap'>
                            {tags.map((tag, index) => (
                                <div key={index} className='pl-2 pb-2 text-xl font-semibold text-veryDarkGray'>{tag}</div>
                            ))}
                        </div>
                        <h1 className='font-bold text-3xl sm:text-5xl max-w-[850px]'>{blog?.title}</h1>
                        <div className='flex gap-[25px] pt-5 pb-9'>
                            <div className='flex gap-2'>
                                <Calendar />
                                <p className='text-gray-500 text-lg'>{formatDate(blog.createdAt)}</p>
                            </div>
                        </div>
                        {getImageUrl(blog.cover) && (
                            <div className='relative h-[400px] md:h-[500px] lg:h-[600px] border'>
                                <Image
                                    src={getImageUrl(blog.cover)!}
                                    alt='cover'
                                    fill
                                    objectFit='cover'
                                />
                            </div>
                        )}
                        {blog.content && <div className='editor max-w-[920px] flex flex-col mx-auto px-0 mob:px-8  md:px-16 py-24 lg:px-0 md:py-32'
                            dangerouslySetInnerHTML={{
                                __html:
                                    generateHTML(blog.content as JSONContent, [
                                        ListItem.configure({
                                            HTMLAttributes: {
                                                class: 'text-lg font-bold',
                                            },
                                        }),
                                        TipTapImage.configure({
                                            HTMLAttributes: {
                                                class: 'rounded-lg my-16 mx-auto',
                                            },
                                        }),
                                        StarterKit.configure(),
                                    ])
                            }}
                        />}
                    </>
                }
            </div>
        </div>
    )
}
