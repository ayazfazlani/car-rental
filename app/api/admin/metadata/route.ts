import { AuthenticatedRequest, withAdmin } from "@/lib/middleware";
import { prisma } from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/utils";
import { metaDataSchema } from "@/lib/validations";
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
                },
            });
            return NextResponse.json(successResponse(metadata));
        }
        const metadata = await prisma.metadata.create({
            data: {
                title: validatedData.title,
                description: validatedData.description,
                keywords: validatedData.keywords,
                page: validatedData.page,
            },
        });

        return NextResponse.json(successResponse(metadata));
    } catch (error) {
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to create or update metadata"),
            { status: 500 }
        );
    }
}



export const GET = withAdmin(getMetadata);
export const POST = withAdmin(createOrUpdateMetadata);