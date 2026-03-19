import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/utils";
import { CarStatus } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ carId: string }> }
) {
  try {
    const { carId } = await params;
    const car = await prisma.car.findFirst({
      where: {
        OR: [
          { id: carId },
          { slug: carId },
        ],
        status: CarStatus.ACTIVE,
        deletedAt: null,
      },
      include: {
        brand: true,
        category: true,
        images: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            displayOrder: "asc",
          },
        },
        reviews: {
          where: {
            isPublished: true,
            deletedAt: null,
          },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
        pricing: {
          where: {
            isActive: true,
            deletedAt: null,
            OR: [{ validFrom: null }, { validFrom: { lte: new Date() } }],
            AND: [
              {
                OR: [{ validUntil: null }, { validUntil: { gte: new Date() } }],
              },
            ],
          },
        },
      },
    });

    if (!car) {
      return NextResponse.json(errorResponse("NOT_FOUND", "Car not found"), {
        status: 404,
      });
    }

    // Calculate average rating
    const reviews = car.reviews;
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return NextResponse.json(
      successResponse({
        ...car,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: reviews.length,
      })
    );
  } catch (error: any) {
    console.error("Get car error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to fetch car"),
      { status: 500 }
    );
  }
}
