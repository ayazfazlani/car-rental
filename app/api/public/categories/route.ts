import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.carCategory.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        type: true,
        name: true,
        slug: true,
        iconUrl: true,
        description: true,
      },
    });

    return NextResponse.json(successResponse(categories));
  } catch (error: any) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to fetch categories"),
      { status: 500 }
    );
  }
}
