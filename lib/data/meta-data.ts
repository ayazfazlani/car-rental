import { unstable_cache } from "next/cache";
import { PAGE_METATAGS } from "../constants";
import { prisma } from "../prisma";

export const getMetaData = (page: PAGE_METATAGS) =>
    unstable_cache(
        async () => {
            return prisma.metadata.findFirst({ where: { page } });
        },
        [`meta-data-${page}`],
        {
            tags: [`meta-data-${page}`],
            revalidate: 60,
        }
    )();
