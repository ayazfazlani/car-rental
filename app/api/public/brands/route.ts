import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const brands = await prisma.carBrand.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        description: true,
        _count: {
          select: {
            cars: true,
          },
        },
      },
    });

    return NextResponse.json(successResponse(brands));
  } catch (error: any) {
    console.error("Get brands error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to fetch brands"),
      { status: 500 }
    );
  }
}
