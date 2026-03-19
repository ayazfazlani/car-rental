import 'server-only';
import { unstable_cache } from 'next/cache'
import { prisma } from '../prisma'

export const getSettings = unstable_cache(
    async () => {
        const items = await prisma.keyValuePair.findMany({ where: { deletedAt: null } });
        return items;
    },
    ['get-settings'],
    {
        tags: ['settings'],
        revalidate: 60, // optional TTL
    }
)

export const getSettingsMap = unstable_cache(
    async () => {
        const items = await prisma.keyValuePair.findMany({ where: { deletedAt: null } });
        const map: Record<string, string> = {};
        for (const it of items) map[it.key] = it.value;
        return map;
    },
    ['get-settings-map'],
    {
        tags: ['settings'],
        revalidate: 60,
    }
)
