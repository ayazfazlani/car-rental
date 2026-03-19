import 'server-only';
import { prisma } from "../prisma";
import { unstable_cache } from 'next/cache'

export const getActiveContacts = unstable_cache(
    async () => {
        const contact = await prisma.contact.findMany({ where: { enabled: true } });
        return contact
    },
    ['get-active-contact'],
    {
        tags: ['contact'],
        revalidate: 60, // optional TTL
    }
)