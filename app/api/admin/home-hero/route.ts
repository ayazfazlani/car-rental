import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthenticatedRequest, withAdmin } from '@/lib/middleware';
import { errorResponse, successResponse } from '@/lib/utils';
import { saveFile, validateFile } from '@/lib/upload';
import { homeHeroSchema } from '@/lib/validations';
import { revalidateTag } from 'next/cache';

export async function GET() {
    const hero = await prisma.homeHero.findFirst();
    return NextResponse.json({ data: hero });
}

const saveOrUpdate = async (request: Request) => {
    try {
        const body = await request.json();
        const validated = homeHeroSchema.parse(body);
        const existing = await prisma.homeHero.findFirst();
        let result;
        if (existing) {
            result = await prisma.homeHero.update({ where: { id: existing.id }, data: validated });
        } else {
            result = await prisma.homeHero.create({ data: validated });
        }
        revalidateTag('home-hero', 'max');

        return NextResponse.json({ data: result });
    } catch (err) {
        return NextResponse.json({ message: 'Error', error: String(err) }, { status: 500 });
    }
}


async function uploadImage(
    req: AuthenticatedRequest,
) {
    try {

        const formData = await req.formData();
        const files = formData.getAll("image") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                errorResponse("VALIDATION_ERROR", "No image provided"),
                { status: 400 }
            );
        }

        const file = files[0];

        const validation = validateFile(file);
        if (!validation.valid) {
            return NextResponse.json(
                errorResponse("VALIDATION_ERROR", validation.error || "Invalid file"),
                { status: 400 }
            );
        }

        const { url } = await saveFile(file, 'home-hero');

        let result;
        const existing = await prisma.homeHero.findFirst();
        if (existing) {
            result = await prisma.homeHero.update({ where: { id: existing.id }, data: { imageUrl: url } });
        } else {
            result = await prisma.homeHero.create({ data: { imageUrl: url } });
        }
        revalidateTag('home-hero', 'max');
        return NextResponse.json(
            successResponse(
                result,
                `image uploaded successfully`
            ),
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Upload images error:", error);
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to upload images"),
            { status: 500 }
        );
    }
}

export const PUT = withAdmin(saveOrUpdate);
export const POST = withAdmin(saveOrUpdate);
export const PATCH = withAdmin(uploadImage);
