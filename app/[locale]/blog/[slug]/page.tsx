import { generateHTML } from '@tiptap/html';
import Image from 'next/image';
import './content.css';
import { notFound } from 'next/navigation';
import { getBlog } from '@/lib/data/blog';
import { formatDate, getImageUrl, } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import { JSONContent } from '@tiptap/react';
import { Metadata } from 'next';
import BlogSchema from '@/components/seo/BlogSchema';
import * as StarterKitPkg from '@tiptap/starter-kit'
import * as ListItemPkg from '@tiptap/extension-list-item'
import * as ImagePkg from '@tiptap/extension-image'
import * as LinkPkg from '@tiptap/extension-link'
import * as TablePkg from '@tiptap/extension-table'
import * as TableRowPkg from '@tiptap/extension-table-row'
import * as TableCellPkg from '@tiptap/extension-table-cell'
import * as TableHeaderPkg from '@tiptap/extension-table-header'

// Helper to resolve extensions that might be nested due to CJS/ESM interop issues
const resolveExt = (pkg: any, name: string) => {
    const ext = pkg[name] || pkg.default || (pkg.default && pkg.default[name]) || pkg;
    if (ext && ext.configure) return ext;
    // If it's the package itself and has a name property matching what we expect
    if (pkg.name === name || (pkg.default && pkg.default.name === name)) return pkg.default || pkg;
    return ext;
}


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
        title: blog.seo_title || blog.title,
        description: blog.seo_description || blog.info,
        keywords: blog.keywords.join(', '),
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
                        {blog.content && (() => {
                            const starterKit = resolveExt(StarterKitPkg, 'StarterKit');
                            const listItem = resolveExt(ListItemPkg, 'ListItem');
                            const tipTapImage = resolveExt(ImagePkg, 'Image');
                            const link = resolveExt(LinkPkg, 'Link');
                            const table = resolveExt(TablePkg, 'Table');
                            const tableRow = resolveExt(TableRowPkg, 'TableRow');
                            const tableCell = resolveExt(TableCellPkg, 'TableCell');
                            const tableHeader = resolveExt(TableHeaderPkg, 'TableHeader');

                            const extensions = [
                                listItem?.configure({
                                    HTMLAttributes: {
                                        class: 'text-lg font-bold',
                                    },
                                }),
                                tipTapImage?.configure({
                                    HTMLAttributes: {
                                        class: 'rounded-lg my-16 mx-auto',
                                    },
                                }),
                                link?.configure({
                                    openOnClick: false,
                                    autolink: true,
                                    defaultProtocol: 'https',
                                }),
                                table?.configure({
                                    resizable: true,
                                }),
                                tableRow,
                                tableHeader,
                                tableCell,
                                starterKit?.configure({
                                    listItem: false,
                                    link: false,
                                }),
                            ].filter(Boolean);

                            // Diagnostics
                            if (process.env.NODE_ENV === 'production' || true) {
                                console.log('[Tiptap Debug] Extension Status:', {
                                    starterKit: !!starterKit,
                                    listItem: !!listItem,
                                    image: !!tipTapImage,
                                    link: !!link,
                                    table: !!table,
                                    tableRow: !!tableRow,
                                    tableHeader: !!tableHeader,
                                    tableCell: !!tableCell,
                                    extensionsCount: extensions.length
                                });
                            }

                            // Safety guard: if core extensions are missing, render raw content or nothing to avoid RangeError
                            if (!starterKit) {
                                return <div className='editor max-w-[920px] mx-auto py-24'>Error loading content editor extensions. Rendering disabled to prevent crash.</div>;
                            }

                            return (
                                <div className='editor max-w-[920px] flex flex-col mx-auto px-0 mob:px-8  md:px-16 py-24 lg:px-0 md:py-32'
                                    dangerouslySetInnerHTML={{
                                        __html: generateHTML(blog.content as JSONContent, extensions)
                                    }}
                                />
                            );
                        })()}
                    </>
                }
            </div>
        </div>
    )
}
