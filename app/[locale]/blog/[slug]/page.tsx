import { generateHTML } from '@tiptap/html/server';
import Image from 'next/image';
import '../../../rich-text.css';
import { notFound } from 'next/navigation';
import { getBlog, getRelatedBlogs } from '@/lib/data/blog';
import { formatDate, getImageUrl } from '@/lib/utils';
import { Calendar, Tag } from 'lucide-react';
import { JSONContent } from '@tiptap/react';
import { Metadata } from 'next';
import BlogSchema from '@/components/seo/BlogSchema';
import { Slug } from '@/components/blog/Slug';
import Link from 'next/link';

// Tiptap Extensions
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import TipTapImage from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

type Params = Promise<{
    slug: string;
    locale: string;
}>;

// Helper to clean empty links and paragraphs
const cleanEmptyHrefs = (html: string): string => {
    if (!html) return '<p>No content available</p>';

    return html
        .replace(/<a\s+[^>]*?href=["']\s*["'][^>]*?>(.*?)<\/a>/gi, '$1')
        .replace(/<a\s+[^>]*?href=["']#["'][^>]*?>(.*?)<\/a>/gi, '$1')
        .replace(/<p>\s*<\/p>/g, '')
        .replace(/<p><br><\/p>/g, '')
        .trim();
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { slug, locale } = await params;
    const blog = await getBlog(slug);

    if (!blog) {
        return { title: 'Blog Not Found' };
    }

    const currentPath = `/blog/${blog.slug}`;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://luxuscarrental.com';

    return {
        title: blog.seo_title || blog.title,
        description: blog.seo_description || blog.info,
        keywords: blog.keywords?.join(', ') || '',
        alternates: {
            canonical: blog.canonical || `${baseUrl}${currentPath}`,
            languages: {
                en: `${baseUrl}/en${currentPath}`,
                ar: `${baseUrl}/ar${currentPath}`,
            }
        },
        openGraph: {
            title: blog.seo_title || blog.title,
            description: blog.seo_description || blog.info,
            images: [getImageUrl(blog.cover) || ""],
            type: 'article'
        },
    };
}

export default async function Page({ params }: { params: Params }) {
    const { slug, locale } = await params;
    const blog = await getBlog(slug);

    if (!blog) {
        return notFound();
    }

    const tags = blog.tags || [];
    const relatedBlogs = await getRelatedBlogs(slug, tags, 3);

    let htmlContent = '<p>No content available</p>';

    // Generate HTML from Tiptap JSON
    if (blog.content) {
        try {
            const extensions = [
                StarterKit.configure({
                    heading: { levels: [1, 2, 3] },
                    link: false, // Disable default link from StarterKit
                }),
                LinkExtension.configure({
                    openOnClick: true,
                    autolink: true,
                    defaultProtocol: 'https',
                    HTMLAttributes: {
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        class: 'tiptap-link',
                    },
                }),
                TipTapImage.configure({
                    HTMLAttributes: {
                        class: 'rounded-lg my-2 mx-auto',
                    },
                }),
                Table.configure({ resizable: true }),
                TableRow,
                TableHeader,
                TableCell,
            ];

            const content = blog.content as JSONContent;

            // Safety check
            if (content?.type === 'doc') {
                const rawHtml = generateHTML(content, extensions);
                htmlContent = cleanEmptyHrefs(rawHtml);
            } else if (typeof blog.content === 'string') {
                htmlContent = cleanEmptyHrefs(blog.content);
            }
        } catch (error) {
            console.error(`[Tiptap Error] Failed to generate HTML for slug: ${slug}`, error);

            // Fallback
            if (typeof blog.content === 'string') {
                htmlContent = cleanEmptyHrefs(blog.content);
            } else {
                htmlContent = `<p>Unable to display full content at the moment.</p>`;
            }
        }
    }

    return (
        <div className='w-full'>
            <BlogSchema blog={blog} locale={locale} />

            <div className='py-16 max-w-[1288px] mx-auto px-5 mob:px-10 xl:px-0'>
                {/* Title */}
                <h1 className='font-bold text-3xl sm:text-5xl max-w-[850px]'>{blog.title}</h1>

                {/* Meta */}
                <div className='flex gap-[25px] pt-5 pb-9'>
                    <div className='flex gap-2 items-center'>
                        <Calendar size={18} className='text-slate-500' />
                        <p className='text-gray-500 text-lg'>{formatDate(blog.createdAt)}</p>
                    </div>
                </div>

                {/* Cover Image */}
                {getImageUrl(blog.cover) && (
                    <div className='relative w-full rounded-2xl overflow-hidden bg-slate-100 mb-10'>
                        <Image
                            src={getImageUrl(blog.cover)!}
                            alt={blog.title}
                            width={1288}
                            height={700}
                            priority
                            className='w-full h-auto object-contain'
                        />
                    </div>
                )}

                {/* Blog Content */}
                <div
                    className='editor max-w-[920px] mx-auto px-0 mob:px-8 md:px-16 py-24 lg:px-0 md:py-32 prose prose-slate'
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />

                {/* Tags */}
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

                <div className='max-w-[920px] mx-auto px-0 mob:px-8 md:px-16 lg:px-0'>
                    <hr className='border-border my-4' />
                </div>
            </div>

            {/* Related Blogs */}
            {relatedBlogs.length > 0 && (
                <section className='w-full bg-gradient-to-b from-slate-50 to-white py-16'>
                    <div className='max-w-[1288px] mx-auto px-5 mob:px-10 xl:px-0'>
                        <h2 className='text-2xl sm:text-3xl font-bold text-slate-900 mb-2'>Related Posts</h2>
                        <p className='text-slate-500 mb-10'>Continue exploring our latest articles</p>

                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                            {relatedBlogs.map((related) => {
                                const coverUrl = getImageUrl(related.cover);
                                return (
                                    <Link
                                        key={related.id}
                                        href={`/blog/${related.slug}`}
                                        className='group flex flex-col rounded-2xl overflow-hidden border border-border bg-white hover:shadow-xl transition-shadow duration-300'
                                    >
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

                                        <div className='flex flex-col gap-3 p-5 flex-1'>
                                            {related.tags?.length > 0 && (
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
                                                <span className='text-xs text-slate-400'>
                                                    {formatDate(related.createdAt)}
                                                </span>
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
    );
}