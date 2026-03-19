import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionRenderer } from "@/components/SectionRenderer";
import { getHomePageSections } from "@/lib/data/sections";
import { Metadata } from 'next';
import { PAGE_METATAGS } from '@/lib/constants';
import { getMetaData } from '@/lib/data/meta-data';
import { formatMetadata } from '@/lib/utils';


export async function generateMetadata(): Promise<Metadata> {
  const meta = await getMetaData(PAGE_METATAGS.HOME)
  return formatMetadata(meta)
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const sections = await getHomePageSections();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {sections.map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            locale={locale}
          />
        ))}
      </main>
      <Footer />
    </div>
  );
}
