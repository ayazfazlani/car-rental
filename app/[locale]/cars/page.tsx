import { Header } from '@/components/Header'
import SearchComponent from '@/components/search/search'
import { getBrand, getBrands } from '@/lib/data/brands'
import { getCategory, getCategoryById } from '@/lib/data/category'
import { getActiveContacts } from '@/lib/data/contact'
import { Footer } from '@/components/Footer'
import Translated from '@/components/translated'
import { Metadata } from 'next';
import { PAGE_METATAGS } from '@/lib/constants';
import { getMetaData } from '@/lib/data/meta-data';
import { formatMetadata } from '@/lib/utils';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const { brandId, hasChauffeur } = await searchParams;
    
    // Use RENT_WITH_DRIVER metadata when hasChauffeur filter is active
    const metaPage = hasChauffeur === 'true' ? PAGE_METATAGS.RENT_WITH_DRIVER : PAGE_METATAGS.CARS;
    const meta = await getMetaData(metaPage)
    
    // Fallback to CARS metadata if RENT_WITH_DRIVER metadata not set
    const finalMeta = meta || (hasChauffeur === 'true' ? await getMetaData(PAGE_METATAGS.CARS) : null);
    const metaData = formatMetadata(finalMeta)
    
    let title = metaData.title;
    if (brandId && typeof brandId === 'string') {
        const brand = await getBrand(brandId)
        if (brand) {
            title = brand.name
            metaData.keywords += `, ${brand.name}`
        }
    }

    metaData.title = title

    return metaData;
}

export default function page() {
    const brands = getBrands()
    const categories = getCategory()
    const contacts = getActiveContacts();

    return (
        <div className='bg-background'>
            <Header />
            <div className="mx-auto px-4 md:pb-8 pt-2">
                <div className="md:mb-1">
                    <h1 className="text-base md:text-2xl font-bold text-foreground">
                        <Translated key="search.findYourPerfectCar" fallback="Find Your Perfect Car" />
                    </h1>
                    <p className="text-muted-foreground text-base hidden sm:block">
                        <Translated key="search.browseSelection" fallback="Browse our premium selection of rental vehicles" />
                    </p>
                </div>
                <SearchComponent
                    brands={brands}
                    categories={categories}
                    contacts={contacts}
                />
            </div>
            <Footer />
        </div>
    )
}
