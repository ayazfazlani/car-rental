import { NextRequest, NextResponse } from "next/server";
import { withAdmin, AuthenticatedRequest } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { createBrandSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/utils";
import { saveBrandLogo, validateFile, deleteBrandLogo } from "@/lib/upload";
import { revalidateTag } from "next/cache";

// GET - List all brands
async function getBrands(req: AuthenticatedRequest) {
  try {
    const brands = await prisma.carBrand.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: "asc",
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

// POST - Create brand
async function createBrand(req: AuthenticatedRequest) {
  try {
    // Check if request has form data (file upload) or JSON
    const contentType = req.headers.get("content-type") || "";

    let validatedData: any;
    let logoUrl: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await req.formData();
      const name = formData.get("name") as string;
      const slug = formData.get("slug") as string;
      const description = formData.get("description") as string | null;
      const logoFile = formData.get("logo") as File | null;
      const seo_title = formData.get("seo_title") as string | null;
      const seo_description = formData.get("seo_description") as string | null;
      const seo_keywords = formData.get("seo_keywords") as string | null;

      // Validate basic fields
      validatedData = createBrandSchema.parse({
        name,
        slug,
        description: description || undefined,
        seo_title: seo_title || undefined,
        seo_description: seo_description || undefined,
        seo_keywords: seo_keywords || undefined,
      });

      // Handle logo file upload
      if (logoFile && logoFile.size > 0) {
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

        const { url } = await saveBrandLogo(logoFile);
        logoUrl = url;
      }
    } else {
      // Handle JSON (backward compatibility)
      const body = await req.json();
      validatedData = createBrandSchema.parse(body);
      logoUrl = validatedData.logoUrl;
    }

    // Create brand with logo URL
    const brand = await prisma.carBrand.create({
      data: {
        ...validatedData,
        logoUrl,
      },
    });
    revalidateTag('brand', 'max');

    return NextResponse.json(
      successResponse(brand, "Brand created successfully"),
      { status: 201 }
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

    if (error.code === "P2002") {
      return NextResponse.json(
        errorResponse(
          "DUPLICATE",
          "Brand with this name or slug already exists"
        ),
        { status: 409 }
      );
    }

    console.error("Create brand error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to create brand"),
      { status: 500 }
    );
  }
}

export const GET = withAdmin(getBrands);
export const POST = withAdmin(createBrand);
