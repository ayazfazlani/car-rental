import { CarCategory, CarCategoryType, Prisma, PrismaClient } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library";

const CATEGORIES: (Omit<CarCategory,
    'createdAt' | 'updatedAt' | 'deletedAt' | 'seo_title' | 'seo_description' | 'seo_keywords' | 'canonical'>)[] = [
        {
            id: "cmk2p11gj000g830qyjyv0j6x",
            type: "CONVERTIBLE",
            name: "Convertible",
            slug: "convertible",
            description: "Cars with retractable roofs that offer an open-air driving experience.",
            iconUrl: null,
            isActive: true,
            showOnHome: true,
        },
        {
            id: "cmk2p11gf000f830qblfykbdj",
            type: "COUPE",
            name: "Coupe",
            slug: "coupe",
            description: "Two-door cars designed for a sporty look and agile performance.",
            iconUrl: null,
            isActive: true,
            showOnHome: true,
        },
        {
            id: "cmk2p11fy000e830qczcp7f28",
            type: "LUXURY",
            name: "Luxury",
            slug: "luxury",
            description: "Premium vehicles focused on comfort, refinement, and advanced features.",
            iconUrl: null,
            isActive: true,
            showOnHome: true,
        },
        {
            id: "cmk2p11eq000b830qxi6cpir4",
            type: "SEDAN",
            name: "Sedan",
            slug: "sedan",
            description: "Four-door cars offering a balance of comfort, efficiency, and practicality.",
            iconUrl: null,
            isActive: true,
            showOnHome: true,
        },
        {
            id: "cmk2p11fl000d830q336hovs3",
            type: "SPORTS",
            name: "Sports",
            slug: "sports",
            description: "High-performance cars built for speed, handling, and driving excitement.",
            iconUrl: null,
            isActive: true,
            showOnHome: true,
        },
        {
            id: "cmk2p11fe000c830qpq2tcntu",
            type: "SUV",
            name: "SUV",
            slug: "suv",
            description: "Versatile vehicles with higher ground clearance and ample passenger space.",
            iconUrl: null,
            isActive: true,
            showOnHome: true,
        }
    ];

export async function createCategories(prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) {
    for (const category of CATEGORIES) {
        await prisma.carCategory.create({
            data: category,
        });
    }
    console.log(`✅ Created ${CATEGORIES.length} car categories`);
}
