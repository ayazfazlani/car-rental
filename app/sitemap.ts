import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://luxuscarrental.com';

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

    // Static routes
    const staticRoutes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/cars`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/brands`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/categories`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/company/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/company/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/legal/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/legal/terms-conditions`,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/legal/terms-of-use`,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 0.5,
        },
    ];

    // Car URLs
    const carUrls = cars.map((car) => ({
        url: `${baseUrl}/cars/${car.slug}`,
        lastModified: car.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Category URLs
    const categoryUrls = categories.map((category) => ({
        url: `${baseUrl}/categories/${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Brand URLs
    const brandUrls = brands.map((brand) => ({
        url: `${baseUrl}/brands/${brand.slug}`,
        lastModified: brand.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...staticRoutes, ...carUrls, ...categoryUrls, ...brandUrls];
}