import { NextRequest, NextResponse } from "next/server";
import { withAdmin, AuthenticatedRequest } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { updateCarSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/utils";
import { revalidateTag } from "next/cache";

// GET - Get car details (admin view)
async function getCar(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ carId: string }> }
) {
  try {
    const { carId } = await params;

    const car = await prisma.car.findFirst({
      where: {
        id: carId,
        deletedAt: null,
      },
      include: {
        brand: true,
        category: true,
        images: {
          where: { deletedAt: null },
          orderBy: { displayOrder: "asc" },
        },
        pricing: {
          where: { deletedAt: null },
        },
        availability: {
          where: { deletedAt: null },
          orderBy: { date: "asc" },
          take: 30, // Next 30 days
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!car) {
      return NextResponse.json(errorResponse("NOT_FOUND", "Car not found"), {
        status: 404,
      });
    }

    return NextResponse.json(successResponse(car));
  } catch (error: any) {
    console.error("Get car error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to fetch car"),
      { status: 500 }
    );
  }
}

// PATCH - Update car
async function updateCar(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ carId: string }> }
) {
  try {
    const { carId } = await params;
    const body = await req.json();
    const validatedData: any = updateCarSchema.parse(body);

    if (validatedData.carFeatures) {
      validatedData.carFeatures = {
        deleteMany: {
          carId: carId
        },
        createMany: {
          data: validatedData.carFeatures
        }
      }
    }

    if (validatedData.carFaqs) {
      validatedData.carFaqs = {
        deleteMany: {
          carId: carId
        },
        createMany: {
          data: validatedData.carFaqs
        }
      }
    }

    if (validatedData.rentalTerms) {
      validatedData.rentalTerms = {
        deleteMany: {
          carId: carId
        },
        createMany: {
          data: validatedData.rentalTerms
        }
      }
    }

    if (validatedData.brandId) {
      validatedData.brand = {
        connect: {
          id: validatedData.brandId
        }
      }
      delete validatedData?.brandId;
    }

    if (validatedData.categoryId) {
      validatedData.category = {
        connect: {
          id: validatedData.categoryId
        }
      }
      delete validatedData?.categoryId;
    }

    const car = await prisma.car.update({
      where: { id: carId },
      data: validatedData,
      include: {
        brand: true,
        category: true,
        images: {
          where: { deletedAt: null },
          orderBy: { displayOrder: "asc" },
        },
      },
    });
    revalidateTag('cars', 'max');

    return NextResponse.json(successResponse(car, "Car updated successfully"));
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        errorResponse(
          "VALIDATION_ERROR",
          error.errors[0]?.message || "Validation failed"
        ),
        { status: 400 }
      );
    }

    if (error.code === "P2025") {
      return NextResponse.json(errorResponse("NOT_FOUND", "Car not found"), {
        status: 404,
      });
    }

    console.error("Update car error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to update car"),
      { status: 500 }
    );
  }
}

// DELETE - Soft delete car
async function deleteCar(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ carId: string }> }
) {
  try {
    const { carId } = await params;

    await prisma.car.update({
      where: { id: carId },
      data: {
        deletedAt: new Date(),
        status: "DELETED",
      },
    });
    revalidateTag('cars', 'max');

    return NextResponse.json(
      successResponse(null, "Car deleted successfully"),
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(errorResponse("NOT_FOUND", "Car not found"), {
        status: 404,
      });
    }

    console.error("Delete car error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to delete car"),
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ carId: string }> }
) {
  return withAdmin((r) => getCar(r, { params }))(req);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ carId: string }> }
) {
  return withAdmin((r) => updateCar(r, { params }))(req);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ carId: string }> }
) {
  return withAdmin((r) => updateCar(r, { params }))(req);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ carId: string }> }
) {
  return withAdmin((r) => deleteCar(r, { params }))(req);
}
