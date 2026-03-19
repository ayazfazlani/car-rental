import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getTranslations } from "next-intl/server";
import { Metadata } from 'next';
import { Link } from "@/i18n/routing";
import { getCategoriesWithCount } from '@/lib/data/category';
import { getMetaData } from '@/lib/data/meta-data';
import { formatMetadata, stripHtml } from '@/lib/utils';
import { PAGE_METATAGS } from "@/lib/constants";

import CategoriesSchema from "@/components/seo/CategoriesSchema";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
    const meta = await getMetaData(PAGE_METATAGS.CATEGORIES)
    return formatMetadata(meta)
}

export default async function CategoriesPage({ params }: Props) {
    const { locale } = await params;
    const categories = await getCategoriesWithCount();

    return (
        <div className="bg-background">
            <CategoriesSchema categories={categories} locale={locale} />
            <Header />
            <main className="container mx-auto px-6 lg:px-12 py-12">
                <div className="mb-12">
                    <h1 className="text-3xl font-bold mb-2">
                        Car Categories
                    </h1>
                    <p className="text-muted-foreground">
                        Find the perfect car type for your needs
                    </p>
                </div>

                {categories.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No categories available</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={{ pathname: "/categories/[slug]", params: { slug: category.slug } }}
                                className="group"
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
                                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                            {stripHtml(category.description || '')}
                                        </p>
                                        <p className="text-sm text-blue-600 mt-3 font-medium">
                                            {category._count.cars} {category._count.cars === 1 ? 'car' : 'cars'} available
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}