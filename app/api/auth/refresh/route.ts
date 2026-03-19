import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, generateTokenPair } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        errorResponse("MISSING_TOKEN", "Refresh token is required"),
        { status: 400 }
      );
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Generate new token pair
    const tokens = generateTokenPair(payload);

    return NextResponse.json(
      successResponse(tokens, "Token refreshed successfully")
    );
  } catch (error: any) {
    return NextResponse.json(
      errorResponse(
        "INVALID_TOKEN",
        error.message || "Invalid or expired refresh token"
      ),
      { status: 401 }
    );
  }
}
