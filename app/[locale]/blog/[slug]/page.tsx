import { generateHTML } from '@tiptap/html/server';
import Image from 'next/image';
import './content.css';
import { notFound } from 'next/navigation';
import { getBlog, getRelatedBlogs } from '@/lib/data/blog';
import { formatDate, getImageUrl } from '@/lib/utils';
import { Calendar, Tag } from 'lucide-react';
import { JSONContent } from '@tiptap/react';
import { Metadata } from 'next';
import BlogSchema from '@/components/seo/BlogSchema';
import { Slug } from '@/components/blog/Slug';
import Link from 'next/link';
// Use direct imports like RTE.tsx does
import StarterKit from '@tiptap/starter-kit';
import LinkExt from '@tiptap/extension-link';
import TipTapImage from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

type Params = Promise<{
    slug: string;
    locale: string;
}>

// Helper function to clean ONLY empty hrefs, but preserve valid links
const cleanEmptyHrefs = (html: string): string => {
    if (!html) return '<p>No content available</p>';

    return html
        // ONLY remove links with completely empty href
        .replace(/<a\s+[^>]*?href=["']\s*["'][^>]*?>(.*?)<\/a>/gi, '$1')
        // Remove links with href="#"
        .replace(/<a\s+[^>]*?href=["']#["'][^>]*?>(.*?)<\/a>/gi, '$1')
        // Remove empty paragraphs
        .replace(/<p>\s*<\/p>/g, '')
        .replace(/<p><br><\/p>/g, '')
        .trim();
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { slug } = await params;
    const blog = await getBlog(slug)
    if (!blog) return {
        title: 'Blog Not Found',
    }

    return {
        title: blog.seo_title || blog.title,
        description: blog.seo_description || blog.info,
        keywords: blog.keywords?.join(', ') || '',
        alternates: {
            canonical: blog.canonical || `${process.env.NEXT_PUBLIC_APP_URL || 'https://luxuscarrental.com'}/blog/${blog.slug}`,
        },
        robots: {
            index: true,
            follow: true,
        },
        assets: [getImageUrl(blog.cover) || ""],
        openGraph: {
            title: blog.seo_title || blog.title,
            description: blog.seo_description || blog.info,
            siteName: process.env.NEXT_PUBLIC_SITE_NAME as string,
            locale: 'en_US, ar',
            images: [getImageUrl(blog.cover) || ""],
            type: 'article'
        },
    }
}

export default async function Page({ params }: { params: Params }) {
    const { slug, locale } = await params;
    const blog = await getBlog(slug)

    if (!blog) {
        return notFound();
    }

    const tags = blog.tags || [];

    // Fetch related blogs (by tags, falls back to latest)
    const relatedBlogs = await getRelatedBlogs(slug, tags, 3);

    // Generate HTML from JSON content using the SAME extensions as RTE
    let htmlContent = '<p>No content available</p>';

    if (blog.content) {
        try {
            const extensions = [
                StarterKit.configure({
                    heading: { levels: [1, 2, 3] },
                }),
                TipTapImage.configure({
                    HTMLAttributes: {
                        class: 'rounded-lg my-2 mx-auto',
                    },
                }),
                LinkExt.configure({
                    openOnClick: true,
                    autolink: true,
                    defaultProtocol: 'https',
                    HTMLAttributes: {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        class: 'tiptap-link',
                    },
                }),
                Table.configure({ resizable: true }),
                TableRow,
                TableHeader,
                TableCell,
            ];

            const rawHtml = generateHTML(blog.content as JSONContent, extensions);
            htmlContent = cleanEmptyHrefs(rawHtml);

        } catch (error) {
            console.error('[Tiptap Error] Failed to generate HTML:', error);
            htmlContent = '<p>Error loading content. Please try again later.</p>';
        }
    }

    return (
        <div className='w-full'>
            <BlogSchema blog={blog} locale={locale} />

            {/* ── Hero / header ── */}
            <div className='py-16 max-w-[1288px] mx-auto px-5 mob:px-10 xl:px-0'>
                {blog && (
                    <>
                        <h1 className='font-bold text-3xl sm:text-5xl max-w-[850px]'>{blog.title}</h1>

                        <div className='flex gap-[25px] pt-5 pb-9'>
                            <div className='flex gap-2 items-center'>
                                <Calendar size={18} className='text-slate-500' />
                                <p className='text-gray-500 text-lg'>{formatDate(blog.createdAt)}</p>
                            </div>
                        </div>

                        {/* ── Feature / Cover Image ── */}
                        {getImageUrl(blog.cover) && (
                            <div className='relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden'>
                                <Image
                                    src={getImageUrl(blog.cover)!}
                                    alt={blog.title}
                                    fill
                                    priority
                                    className='object-cover'
                                />
                            </div>
                        )}

                        {/* ── Blog body ── */}
                        <div
                            className='editor max-w-[920px] flex flex-col mx-auto px-0 mob:px-8 md:px-16 py-24 lg:px-0 md:py-32'
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />

                        {/* ── Tags (end of content) ── */}
                        {tags.length > 0 && (
                            <div className='max-w-[920px] mx-auto px-0 mob:px-8 md:px-16 lg:px-0 pb-8'>
                                <div className='flex items-center gap-2 mb-4'>
                                    <Tag size={16} className='text-slate-500' />
                                    <p className='text-sm font-semibold uppercase tracking-[0.2em] text-slate-500'>Tags</p>
                                </div>
                                <div className='flex flex-wrap gap-2'>
                                    {tags.map((tag, index) => (
                                        <Slug key={index} text={tag} color='#FF592C' />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Divider ── */}
                        <div className='max-w-[920px] mx-auto px-0 mob:px-8 md:px-16 lg:px-0'>
                            <hr className='border-border my-4' />
                        </div>
                    </>
                )}
            </div>

            {/* ── Related Posts ── */}
            {relatedBlogs.length > 0 && (
                <section className='w-full bg-gradient-to-b from-slate-50 to-white py-16'>
                    <div className='max-w-[1288px] mx-auto px-5 mob:px-10 xl:px-0'>
                        <h2 className='text-2xl sm:text-3xl font-bold text-slate-900 mb-2'>Related Posts</h2>
                        <p className='text-slate-500 mb-10'>Continue exploring our latest articles</p>

                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                            {relatedBlogs.map((related) => {
                                const href = `/blog/${related.slug}`;
                                const coverUrl = getImageUrl(related.cover);

                                return (
                                    <Link
                                        key={related.id}
                                        href={href}
                                        className='group flex flex-col rounded-2xl overflow-hidden border border-border bg-white hover:shadow-xl transition-shadow duration-300'
                                    >
                                        {/* Card Image */}
                                        <div className='relative h-[220px] w-full bg-slate-100 overflow-hidden'>
                                            {coverUrl ? (
                                                <Image
                                                    src={coverUrl}
                                                    alt={related.title}
                                                    fill
                                                    className='object-cover group-hover:scale-105 transition-transform duration-500'
                                                />
                                            ) : (
                                                <div className='flex items-center justify-center h-full text-slate-400 text-sm'>
                                                    No image
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Body */}
                                        <div className='flex flex-col gap-3 p-5 flex-1'>
                                            {/* Tags */}
                                            {related.tags && related.tags.length > 0 && (
                                                <div className='flex flex-wrap gap-2'>
                                                    {related.tags.slice(0, 2).map((tag, i) => (
                                                        <Slug key={i} text={tag} color='#FF592C' />
                                                    ))}
                                                </div>
                                            )}

                                            <h3 className='text-lg font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-2'>
                                                {related.title}
                                            </h3>

                                            {related.info && (
                                                <p className='text-slate-500 text-sm line-clamp-2'>{related.info}</p>
                                            )}

                                            <div className='flex items-center gap-2 mt-auto pt-3'>
                                                <Calendar size={14} className='text-slate-400' />
                                                <span className='text-xs text-slate-400'>{formatDate(related.createdAt)}</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}