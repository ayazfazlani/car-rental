import 'server-only';
import { unstable_cache } from 'next/cache'
import { prisma } from '../prisma'
import { CarStatus } from '@prisma/client';

export const getCarById = unstable_cache(
    async (id: string) => {
        const car = await prisma.car.findUnique({
            where: {
                id: id,
                deletedAt: null,
            },
            include: {
                images: true,
                pricing: true,
                carFeatures: true,
                carFaqs: true,
                rentalTerms: true
            },
        })

        return car
    },
    ['cars-by-id'],
    {
        tags: ['cars'],
        revalidate: 60, // optional TTL
    }
)

export const getCarDetails = unstable_cache(
    async (id: string) => {
        const car = await prisma.car.findFirst({
            where: {
                OR: [
                    { id: id },
                    { slug: id },
                ],
                status: CarStatus.ACTIVE,
                deletedAt: null,
            },
            include: {
                brand: true,
                category: true,
                images: {
                    where: {
                        deletedAt: null,
                    },
                    orderBy: {
                        displayOrder: "asc",
                    },
                },
                reviews: {
                    where: {
                        isPublished: true,
                        deletedAt: null,
                    },
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 10,
                },
                pricing: {
                    where: {
                        isActive: true,
                        deletedAt: null,
                        OR: [{ validFrom: null }, { validFrom: { lte: new Date() } }],
                        AND: [
                            {
                                OR: [{ validUntil: null }, { validUntil: { gte: new Date() } }],
                            },
                        ],
                    },
                },
                dealer: true,
                carFeatures: true,
                carFaqs: true,
                rentalTerms: true
            },
        });

        if (!car) return null

        const reviews = car?.reviews || [];
        const averageRating =
            reviews?.length > 0
                ? reviews?.reduce((sum, review) => sum + review.rating, 0) /
                reviews?.length
                : 0;

        return {
            ...car,
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: reviews.length,
        }
    },
    ['cars-details'],
    {
        tags: ['cars'],
        revalidate: 60, // optional TTL
    }
)