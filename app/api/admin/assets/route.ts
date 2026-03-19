import { AuthenticatedRequest, withAuth } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { saveAsset } from "@/lib/upload";
import { errorResponse, successResponse } from "@/lib/utils";
import { NextResponse } from "next/server";

async function getAssets(req: AuthenticatedRequest) {
    try {
        const assets = await prisma.asset.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json(successResponse(assets));
    } catch (error) {
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to fetch assets"),
            { status: 500 }
        );
    }
}

async function createAsset(req: AuthenticatedRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        if (!file || file.size === 0) {
            return NextResponse.json(
                errorResponse(
                    "VALIDATION_ERROR",
                    "Invalid file"
                ),
                { status: 400 }
            );
        }

        const { url, fileName } = await saveAsset(file);

        const asset = await prisma.asset.create({
            data: {
                name: file.name || fileName,
                url,
            },
        });

        return NextResponse.json(
            successResponse(asset),
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to create asset"),
            { status: 500 }
        );
    }
}

export const GET = withAuth(getAssets);
export const POST = withAuth(createAsset);