import { AuthenticatedRequest, withAdmin } from "@/lib/middleware";
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils";
import { metaDataSchema } from "@/lib/validations";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

async function getMetadata(req: AuthenticatedRequest) {
    try {
        const metadata = await prisma.metadata.findMany();

        return NextResponse.json(successResponse(metadata));
    } catch (error: any) {
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to fetch metadata"),
            { status: 500 }
        );
    }
}

async function createOrUpdateMetadata(req: AuthenticatedRequest) {
    try {
        const body = await req.json();
        const validatedData = metaDataSchema.parse(body);

        const exists = await prisma.metadata.findFirst({
            where: { page: validatedData.page },
        });

        if (exists) {
            const metadata = await prisma.metadata.update({
                where: { id: exists.id },
                data: {
                    title: validatedData.title,
                    description: validatedData.description,
                    keywords: validatedData.keywords,
                    canonical: validatedData.canonical,
                },
            });
            revalidateTag(`meta-data-${validatedData.page}`, 'layout');
            return NextResponse.json(successResponse(metadata));
        }
        const metadata = await prisma.metadata.create({
            data: {
                title: validatedData.title,
                description: validatedData.description,
                keywords: validatedData.keywords,
                page: validatedData.page,
                canonical: validatedData.canonical,
            },
        });

        revalidateTag(`meta-data-${validatedData.page}`, 'layout');
        return NextResponse.json(successResponse(metadata));
    } catch (error) {
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to create or update metadata"),
            { status: 500 }
        );
    }
}

async function deleteMetadata(req: AuthenticatedRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = searchParams.get("page");

        if (!page) {
            return NextResponse.json(
                errorResponse("VALIDATION_ERROR", "Page parameter is required"),
                { status: 400 }
            );
        }

        await prisma.metadata.deleteMany({
            where: { page },
        });

        revalidateTag(`meta-data-${page}`, 'layout');
        return NextResponse.json(successResponse(null, "Metadata deleted successfully"));
    } catch (error) {
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to delete metadata"),
            { status: 500 }
        );
    }
}



export const GET = withAdmin(getMetadata);
export const POST = withAdmin(createOrUpdateMetadata);
export const DELETE = withAdmin(deleteMetadata);