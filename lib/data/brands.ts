import 'server-only';
import { unstable_cache } from 'next/cache'
import { prisma } from '../prisma'

export const getBrands = unstable_cache(
    async () => {
        const brands = await prisma.carBrand.findMany({
            where: { deletedAt: null },
            include: {
                _count: {
                    select: {
                        cars: {
                            where: {
                                deletedAt: null
                            }
                        }
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        })

        return brands
    },
    ['get-brands'],
    {
        tags: ['brand'],
        revalidate: 60, // optional TTL
    }
)

export const getBrand = (id: string) =>
    unstable_cache(
        async () => {
            return await prisma.carBrand.findFirst({ where: { id, deletedAt: null } })
        },
        [`get-brand-${id}`],
        {
            tags: [`brand-${id}`],
            revalidate: 60 * 10, // optional TTL
        }
    )()

export const getBrandBySlug = (slug: string) =>
    unstable_cache(
        async () => {
            return await prisma.carBrand.findFirst({ where: { slug, deletedAt: null } })
        },
        [`get-brand-slug-${slug}`],
        {
            tags: [`brand-slug-${slug}`],
            revalidate: 60 * 10, // optional TTL
        }
    )()