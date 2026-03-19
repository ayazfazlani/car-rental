import 'server-only';
import { unstable_cache } from 'next/cache'
import { prisma } from '../prisma'

export const getCategory = unstable_cache(async () => {
    const category = await prisma.carCategory.findMany({
        where: { deletedAt: null },
    })

    return category
},
    ['get-category'],
    {
        tags: ['category'],
        revalidate: 60, // optional TTL
    }
)

export const getCategoryById = (id: string) =>
    unstable_cache(
        async () => {
            return await prisma.carCategory.findFirst({ where: { id, deletedAt: null } })
        },
        [`get-category-${id}`],
        {
            tags: [`category-${id}`],
            revalidate: 60 * 10, // optional TTL
        }
    )()

export const getCategoryBySlug = (slug: string) =>
    unstable_cache(
        async () => {
            return await prisma.carCategory.findFirst({ where: { slug, deletedAt: null } })
        },
        [`get-category-slug-${slug}`],
        {
            tags: [`category-slug-${slug}`],
            revalidate: 60 * 10, // optional TTL
        }
    )()

export const getCategoriesWithCount = unstable_cache(async () => {
    const category = await prisma.carCategory.findMany({
        where: { deletedAt: null },
        include: {
            _count: {
                select: {
                    cars: true
                }
            }
        }
    })

    return category
},
    ['get-category-with-count'],
    {
        tags: ['category-with-count'],
        revalidate: 60, // optional TTL
    }
)