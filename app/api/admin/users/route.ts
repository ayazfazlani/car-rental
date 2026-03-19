import { NextResponse } from "next/server";
import { withAdmin, AuthenticatedRequest } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import {
    successResponse,
    errorResponse,
    getPaginationParams,
    getPaginationMeta,
} from "@/lib/utils";
import { UserRole } from "@prisma/client";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

// Validation schemas
const createAdminSchema = z.object({
    email: z.string().email("Invalid email format"),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone: z.string().optional(),
});

const updateAdminSchema = z.object({
    email: z.string().email("Invalid email format").optional(),
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    password: z.string().min(8).optional(),
    phone: z.string().optional(),
    isActive: z.boolean().optional(),
});

// Check if user is SUPER_ADMIN
function isSuperAdmin(role: UserRole): boolean {
    return role === UserRole.SUPER_ADMIN;
}

// GET - List all admins (only for SUPER_ADMIN)
async function getAdmins(req: AuthenticatedRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // Verify user is SUPER_ADMIN
        if (!isSuperAdmin(req.user?.role as UserRole)) {
            return NextResponse.json(
                errorResponse("FORBIDDEN", "Only super admins can view other admins"),
                { status: 403 }
            );
        }

        const pagination = getPaginationParams({
            page: searchParams.get("page") || undefined,
            limit: searchParams.get("limit") || undefined,
        });

        const search = searchParams.get("search");
        const isActive = searchParams.get("isActive");

        const where: any = {
            role: UserRole.ADMIN,
            deletedAt: null,
        };

        if (search && search !== "") {
            where.OR = [
                { email: { contains: search, mode: "insensitive" } },
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
            ];
        }

        if (isActive !== null && isActive !== undefined && isActive !== "") {
            where.isActive = isActive === "true";
        }

        const total = await prisma.user.count({ where });

        const admins = await prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            skip: (pagination.page - 1) * pagination.limit,
            take: pagination.limit,
        });

        return NextResponse.json(
            successResponse({
                admins,
                pagination: getPaginationMeta(total, pagination.page, pagination.limit),
            })
        );
    } catch (error: any) {
        console.error("Get admins error:", error);
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to fetch admins"),
            { status: 500 }
        );
    }
}

// POST - Create new admin (only for SUPER_ADMIN)
async function createAdmin(req: AuthenticatedRequest) {
    try {
        // Verify user is SUPER_ADMIN
        if (!isSuperAdmin(req.user?.role as UserRole)) {
            return NextResponse.json(
                errorResponse(
                    "FORBIDDEN",
                    "Only super admins can create new admins"
                ),
                { status: 403 }
            );
        }

        const body = await req.json();
        const validatedData = createAdminSchema.parse(body);

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            return NextResponse.json(
                errorResponse("CONFLICT", "Email already in use"),
                { status: 409 }
            );
        }

        // Check if phone already exists (if provided)
        if (validatedData.phone) {
            const existingPhone = await prisma.user.findUnique({
                where: { phone: validatedData.phone },
            });

            if (existingPhone) {
                return NextResponse.json(
                    errorResponse("CONFLICT", "Phone number already in use"),
                    { status: 409 }
                );
            }
        }

        // Hash password
        const passwordHash = await hashPassword(validatedData.password);

        // Create user and admin profile
        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                phone: validatedData.phone || null,
                passwordHash,
                role: UserRole.ADMIN,
                isActive: true,
            },
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
                    createdAt: user.createdAt,
                },
                "Admin created successfully"
            ),
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Create admin error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                errorResponse("VALIDATION_ERROR", error.errors[0].message),
                { status: 400 }
            );
        }

        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to create admin"),
            { status: 500 }
        );
    }
}

export const GET = withAdmin(getAdmins);
export const POST = withAdmin(createAdmin);
