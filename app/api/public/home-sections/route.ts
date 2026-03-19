import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/utils";

// GET - List all visible sections in order
export async function GET() {
    try {
        const sections = await prisma.homePageSection.findMany({
            where: {
                isVisible: true,
                deletedAt: null,
            },
            orderBy: {
                order: "asc",
            },
        });

        return NextResponse.json(
            successResponse(sections),
            {
                headers: {
                    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
                },
            }
        );
    } catch (error: any) {
        console.error("Get home sections error:", error);
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to fetch sections"),
            { status: 500 }
        );
    }
}
