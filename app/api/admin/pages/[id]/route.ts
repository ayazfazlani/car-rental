import { NextRequest, NextResponse } from "next/server";
import { withAdmin, AuthenticatedRequest } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { updatePageSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/utils";
import { revalidateTag } from "next/cache";

// GET - Get single page
async function getPage(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const page = await prisma.page.findUnique({
      where: {
        id: params.id,
        deletedAt: null,
      },
    });

    if (!page) {
      return NextResponse.json(errorResponse("NOT_FOUND", "Page not found"), { status: 404 });
    }

    return NextResponse.json(successResponse(page));
  } catch (error: any) {
    console.error("Get page error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to fetch page"),
      { status: 500 }
    );
  }
}

// PATCH - Update page
async function updatePage(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const validatedData = updatePageSchema.parse(body);

    const page = await prisma.page.update({
      where: { id: params.id },
      data: validatedData,
    });
    
    revalidateTag('pages', 'max');
    
    return NextResponse.json(
      successResponse(page, "Page updated successfully"),
      { status: 200 }
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

    console.error("Update page error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to update page"),
      { status: 500 }
    );
  }
}

// DELETE - Soft delete page
async function deletePage(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.page.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });
    
    revalidateTag('pages', 'max');

    return NextResponse.json(
      successResponse(null, "Page deleted successfully")
    );
  } catch (error: any) {
    console.error("Delete page error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to delete page"),
      { status: 500 }
    );
  }
}

export const GET = withAdmin(getPage);
export const PATCH = withAdmin(updatePage);
export const DELETE = withAdmin(deletePage);
