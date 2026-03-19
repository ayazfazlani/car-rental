import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getTranslations } from "next-intl/server";
import { Metadata } from 'next';
import { PAGE_METATAGS } from '@/lib/constants';
import { getMetaData } from '@/lib/data/meta-data';
import { formatMetadata } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
    const meta = await getMetaData(PAGE_METATAGS.ABOUT)
    return formatMetadata(meta)
}

export default async function AboutPage() {
    const t = await getTranslations('footer');

    return (
        <>
            <Header />
            <main className="container mx-auto px-6 lg:px-12 py-12">
                <h1 className="text-2xl font-bold mb-4">
                    {t("aboutPage.title")}
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                    {t("aboutPage.content")}
                </p>
            </main>
            <Footer />
        </>
    );
}
