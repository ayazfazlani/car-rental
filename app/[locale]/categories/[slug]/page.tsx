import { redirect } from 'next/navigation';
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
    const category = await prisma.carCategory.findFirst({ where: { slug, deletedAt: null } })

    if (!category) {
        return {
            title: 'Category Not Found',
        };
    }

    return {
        title: `${category.seo_title || category.name} | Luxus Car Rental`,
        description: category.seo_description || `Browse our ${category.name} rental vehicles`,
        keywords: category.seo_keywords || category.name,
        openGraph: {
            title: `${category.seo_title} | Luxus Car Rental`,
            description: category.seo_description || `Browse our ${category.name} rental vehicles`,
        },
    };
}

export default async function CategoryPage({ params }: Props) {
    const { locale, slug } = await params;
    const category = await await prisma.carCategory.findFirst({ where: { slug, deletedAt: null } })

    if (!category) {
        return redirect(`/${locale}/cars`);
    }

    return (
        <>
            <Header />
            <main className="container mx-auto px-6 lg:px-12 py-12">
                <Link
                    key={category.id}
                    href={`/${locale}/cars?categoryId=${category.id}`}
                    className="group flex items-center justify-center"
                >
                    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 h-full flex flex-col justify-between cursor-pointer">
                        {category.iconUrl && (
                            <div className="mb-4 h-20 flex items-center justify-center">
                                <img
                                    src={category.iconUrl}
                                    alt={category.name}
                                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform"
                                />
                            </div>
                        )}
                        <div>
                            <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                                {category.name}
                            </h3>
                            {category.description && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                    {category.description}
                                </p>
                            )}
                        </div>
                    </div>
                </Link>
            </main >
            <Footer />
        </>
    )
}