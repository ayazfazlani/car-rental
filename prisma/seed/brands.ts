import { CarBrand, Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

const BRANDS: (Omit<CarBrand,
    'createdAt' | 'updatedAt' | 'deletedAt' | 'seo_title' | 'seo_description' | 'seo_keywords'>)[] = [
        {
            "id": "cmk2p11d60006830q451msqu9",
            "name": "Audi",
            "slug": "audi",
            "logoUrl": "/uploads/brands/audi.png",
            "description": null,
            "isActive": true,
        },
        {
            "id": "cmk2p11e50009830q3pep6toq",
            "name": "Bentley",
            "slug": "bentley",
            "logoUrl": "/uploads/brands/bentley.png",
            "description": null,
            "isActive": true,
        },
        {
            "id": "cmk2p11cu0005830q9dsvuepp",
            "name": "BMW",
            "slug": "bmw",
            "logoUrl": "/uploads/brands/bmw.png",
            "description": null,
            "isActive": true,
        },
        {
            "id": "cmk2p11cb0004830qt2vc0prl",
            "name": "Mercedes-Benz",
            "slug": "mercedes-benz",
            "logoUrl": "/uploads/brands/benz.png",
            "description": null,
            "isActive": true,
        },
        {
            "id": "cmk2p11dc0007830qb4pi0hfq",
            "name": "Porsche",
            "slug": "porsche",
            "logoUrl": "/uploads/brands/porsche.png",
            "description": null,
            "isActive": true,
        },
        {
            "id": "cmk2p11dp0008830qgvt6jwc8",
            "name": "Range Rover",
            "slug": "range-rover",
            "logoUrl": "/uploads/brands/range-rover.png",
            "description": null,
            "isActive": true,
        },
        {
            "id": "cmk2p11eg000a830q94mogv1d",
            "name": "Rolls-Royce",
            "slug": "rolls-royce",
            "logoUrl": "/uploads/brands/rr.png",
            "description": null,
            "isActive": true,
        }
    ]


export async function createBrands(prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>) {
    for (const brand of BRANDS) {
        await prisma.carBrand.create({
            data: brand,
        });
    }
    console.log(`✅ Created ${BRANDS.length} car brands`);
}