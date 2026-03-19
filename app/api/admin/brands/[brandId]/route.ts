import { NextRequest, NextResponse } from "next/server";
import { withAdmin, AuthenticatedRequest } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { updateBrandSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/utils";
import { saveBrandLogo, validateFile, deleteBrandLogo } from "@/lib/upload";
import { revalidateTag } from "next/cache";

// GET - Get brand details
async function getBrand(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ brandId: string }> }
) {
  try {
    const { brandId } = await params;

    const brand = await prisma.carBrand.findFirst({
      where: {
        id: brandId,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            cars: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
    });

    if (!brand) {
      return NextResponse.json(errorResponse("NOT_FOUND", "Brand not found"), {
        status: 404,
      });
    }
    revalidateTag('brand', 'max');

    return NextResponse.json(successResponse(brand));
  } catch (error: any) {
    console.error("Get brand error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to fetch brand"),
      { status: 500 }
    );
  }
}

// PATCH - Update brand
async function updateBrand(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ brandId: string }> }
) {
  try {
    const { brandId } = await params;

    // Get existing brand to handle logo deletion
    const existingBrand = await prisma.carBrand.findUnique({
      where: { id: brandId },
    });

    if (!existingBrand) {
      return NextResponse.json(errorResponse("NOT_FOUND", "Brand not found"), {
        status: 404,
      });
    }

    // Check if request has form data (file upload) or JSON
    const contentType = req.headers.get("content-type") || "";

    let validatedData: any;
    let logoUrl: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await req.formData();
      const name = formData.get("name") as string | null;
      const slug = formData.get("slug") as string | null;
      const description = formData.get("description") as string | null;
      const logoFile = formData.get("logo") as File | null;
      const removeLogo = formData.get("removeLogo") === "true";
      const seo_title = formData.get("seo_title") as string | null;
      const seo_description = formData.get("seo_description") as string | null;
      const seo_keywords = formData.get("seo_keywords") as string | null;

      // Build update data
      const updateData: any = {};
      if (name) updateData.name = name;
      if (slug) updateData.slug = slug;
      if (description !== null)
        updateData.description = description || undefined;
      if (seo_title !== null) updateData.seo_title = seo_title || undefined;
      if (seo_description !== null)
        updateData.seo_description = seo_description || undefined;
      if (seo_keywords !== null)
        updateData.seo_keywords = seo_keywords || undefined;

      validatedData = updateBrandSchema.parse(updateData);

      // Handle logo file upload or removal
      if (removeLogo && existingBrand.logoUrl) {
        // Delete old logo
        await deleteBrandLogo(existingBrand.logoUrl);
        logoUrl = undefined;
      } else if (logoFile && logoFile.size > 0) {
        // Validate and save new logo
        const validation = validateFile(logoFile);
        if (!validation.valid) {
          return NextResponse.json(
            errorResponse(
              "VALIDATION_ERROR",
              validation.error || "Invalid file"
            ),
            { status: 400 }
          );
        }

        // Delete old logo if exists
        if (existingBrand.logoUrl) {
          await deleteBrandLogo(existingBrand.logoUrl);
        }

        const { url } = await saveBrandLogo(logoFile);
        logoUrl = url;
      } else {
        // Keep existing logo
        logoUrl = existingBrand.logoUrl || undefined;
      }
    } else {
      // Handle JSON (backward compatibility)
      const body = await req.json();
      validatedData = updateBrandSchema.parse(body);
      logoUrl =
        validatedData.logoUrl !== undefined
          ? validatedData.logoUrl
          : existingBrand.logoUrl || undefined;
    }

    // Update brand
    const brand = await prisma.carBrand.update({
      where: { id: brandId },
      data: {
        ...validatedData,
        logoUrl,
      },
    });

    return NextResponse.json(
      successResponse(brand, "Brand updated successfully")
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
      return NextResponse.json(errorResponse("NOT_FOUND", "Brand not found"), {
        status: 404,
      });
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        errorResponse(
          "DUPLICATE",
          "Brand with this name or slug already exists"
        ),
        { status: 409 }
      );
    }

    console.error("Update brand error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to update brand"),
      { status: 500 }
    );
  }
}

// DELETE - Soft delete brand
async function deleteBrand(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ brandId: string }> }
) {
  try {
    const { brandId } = await params;

    await prisma.carBrand.update({
      where: { id: brandId },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json(
      successResponse(null, "Brand deleted successfully"),
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(errorResponse("NOT_FOUND", "Brand not found"), {
        status: 404,
      });
    }

    console.error("Delete brand error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to delete brand"),
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ brandId: string }> }
) {
  return withAdmin((r) => getBrand(r, { params }))(req);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ brandId: string }> }
) {
  return withAdmin((r) => updateBrand(r, { params }))(req);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ brandId: string }> }
) {
  return withAdmin((r) => deleteBrand(r, { params }))(req);
}
