import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getTranslations } from "next-intl/server";
import { Metadata } from 'next';
import Link from 'next/link';
import { getBrands } from '@/lib/data/brands';
import { getMetaData } from '@/lib/data/meta-data';
import { formatMetadata } from '@/lib/utils';
import { PAGE_METATAGS } from "@/lib/constants";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
    const meta = await getMetaData(PAGE_METATAGS.BRANDS)
    return formatMetadata(meta)
}

export default async function BrandsPage({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations('common');
    const brands = await getBrands();

    return (
        <>
            <Header />
            <main className="container mx-auto px-6 lg:px-12 py-12">
                <div className="mb-12">
                    <h1 className="text-3xl font-bold mb-2">
                        Car Brands
                    </h1>
                    <p className="text-muted-foreground">
                        Explore our premium selection of car brands
                    </p>
                </div>

                {brands.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No brands available</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {brands.map((brand) => (
                            <Link
                                key={brand.id}
                                href={`/${locale}/cars?brandId=${brand.id}`}
                                className="group"
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
                                        <p className="text-sm text-blue-600 mt-3 font-medium">
                                            {brand._count.cars} {brand._count.cars === 1 ? 'car' : 'cars'} available
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}