import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import SearchComponent from '@/components/search/search';
import { getBrands } from '@/lib/data/brands';
import { getCategory, getCategoryBySlug } from '@/lib/data/category';
import { getActiveContacts } from '@/lib/data/contact';
import Translated from '@/components/translated';
import { stripHtml } from '@/lib/utils';

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        return {
            title: 'Category Not Found',
        };
    }

    return {
        title: `${category.seo_title || category.name} | Luxus Car Rental`,
        description: category.seo_description || stripHtml(category.description || '') || `Browse our ${category.name} rental vehicles`,
        keywords: category.seo_keywords || category.name,
        alternates: {
            canonical: category.canonical || `${process.env.NEXT_PUBLIC_APP_URL || 'https://luxuscarrental.com'}/categories/${category.slug}`,
        },
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            title: `${category.seo_title || category.name} | Luxus Car Rental`,
            description: category.seo_description || stripHtml(category.description || '') || `Browse our ${category.name} rental vehicles`,
        },
    };
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    const brands = getBrands();
    const categories = getCategory();
    const contacts = getActiveContacts();

    return (
        <div className='bg-background'>
            <Header />
            <div className="mx-auto px-4 md:pb-8 pt-2">
                <div className="md:mb-1">
                    <h1 className="text-base md:text-2xl font-bold text-foreground capitalize">
                        {category.name}
                    </h1>
                    <p className="text-muted-foreground text-base hidden sm:block">
                        <Translated key="search.browseSelection" fallback="Browse our premium selection of rental vehicles" />
                    </p>
                </div>
                <SearchComponent
                    brands={brands}
                    categories={categories}
                    contacts={contacts}
                    defaultFilters={{ categoryId: category.id }}
                />
            </div>
            <Footer />
        </div>
    )
}