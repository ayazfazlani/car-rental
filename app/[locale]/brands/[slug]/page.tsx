import { redirect } from 'next/navigation';
import { getBrandBySlug } from '@/lib/data/brands';
import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { prisma } from '@/lib/prisma';

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const brand = await prisma.carBrand.findFirst({ where: { slug, deletedAt: null } })

    if (!brand) {
        return {
            title: 'Brand Not Found',
        };
    }

    return {
        title: `${brand.seo_title || brand.name} | Luxus Car Rental`,
        description: brand.seo_description || `Explore our ${brand.name} rental vehicles`,
        keywords: brand.seo_keywords || brand.name,
        openGraph: {
            title: `${brand.name} | Luxus Car Rental`,
            description: brand.description || `Explore our ${brand.name} rental vehicles`,
        },
    };
}

export default async function BrandPage({ params }: Props) {
    const { locale, slug } = await params;
    const brand = await await prisma.carBrand.findFirst({ where: { slug, deletedAt: null } })

    if (!brand) {
        return redirect(`/${locale}/cars`);
    }

    return (
        <>
            <Header />
            <main className="container mx-auto px-6 lg:px-12 py-12">
                <Link
                    key={brand.id}
                    href={`/${locale}/cars?brandId=${brand.id}`}
                    className="group flex items-center justify-center"
                >
                    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 h-full flex flex-col justify-between cursor-pointer">
                        {brand.logoUrl && (
                            <div className="mb-4 h-20 flex items-center justify-center">
                                <img
                                    src={brand.logoUrl}
                                    alt={brand.name}
                                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform"
                                />
                            </div>
                        )}
                        <div>
                            <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                                {brand.name}
                            </h3>
                            {brand.description && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                    {brand.description}
                                </p>
                            )}
                        </div>
                    </div>
                </Link>
            </main>
            <Footer />
        </>
    )
}