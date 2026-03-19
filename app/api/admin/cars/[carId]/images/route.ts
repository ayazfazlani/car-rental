import { NextRequest, NextResponse } from "next/server";
import { withAdmin, AuthenticatedRequest } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/utils";
import { saveFile, validateFile, deleteFile } from "@/lib/upload";
import { updateImageSchema } from "@/lib/validations";
import { revalidateTag } from "next/cache";

// Configure route for file uploads
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET - List all images for a car
async function getImages(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ carId: string }> }
) {
  try {
    const { carId } = await params;

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

    // Get all images for the car
    const images = await prisma.carImage.findMany({
      where: {
        carId: carId,
        deletedAt: null,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    return NextResponse.json(successResponse(images));
  } catch (error: any) {
    console.error("Get images error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to fetch images"),
      { status: 500 }
    );
  }
}

// POST - Upload new image(s) for a car
async function uploadImages(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ carId: string }> }
) {
  try {
    const { carId } = await params;

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

    // Parse form data
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];
    const altText = formData.get("altText") as string | null;
    const isPrimary = formData.get("isPrimary") === "true";

    if (!files || files.length === 0) {
      return NextResponse.json(
        errorResponse("VALIDATION_ERROR", "No images provided"),
        { status: 400 }
      );
    }

    // Validate and save each file
    const uploadedImages = [];
    let primarySet = false;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        return NextResponse.json(
          errorResponse("VALIDATION_ERROR", validation.error || "Invalid file"),
          { status: 400 }
        );
      }

      // Save file to disk
      const { url } = await saveFile(file, carId);

      // Determine if this should be primary
      const setAsPrimary = isPrimary && i === 0 && !primarySet;

      // If setting as primary, unset other primary images
      if (setAsPrimary) {
        await prisma.carImage.updateMany({
          where: {
            carId: carId,
            isPrimary: true,
            deletedAt: null,
          },
          data: {
            isPrimary: false,
          },
        });
        primarySet = true;
      }

      // Get current max display order
      const maxOrder = await prisma.carImage.findFirst({
        where: {
          carId: carId,
          deletedAt: null,
        },
        orderBy: {
          displayOrder: "desc",
        },
        select: {
          displayOrder: true,
        },
      });

      const displayOrder = maxOrder ? maxOrder.displayOrder + 1 : i;

      // Create image record in database
      const image = await prisma.carImage.create({
        data: {
          carId: carId,
          url,
          altText: altText || file.name,
          displayOrder,
          isPrimary: setAsPrimary,
        },
      });

      uploadedImages.push(image);
    }
    revalidateTag('cars', 'max');

    return NextResponse.json(
      successResponse(
        uploadedImages,
        `${uploadedImages.length} image(s) uploaded successfully`
      ),
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Upload images error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to upload images"),
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ carId: string }> }
) {
  return withAdmin((r) => getImages(r, { params }))(req);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ carId: string }> }
) {
  return withAdmin((r) => uploadImages(r, { params }))(req);
}
