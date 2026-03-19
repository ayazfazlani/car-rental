import { NextRequest, NextResponse } from "next/server";
import { withAdmin, AuthenticatedRequest } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/utils";
import { deleteFile } from "@/lib/upload";
import { updateImageSchema } from "@/lib/validations";
import { revalidateTag } from "next/cache";

// PATCH - Update image metadata
async function updateImage(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ carId: string; imageId: string }> }
) {
  try {
    const { carId, imageId } = await params;

    // Verify car exists
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

    // Verify image exists
    const image = await prisma.carImage.findFirst({
      where: {
        id: imageId,
        carId: carId,
        deletedAt: null,
      },
    });

    if (!image) {
      return NextResponse.json(errorResponse("NOT_FOUND", "Image not found"), {
        status: 404,
      });
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = updateImageSchema.parse(body);

    // If setting as primary, unset other primary images
    if (validatedData.isPrimary === true) {
      await prisma.carImage.updateMany({
        where: {
          carId: carId,
          id: { not: imageId },
          isPrimary: true,
          deletedAt: null,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    // Update image
    const updatedImage = await prisma.carImage.update({
      where: {
        id: imageId,
      },
      data: validatedData,
    });
    revalidateTag('cars', 'max');

    return NextResponse.json(
      successResponse(updatedImage, "Image updated successfully")
    );
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
      return NextResponse.json(errorResponse("NOT_FOUND", "Image not found"), {
        status: 404,
      });
    }

    console.error("Update image error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to update image"),
      { status: 500 }
    );
  }
}

// DELETE - Delete an image
async function deleteImage(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ carId: string; imageId: string }> }
) {
  try {
    const { carId, imageId } = await params;

    // Verify car exists
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

    // Verify image exists
    const image = await prisma.carImage.findFirst({
      where: {
        id: imageId,
        carId: carId,
        deletedAt: null,
      },
    });

    if (!image) {
      return NextResponse.json(errorResponse("NOT_FOUND", "Image not found"), {
        status: 404,
      });
    }

    // Delete file from disk
    await deleteFile(image.url);

    // Soft delete image record
    await prisma.carImage.update({
      where: {
        id: imageId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json(
      successResponse(null, "Image deleted successfully")
    );
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(errorResponse("NOT_FOUND", "Image not found"), {
        status: 404,
      });
    }

    console.error("Delete image error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to delete image"),
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ carId: string; imageId: string }> }
) {
  return withAdmin((r) => updateImage(r, { params }))(req);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ carId: string; imageId: string }> }
) {
  return withAdmin((r) => deleteImage(r, { params }))(req);
}
