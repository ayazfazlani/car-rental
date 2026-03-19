import { HomeHero } from '@prisma/client';
import { prisma } from './prisma';
import { revalidateTag, unstable_cache } from 'next/cache'

export const getHomeHero = unstable_cache(
    async () => {
        const hero = await prisma.homeHero.findFirst();
        return hero;
    },
    ['get-home-hero'],
    {
        tags: ['home-hero'],
        revalidate: 60, // optional TTL
    }
)

export async function upsertHomeHero(payload: Partial<HomeHero>) {
    // Try to find existing record
    const existing = await prisma.homeHero.findFirst();
    if (existing) {
        return prisma.homeHero.update({ where: { id: existing.id }, data: payload });
    }
    const newHero = await prisma.homeHero.create({ data: payload as any });

    revalidateTag('home-hero', 'max')

    return newHero
}