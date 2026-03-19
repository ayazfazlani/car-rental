import 'server-only';
import { unstable_cache } from 'next/cache'
import { prisma } from '../prisma'

export const getCarsByBrands = unstable_cache(
    async (take: number) => {
        const carsByBrands = await prisma.carBrand.findMany({
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

        return carsByBrands
    },
    ['cars-by-brands'],
    {
        tags: ['cars'],
        revalidate: 60, // optional TTL
    }
)