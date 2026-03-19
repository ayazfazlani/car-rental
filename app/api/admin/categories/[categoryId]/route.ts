import { NextRequest, NextResponse } from "next/server";
import { withAdmin, AuthenticatedRequest } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { createCategorySchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/utils";
import { revalidateTag } from "next/cache";

// GET - Get category details
async function getCategory(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;

    const category = await prisma.carCategory.findFirst({
      where: {
        id: categoryId,
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

    if (!category) {
      return NextResponse.json(errorResponse("NOT_FOUND", "Category not found"), {
        status: 404,
      });
    }

    return NextResponse.json(successResponse(category));
  } catch (error: any) {
    console.error("Get category error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to fetch category"),
      { status: 500 }
    );
  }
}

// PATCH - Update category
async function updateCategory(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;

    // Get existing category to handle logo deletion
    const existingCategory = await prisma.carCategory.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return NextResponse.json(errorResponse("NOT_FOUND", "Category not found"), {
        status: 404,
      });
    }

    const body = await req.json();
    const validatedData = createCategorySchema.parse(body);
    // Update category
    const category = await prisma.carCategory.update({
      where: { id: categoryId },
      data: validatedData,
    });
    revalidateTag('category', 'max');
    revalidateTag('cars', 'max');

    return NextResponse.json(
      successResponse(category, "Category updated successfully")
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
      return NextResponse.json(errorResponse("NOT_FOUND", "Category not found"), {
        status: 404,
      });
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        errorResponse(
          "DUPLICATE",
          "Category with this name or slug already exists"
        ),
        { status: 409 }
      );
    }

    console.error("Update category error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to update category"),
      { status: 500 }
    );
  }
}

// DELETE - Soft delete category
async function deleteCategory(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;

    await prisma.carCategory.update({
      where: { id: categoryId },
      data: {
        deletedAt: new Date(),
      },
    });
    revalidateTag('category', 'max');
    revalidateTag('cars', 'max');

    return NextResponse.json(
      successResponse(null, "Category deleted successfully"),
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(errorResponse("NOT_FOUND", "Category not found"), {
        status: 404,
      });
    }

    console.error("Delete category error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to delete category"),
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  return withAdmin((r) => getCategory(r, { params }))(req);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  return withAdmin((r) => updateCategory(r, { params }))(req);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  return withAdmin((r) => deleteCategory(r, { params }))(req);
}
