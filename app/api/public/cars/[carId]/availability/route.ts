import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ carId: string }> }
) {
  try {
    const { carId } = await params;
    const { searchParams } = new URL(request.nextUrl);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        errorResponse("VALIDATION_ERROR", "startDate and endDate are required"),
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        errorResponse("VALIDATION_ERROR", "Invalid date format"),
        { status: 400 }
      );
    }

    if (end < start) {
      return NextResponse.json(
        errorResponse("VALIDATION_ERROR", "End date must be after start date"),
        { status: 400 }
      );
    }

    // Check car exists
    const car = await prisma.car.findFirst({
      where: {
        id: carId,
        deletedAt: null,
      },
    });

    if (!car) {
      return NextResponse.json(errorResponse("NOT_FOUND", "Car not found"), {
        status: 404,
      });
    }

    // Check availability records
    const availabilityRecords = await prisma.carAvailability.findMany({
      where: {
        carId: carId,
        date: {
          gte: start,
          lte: end,
        },
        deletedAt: null,
      },
    });

    // Determine unavailable dates
    const unavailableDates: string[] = [];

    // From availability records
    availabilityRecords
      .filter((record) => !record.isAvailable)
      .forEach((record) => {
        unavailableDates.push(record.date.toISOString().split("T")[0]);
      });

    const isAvailable = unavailableDates.length === 0;

    return NextResponse.json(
      successResponse({
        isAvailable,
        unavailableDates,
        carId: carId,
        startDate,
        endDate,
      })
    );
  } catch (error: any) {
    console.error("Check availability error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to check availability"),
      { status: 500 }
    );
  }
}
