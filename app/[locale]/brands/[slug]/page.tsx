import { Header } from '@/components/Header'
import SearchComponent from '@/components/search/search'
import { getBrandBySlug, getBrands } from '@/lib/data/brands'
import { stripHtml } from '@/lib/utils'
import { getCategory } from '@/lib/data/category'
import { getActiveContacts } from '@/lib/data/contact'
import { Footer } from '@/components/Footer'
import Translated from '@/components/translated'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

type Props = {
    params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const brand = await getBrandBySlug(slug);
    
    if (!brand) return {};

    const title = `${brand.seo_title || brand.name} | Luxus Car Rental`;
    const description = brand.seo_description || stripHtml(brand.description || '') || `Rent premium ${brand.name} cars in Dubai.`;

    return {
        title,
        description,
        keywords: brand.seo_keywords || brand.name,
        alternates: {
            canonical: brand.canonical || `${process.env.NEXT_PUBLIC_APP_URL || 'https://luxuscarrental.com'}/brands/${brand.slug}`,
        },
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            title: brand.seo_title || brand.name,
            description,
            images: brand.logoUrl ? [brand.logoUrl] : [],
        }
    }
}

export default async function BrandSlugPage({ params }: Props) {
    const { slug } = await params;
    const brand = await getBrandBySlug(slug);

    if (!brand) {
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
                        {brand.name}
                    </h1>
                    <div className="text-muted-foreground text-base hidden sm:block">
                        <Translated key="search.browseSelection" fallback="Browse our premium selection of rental vehicles" />
                    </div>
                </div>
                <SearchComponent
                    brands={brands}
                    categories={categories}
                    contacts={contacts}
                    defaultFilters={{ brandId: brand.id }}
                />
            </div>
            <Footer />
        </div>
    )
}