import "server-only";
import { prisma } from "../prisma"
import { unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";

export const getBlogs = unstable_cache(
    async (start: number, limit: number, search?: string) => {
        const where: Prisma.BlogWhereInput = { draft: false }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { info: { contains: search, mode: 'insensitive' } },
                { tags: { hasSome: search.split(' ') } },
                { keywords: { hasSome: search.split(' ') } },
            ];
        }

        const blogs = await prisma.blog.findMany({
            where,
            take: limit,
            skip: start,
            orderBy: {
                createdAt: 'desc',
            },
        })
        const total = await prisma.blog.count({ where })
        return { blogs, total }
    },
    ['blogs'],
    {
        tags: ['blog'],
        revalidate: 60, // optional TTL
    }
)

export const getBlog = unstable_cache(
    async (slug: string) => {
        return prisma.blog.findFirst({
            where: {
                slug: slug,
                draft: false,
            }
        })
    },
    ['blog'],
    {
        tags: ['blog'],
        revalidate: 60, // optional TTL
    }
)

export const getRelatedBlogs = unstable_cache(
    async (currentSlug: string, tags: string[], limit: number = 3) => {
        const where: Prisma.BlogWhereInput = {
            draft: false,
            slug: { not: currentSlug },
        }
        if (tags && tags.length > 0) {
            where.tags = { hasSome: tags }
        }

        const blogs = await prisma.blog.findMany({
            where,
            take: limit,
            orderBy: { createdAt: 'desc' },
        })

        // If not enough tag-matched blogs, fill with latest
        if (blogs.length < limit) {
            const existingSlugs = [currentSlug, ...blogs.map(b => b.slug)]
            const extras = await prisma.blog.findMany({
                where: {
                    draft: false,
                    slug: { notIn: existingSlugs },
                },
                take: limit - blogs.length,
                orderBy: { createdAt: 'desc' },
            })
            blogs.push(...extras)
        }

        return blogs
    },
    ['related-blogs'],
    {
        tags: ['blog'],
        revalidate: 60,
    }
)