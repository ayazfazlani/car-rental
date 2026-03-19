import { NextRequest, NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/utils";

async function handler(req: AuthenticatedRequest) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user!.userId,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        adminProfile: {
          select: {
            employeeId: true,
            department: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(errorResponse("NOT_FOUND", "User not found"), {
        status: 404,
      });
    }

    return NextResponse.json(successResponse(user));
  } catch (error: any) {
    console.error("Get user error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to fetch user"),
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);
