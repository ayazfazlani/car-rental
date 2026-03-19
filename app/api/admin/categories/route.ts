import { NextRequest, NextResponse } from "next/server";
import { withAdmin, AuthenticatedRequest } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { createCategorySchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/utils";
import { revalidateTag } from "next/cache";

// GET - List all categories
async function getCategories(req: AuthenticatedRequest) {
  try {
    const categories = await prisma.carCategory.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: "asc",
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

// POST - Create category
async function createCategory(req: AuthenticatedRequest) {
  try {
    const body = await req.json();
    const validatedData = createCategorySchema.parse(body);

    const category = await prisma.carCategory.create({
      data: validatedData,
    });
    revalidateTag('category', 'max');
    revalidateTag('cars', 'max');
    return NextResponse.json(
      successResponse(category, "Category created successfully"),
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
          "Category with this type, name or slug already exists"
        ),
        { status: 409 }
      );
    }

    console.error("Create category error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to create category"),
      { status: 500 }
    );
  }
}

export const GET = withAdmin(getCategories);
export const POST = withAdmin(createCategory);
