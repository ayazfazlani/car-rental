import { NextRequest, NextResponse } from "next/server";
import { withAdmin, AuthenticatedRequest } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { createPageSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/utils";
import { revalidateTag } from "next/cache";

// GET - List all pages
async function getPages(req: AuthenticatedRequest) {
  try {
    const pages = await prisma.page.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(successResponse(pages));
  } catch (error: any) {
    console.error("Get pages error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to fetch pages"),
      { status: 500 }
    );
  }
}

// POST - Create page
async function createPage(req: AuthenticatedRequest) {
  try {
    const body = await req.json();
    const validatedData = createPageSchema.parse(body);

    const page = await prisma.page.create({
      data: validatedData,
    });
    
    revalidateTag('pages', 'max');
    
    return NextResponse.json(
      successResponse(page, "Page created successfully"),
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
          "Page with this slug already exists"
        ),
        { status: 409 }
      );
    }

    console.error("Create page error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to create page"),
      { status: 500 }
    );
  }
}

export const GET = withAdmin(getPages);
export const POST = withAdmin(createPage);
