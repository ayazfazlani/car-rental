import { NextResponse, NextRequest } from "next/server";
import { withAdmin, AuthenticatedRequest } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/utils";
import { UserRole } from "@prisma/client";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

const updateAdminSchema = z.object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    password: z.string().min(8).optional(),
    phone: z.string().optional(),
    isActive: z.boolean().optional(),
});

// Check if user is SUPER_ADMIN
function isSuperAdmin(role: UserRole | undefined): boolean {
    return role === UserRole.SUPER_ADMIN;
}

// GET - Get specific admin by ID (only for SUPER_ADMIN)
async function getAdmin(
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;

        // Verify user is SUPER_ADMIN
        if (!isSuperAdmin(req.user?.role as UserRole)) {
            return NextResponse.json(
                errorResponse("FORBIDDEN", "Only super admins can view other admins"),
                { status: 403 }
            );
        }

        const admin = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!admin) {
            return NextResponse.json(
                errorResponse("NOT_FOUND", "Admin not found"),
                { status: 404 }
            );
        }

        // Verify the user is an ADMIN (not SUPER_ADMIN or CUSTOMER)
        if (admin.role !== UserRole.ADMIN) {
            return NextResponse.json(
                errorResponse("FORBIDDEN", "This user is not an admin"),
                { status: 403 }
            );
        }

        return NextResponse.json(successResponse(admin));
    } catch (error: any) {
        console.error("Get admin error:", error);
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to fetch admin"),
            { status: 500 }
        );
    }
}

// PUT - Update admin (only for SUPER_ADMIN)
async function updateAdmin(
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;

        // Verify user is SUPER_ADMIN
        if (!isSuperAdmin(req.user?.role as UserRole)) {
            return NextResponse.json(
                errorResponse("FORBIDDEN", "Only super admins can edit admins"),
                { status: 403 }
            );
        }

        // Verify admin exists and is ADMIN role
        const existingAdmin = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!existingAdmin) {
            return NextResponse.json(
                errorResponse("NOT_FOUND", "Admin not found"),
                { status: 404 }
            );
        }

        if (existingAdmin.role !== UserRole.ADMIN) {
            return NextResponse.json(
                errorResponse("FORBIDDEN", "This user is not an admin"),
                { status: 403 }
            );
        }

        const body = await req.json();
        const validatedData = updateAdminSchema.parse(body);

        const updateData: any = {};

        if (validatedData.firstName !== undefined)
            updateData.firstName = validatedData.firstName;
        if (validatedData.lastName !== undefined)
            updateData.lastName = validatedData.lastName;
        if (validatedData.phone !== undefined) updateData.phone = validatedData.phone;
        if (validatedData.isActive !== undefined)
            updateData.isActive = validatedData.isActive;

        if (validatedData.password !== undefined) {
            updateData.passwordHash = await hashPassword(validatedData.password);
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        return NextResponse.json(
            successResponse(
                {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    role: user.role,
                    isActive: user.isActive,
                    updatedAt: user.updatedAt,
                },
                "Admin updated successfully"
            )
        );
    } catch (error: any) {
        console.error("Update admin error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                errorResponse("VALIDATION_ERROR", error.errors[0].message),
                { status: 400 }
            );
        }

        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to update admin"),
            { status: 500 }
        );
    }
}

// DELETE - Delete admin (only for SUPER_ADMIN)
async function deleteAdmin(
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;

        // Verify user is SUPER_ADMIN
        if (!isSuperAdmin(req.user?.role as UserRole)) {
            return NextResponse.json(
                errorResponse("FORBIDDEN", "Only super admins can delete admins"),
                { status: 403 }
            );
        }

        // Prevent self-deletion
        if (userId === req.user?.userId) {
            return NextResponse.json(
                errorResponse("FORBIDDEN", "Cannot delete your own account"),
                { status: 403 }
            );
        }

        // Verify admin exists and is ADMIN role
        const existingAdmin = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!existingAdmin) {
            return NextResponse.json(
                errorResponse("NOT_FOUND", "Admin not found"),
                { status: 404 }
            );
        }

        if (existingAdmin.role !== UserRole.ADMIN) {
            return NextResponse.json(
                errorResponse("FORBIDDEN", "This user is not an admin"),
                { status: 403 }
            );
        }

        // Soft delete the user
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                deletedAt: new Date(),
                isActive: false,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
            },
        });

        return NextResponse.json(
            successResponse(user, "Admin deleted successfully")
        );
    } catch (error: any) {
        console.error("Delete admin error:", error);
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to delete admin"),
            { status: 500 }
        );
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    return withAdmin((r) => getAdmin(r, { params }))(req);
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    return withAdmin((r) => updateAdmin(r, { params }))(req);
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    return withAdmin((r) => deleteAdmin(r, { params }))(req);
}

