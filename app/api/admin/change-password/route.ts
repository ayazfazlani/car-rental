import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, hashPassword } from "@/lib/auth";
import { changePasswordSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/utils";
import { AuthenticatedRequest, withAdmin } from "@/lib/middleware";

export async function ChangePassword(request: AuthenticatedRequest) {
    try {
        const body = await request.json();
        const validatedData = changePasswordSchema.parse(body);

        // Find user
        const user = await prisma.user.findUnique({
            where: {
                id: request.user?.userId,
                deletedAt: null,
            },
        });

        if (!user) {
            return NextResponse.json(
                errorResponse("INVALID_CREDENTIALS", "User not found"),
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await verifyPassword(
            validatedData.oldpassword,
            user.passwordHash
        );

        if (!isValidPassword) {
            return NextResponse.json(
                errorResponse("INVALID_CREDENTIALS", "Invalid password"),
                { status: 401 }
            );
        }

        const hashedPassword = await hashPassword(validatedData.password);

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                passwordHash: hashedPassword,
            },
        });


        return NextResponse.json(
            successResponse(
                "Password changed successfully"
            ),
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

        console.error("Login error:", error);
        return NextResponse.json(
            errorResponse("INTERNAL_ERROR", "Failed to login"),
            { status: 500 }
        );
    }
}


export const POST = withAdmin(ChangePassword);