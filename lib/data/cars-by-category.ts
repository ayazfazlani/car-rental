import 'server-only';
import { unstable_cache } from 'next/cache'
import { prisma } from '../prisma'
import { Prisma } from '@prisma/client';

export const getCarsByCategory = unstable_cache(
    async (where: Prisma.CarCategoryWhereInput, take: number) => {
        const carsByCategory = await prisma.carCategory.findMany({
            where,
            include: {
                cars: {
                    where: {
                        deletedAt: null
                    },
                    take,
                    include: {
                        images: true,
                    },
                }
            }
        })

        return carsByCategory
    },
    ['cars-by-category'],
    {
        tags: ['cars'],
        revalidate: 60, // optional TTL
    }
)