import { generateHTML } from '@tiptap/html/server';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Metadata } from 'next';
import { JSONContent } from '@tiptap/react';
import { stripHtml } from '@/lib/utils';

// Tiptap Extensions (should match what's used in Admin/Blog)
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

async function getPage(slug: string) {
    return await prisma.page.findUnique({
        where: {
            slug,
            isPublished: true,
            deletedAt: null,
        },
    });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { slug } = await params;
    const page = await getPage(slug);

    if (!page) {
        return { title: 'Page Not Found' };
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://luxuscarrental.com';

    return {
        title: page.seo_title || page.title,
        description: page.seo_description || page.excerpt || stripHtml(typeof page.content === 'string' ? page.content : ''),
        keywords: page.seo_keywords || '',
        alternates: {
            canonical: page.canonical || `${baseUrl}/${slug}`, // Note: Removal of locale from canonical as requested
            languages: {
                en: `${baseUrl}/en/${slug}`,
                ar: `${baseUrl}/ar/${slug}`,
            }
        },
        openGraph: {
            title: page.seo_title || page.title,
            description: page.seo_description || page.excerpt || '',
            type: 'website'
        },
    };
}

export default async function CustomPage({ params }: { params: Params }) {
    const { slug } = await params;
    const page = await getPage(slug);

    if (!page) {
        return notFound();
    }

    let htmlContent = '';

    if (page.content) {
        try {
            const extensions = [
                StarterKit.configure({
                    heading: { levels: [1, 2, 3] },
                }),
                LinkExtension.configure({
                    HTMLAttributes: {
                        class: 'tiptap-link',
                    },
                }),
                TipTapImage.configure({
                    HTMLAttributes: {
                        class: 'rounded-lg my-4 mx-auto',
                    },
                }),
                Table.configure({ resizable: true }),
                TableRow,
                TableHeader,
                TableCell,
            ];

            if (typeof page.content === 'object' && page.content !== null) {
                htmlContent = generateHTML(page.content as JSONContent, extensions);
            } else if (typeof page.content === 'string') {
                htmlContent = page.content;
            }
        } catch (error) {
            console.error(`[Tiptap Error] Failed to generate HTML for page: ${slug}`, error);
            htmlContent = typeof page.content === 'string' ? page.content : '<p>Error loading content.</p>';
        }
    }

    return (
        <div className='min-h-screen bg-background'>
            <Header />
            <main className='py-16 max-w-4xl mx-auto px-6'>
                <h1 className='text-4xl font-bold mb-8'>{page.title}</h1>
                <div 
                    className='prose prose-slate max-w-none dark:prose-invert editor'
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </main>
            <Footer />
        </div>
    );
}
