import { prisma } from '@/lib/prisma';
import { HomePageSection, HomePageSectionType } from '@prisma/client';

export async function getHomePageSections(): Promise<HomePageSection[]> {
    try {
        const sections = await prisma.homePageSection.findMany({
            where: {
                isVisible: true,
                deletedAt: null,
            },
            orderBy: {
                order: 'asc',
            },
        });
        return sections;
    } catch (error) {
        console.error('Error fetching home page sections:', error);
        // Return default sections on error
        return getDefaultSections();
    }
}

function getDefaultSections(): HomePageSection[] {
    // Fallback to default section order if database fetch fails
    const now = new Date();
    return [
        {
            id: '1',
            type: HomePageSectionType.HERO,
            order: 0,
            isVisible: true,
            name: 'Hero',
            name_ar: 'قسم البطل',
            config: null,
            config_ar: null,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
        },
        {
            id: '2',
            type: HomePageSectionType.AFFORDABLE_CARS,
            order: 1,
            isVisible: true,
            name: 'Affordable Cars',
            name_ar: 'السيارات الميسورة',
            config: null,
            config_ar: null,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
        },
        {
            id: '3',
            type: HomePageSectionType.RECOMMENDED_CARS,
            order: 2,
            isVisible: true,
            name: 'Recommended Cars',
            name_ar: 'السيارات الموصى بها',
            config: null,
            config_ar: null,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
        },
        {
            id: '4',
            type: HomePageSectionType.BRANDS,
            order: 3,
            isVisible: true,
            name: 'Brands',
            name_ar: 'العلامات التجارية',
            config: null,
            config_ar: null,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
        },
        {
            id: '5',
            type: HomePageSectionType.CATEGORIES,
            order: 4,
            isVisible: true,
            name: 'Categories',
            name_ar: 'فئات السيارات',
            config: null,
            config_ar: null,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
        },
        {
            id: '6',
            type: HomePageSectionType.FAQ,
            order: 5,
            isVisible: true,
            name: 'FAQ',
            name_ar: 'الأسئلة الشائعة',
            config: null,
            config_ar: null,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
        },
        {
            id: '7',
            type: HomePageSectionType.TESTIMONIALS,
            order: 6,
            isVisible: true,
            name: 'Testimonials',
            name_ar: 'الشهادات',
            config: null,
            config_ar: null,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
        },
    ];
}
