import { NextRequest, NextResponse } from "next/server";
import { withAdmin, AuthenticatedRequest } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import {
    homePageSectionSchema,
    updateHomePageSectionSchema,
    reorderSectionsSchema,
} from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/utils";
import { revalidateTag } from "next/cache";

// GET - List all sections
async function getSections(req: AuthenticatedRequest) {
    try {
        const sections = await prisma.homePageSection.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                order: "asc",
            },
        });

        return NextResponse.json(successResponse(sections));
    } catch (error: any) {
        console.error("Get sections error:", error);
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to fetch sections"),
            { status: 500 }
        );
    }
}

// POST - Create section
async function createSection(req: AuthenticatedRequest) {
    try {
        const body = await req.json();
        const validatedData = homePageSectionSchema.parse(body);

        // Check if section type already exists
        const existing = await prisma.homePageSection.findUnique({
            where: { type: validatedData.type },
        });

        if (existing && !existing.deletedAt) {
            return NextResponse.json(
                errorResponse(
                    "VALIDATION_ERROR",
                    `Section type "${validatedData.type}" already exists`
                ),
                { status: 400 }
            );
        }

        const section = await prisma.homePageSection.upsert({
            where: { type: validatedData.type },
            update: {
                name: validatedData.name,
                order: validatedData.order,
                isVisible: validatedData.isVisible,
                config: validatedData.config,
                deletedAt: null, // Restore if soft deleted
            },
            create: {
                type: validatedData.type,
                name: validatedData.name,
                order: validatedData.order,
                isVisible: validatedData.isVisible,
                config: validatedData.config,
            },
        });

        revalidateTag("home-sections", "max");

        return NextResponse.json(successResponse(section), { status: 201 });
    } catch (error: any) {
        console.error("Create section error:", error);
        if (error.name === "ZodError") {
            return NextResponse.json(
                errorResponse("VALIDATION_ERROR", error.errors[0]?.message || "Invalid data"),
                { status: 400 }
            );
        }
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to create section"),
            { status: 500 }
        );
    }
}

// PUT - Update section
async function updateSection(req: AuthenticatedRequest) {
    try {
        const body = await req.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                errorResponse("VALIDATION_ERROR", "Section ID is required"),
                { status: 400 }
            );
        }

        const validatedData = updateHomePageSectionSchema.parse(updateData);

        const section = await prisma.homePageSection.update({
            where: { id },
            data: validatedData,
        });

        revalidateTag("home-sections", "max");

        return NextResponse.json(successResponse(section));
    } catch (error: any) {
        console.error("Update section error:", error);
        if (error.code === "P2025") {
            return NextResponse.json(
                errorResponse("NOT_FOUND", "Section not found"),
                { status: 404 }
            );
        }
        if (error.name === "ZodError") {
            return NextResponse.json(
                errorResponse("VALIDATION_ERROR", error.errors[0]?.message || "Invalid data"),
                { status: 400 }
            );
        }
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to update section"),
            { status: 500 }
        );
    }
}

// DELETE - Soft delete section
async function deleteSection(req: AuthenticatedRequest) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json(
                errorResponse("VALIDATION_ERROR", "Section ID is required"),
                { status: 400 }
            );
        }

        const section = await prisma.homePageSection.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });

        revalidateTag("home-sections", "max");

        return NextResponse.json(successResponse(section));
    } catch (error: any) {
        console.error("Delete section error:", error);
        if (error.code === "P2025") {
            return NextResponse.json(
                errorResponse("NOT_FOUND", "Section not found"),
                { status: 404 }
            );
        }
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to delete section"),
            { status: 500 }
        );
    }
}

// PATCH - Reorder sections
async function reorderSections(req: AuthenticatedRequest) {
    try {
        const body = await req.json();
        const validatedData = reorderSectionsSchema.parse(body);

        // Update order for all sections in the request
        const updatePromises = validatedData.sections.map((section) =>
            prisma.homePageSection.update({
                where: { id: section.id },
                data: { order: section.order },
            })
        );

        const sections = await Promise.all(updatePromises);

        revalidateTag("home-sections", "max");

        return NextResponse.json(
            successResponse(sections, "Sections reordered successfully")
        );
    } catch (error: any) {
        console.error("Reorder sections error:", error);
        if (error.name === "ZodError") {
            return NextResponse.json(
                errorResponse("VALIDATION_ERROR", error.errors[0]?.message || "Invalid data"),
                { status: 400 }
            );
        }
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to reorder sections"),
            { status: 500 }
        );
    }
}

export const GET = withAdmin(getSections);
export const POST = withAdmin(createSection);
export const PUT = withAdmin(updateSection);
export const DELETE = withAdmin(deleteSection);
export const PATCH = withAdmin(reorderSections);
