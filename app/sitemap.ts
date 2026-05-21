import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { METADATA_BASE_URL } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = METADATA_BASE_URL;

    // Helper to generate alternate links for a given path
    const getSitemapEntry = (path: string, lastModified: Date, changeFrequency: any, priority: number) => {
        const normalizedPath = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
        const locales = ['en', 'ar'];
        
        // Return an array of entries, one for each locale.
        // Google supports single url with alternates, or multiple. Next-intl recommends
        // outputting the main URL for the default locale, and defining alternates.
        
        return locales.map(locale => ({
            url: `${baseUrl}/${locale}${normalizedPath}`,
            lastModified,
            changeFrequency,
            priority,
        }));
    };

    // Fetch all active cars
    const cars = await prisma.car.findMany({
        where: {
            status: 'ACTIVE',
            deletedAt: null,
        },
        select: {
            slug: true,
            updatedAt: true,
        },
    });

    // Fetch all active categories
    const categories = await prisma.carCategory.findMany({
        where: {
            isActive: true,
            deletedAt: null,
        },
        select: {
            id: true,
            slug: true,
            updatedAt: true,
        },
    });

    // Fetch all active brands
    const brands = await prisma.carBrand.findMany({
        where: {
            isActive: true,
            deletedAt: null,
        },
        select: {
            id: true,
            slug: true,
            updatedAt: true,
        },
    });

    // Fetch all active blog posts
    const blogs = await prisma.blog.findMany({
        where: {
            draft: false,
        },
        select: {
            id: true,
            slug: true,
            updatedAt: true,
        },
    });

    // Static routes
    const staticRoutes = [
        ...getSitemapEntry('/', new Date(), 'daily', 1),
        ...getSitemapEntry('/cars', new Date(), 'daily', 0.9),
        ...getSitemapEntry('/brands', new Date(), 'weekly', 0.8),
        ...getSitemapEntry('/categories', new Date(), 'weekly', 0.8),
        ...getSitemapEntry('/blog', new Date(), 'weekly', 0.7),
        ...getSitemapEntry('/company/about', new Date(), 'monthly', 0.7),
        ...getSitemapEntry('/company/contact', new Date(), 'monthly', 0.7),
        ...getSitemapEntry('/legal/privacy-policy', new Date(), 'yearly', 0.5),
        ...getSitemapEntry('/legal/terms-conditions', new Date(), 'yearly', 0.5),
        ...getSitemapEntry('/legal/terms-of-use', new Date(), 'yearly', 0.5),
    ];

    // Car URLs
    const carUrls = cars.flatMap((car) => 
        getSitemapEntry(`/cars/${car.slug}`, car.updatedAt, 'weekly', 0.8)
    );

    // Category URLs
    const categoryUrls = categories.flatMap((category) => 
        getSitemapEntry(`/categories/${category.slug}`, category.updatedAt, 'weekly', 0.7)
    );

    // Brand URLs
    const brandUrls = brands.flatMap((brand) => 
        getSitemapEntry(`/brands/${brand.slug}`, brand.updatedAt, 'weekly', 0.7)
    );

    // Blog URLs
    const blogUrls = blogs.flatMap((blog) => 
        getSitemapEntry(`/blog/${blog.slug}`, blog.updatedAt, 'weekly', 0.6)
    );

    return [...staticRoutes, ...carUrls, ...categoryUrls, ...brandUrls, ...blogUrls];
}