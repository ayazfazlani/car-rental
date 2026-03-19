import 'server-only';
import { unstable_cache } from 'next/cache'
import { prisma } from '../prisma'

export const getFaqItems = unstable_cache(
    async () => {
        const items = await prisma.faq.findMany({ where: { isEnabled: true } });
        return items;
    },
    ['get-faq-items'],
    {
        tags: ['faq'],
        revalidate: 60,
    }
)

export const getAllFaqItems = unstable_cache(
    async () => {
        const items = await prisma.faq.findMany();
        return items;
    },
    ['get-all-faq-items'],
    {
        tags: ['faq'],
        revalidate: 60,
    }
)
