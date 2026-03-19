import { AuthenticatedRequest, withAdmin } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { deleteAsset as deleteAssetFromStorage } from "@/lib/upload";

async function getAsset(
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const asset = await prisma.asset.findUnique({ where: { id } });
        return NextResponse.json(successResponse(asset));
    } catch (error) {
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to fetch asset"),
            { status: 500 }
        );
    }
}

async function deleteAsset(
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const asset = await prisma.asset.findUnique({ where: { id } });
        if (!asset) {
            return NextResponse.json(
                errorResponse("NOT_FOUND", "Asset not found"),
                { status: 404 }
            );
        }
        await deleteAssetFromStorage(asset.url);
        await prisma.asset.delete({ where: { id } });

        return NextResponse.json(successResponse(asset));
    } catch (error) {
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to delete asset"),
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withAdmin((r) => deleteAsset(r, { params }))(req);
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withAdmin((r) => getAsset(r, { params }))(req);
}