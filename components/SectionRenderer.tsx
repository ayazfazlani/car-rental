'use server';

import { Suspense } from 'react';
import { HomePageSection, HomePageSectionType } from '@prisma/client';
import { Hero } from './hero/hero';
import { FaqSection } from './faq-section';
import { TestimonialsSection } from './testimonials-section';
import HomeBrands from './brands/brands';
import { CarCategoriesMap } from './listing/category-map';
import { CarFilterdSection } from './listing/cars-filtered-section';
import { CarSectionSkeleton } from './listing/cars-skeleton';
import { getFaqItems } from '@/lib/data/faq';
import { BlogSection } from './blog/BlogSection';
import FaqSchema from './seo/FaqSchema';

interface SectionRendererProps {
    section: HomePageSection;
    locale: string;
}

export async function SectionRenderer({ section, locale }: SectionRendererProps) {
    const config = section.config as any || {};

    try {
        switch (section.type) {
            case HomePageSectionType.HERO:
                return <Hero locale={locale} />;

            case HomePageSectionType.AFFORDABLE_CARS:
                return (
                    <Suspense fallback={<CarSectionSkeleton />}>
                        <CarFilterdSection
                            query={{
                                affordable: true,
                                deletedAt: null,
                            }}
                            titleKey={config.titleKey || 'home.affordableCars'}
                            titleFallback={config.title || 'Affordable Cars'}
                            subtitleKey={config.subtitleKey || 'home.affordableCarsSubtitle'}
                            subtitleFallback={config.subtitle || 'Still looking? Here are affordable cars for you.'}
                            className={config.backgroundColor ? `bg-[${config.backgroundColor}]` : ''}
                        />
                    </Suspense>
                );

            case HomePageSectionType.RECOMMENDED_CARS:
                return (
                    <Suspense fallback={<CarSectionSkeleton />}>
                        <CarFilterdSection
                            query={{
                                recommended: true,
                                deletedAt: null,
                            }}
                            titleKey={config.titleKey || 'home.recommendedCars'}
                            titleFallback={config.title || 'Recommended Cars Just for You'}
                            subtitleKey={config.subtitleKey || 'home.recommendedCarsSubtitle'}
                            subtitleFallback={config.subtitle || 'Still looking? Here are personalized car recommendations for you.'}
                            className={config.backgroundColor ? `bg-[${config.backgroundColor}]` : 'bg-[#FBF1E7]'}
                        />
                    </Suspense>
                );

            case HomePageSectionType.BRANDS:
                const brandViewType = config.viewType || 'cards';
                return (
                    <Suspense fallback={<div className="h-64" />}>
                        <HomeBrands view={brandViewType} />
                    </Suspense>
                );

            case HomePageSectionType.CATEGORIES:
                return (
                    <Suspense fallback={<><CarSectionSkeleton /><CarSectionSkeleton /></>}>
                        <CarCategoriesMap />
                    </Suspense>
                );

            case HomePageSectionType.FAQ:
                const faqItems = await getFaqItems();
                return (
                    <>
                        <FaqSchema items={faqItems} />
                        <FaqSection items={faqItems} />
                    </>
                );

            case HomePageSectionType.TESTIMONIALS:
                return <TestimonialsSection />;

            case HomePageSectionType.BLOGS:
                return <BlogSection />;

            case 'CUSTOM':
                // Placeholder for custom sections
                return null;

            default:
                console.warn(`Unknown section type: ${section.type}`);
                return null;
        }
    } catch (error) {
        console.error(`Error rendering section ${section.type}:`, error);
        return null;
    }
}
