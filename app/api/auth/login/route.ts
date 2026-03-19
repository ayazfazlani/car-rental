import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateTokenPair } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
        deletedAt: null,
      },
    });

    if (!user) {
      return NextResponse.json(
        errorResponse("INVALID_CREDENTIALS", "Invalid email or password"),
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        errorResponse("ACCOUNT_DISABLED", "Your account has been disabled"),
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(
      validatedData.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      return NextResponse.json(
        errorResponse("INVALID_CREDENTIALS", "Invalid email or password"),
        { status: 401 }
      );
    }

    // Update last login for admins
    if (user.role !== "CUSTOMER") {
      await prisma.adminProfile.updateMany({
        where: { userId: user.id },
        data: {
          lastLoginAt: new Date(),
          lastLoginIp:
            request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            null,
        },
      });
    }

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Return user data (excluding password)
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json(
      successResponse(
        {
          user: userWithoutPassword,
          ...tokens,
        },
        "Login successful"
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
