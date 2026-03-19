import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateTokenPair } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/utils";
import { UserRole } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          ...(validatedData.phone ? [{ phone: validatedData.phone }] : []),
        ],
        deletedAt: null,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        errorResponse(
          "USER_EXISTS",
          "User with this email or phone already exists"
        ),
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(validatedData.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        phone: validatedData.phone,
        passwordHash,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: UserRole.CUSTOMER,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
      successResponse(
        {
          user,
          ...tokens,
        },
        "User registered successfully"
      ),
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

    console.error("Registration error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to register user"),
      { status: 500 }
    );
  }
}
