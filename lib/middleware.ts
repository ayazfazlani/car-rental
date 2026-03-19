import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, extractTokenFromHeader, JWTPayload } from "./auth";
import { UserRole } from "@prisma/client";
import { errorResponse } from "./utils";

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Middleware to authenticate requests
 */
export function authenticate(request: NextRequest): JWTPayload {
  const authHeader = request.headers.get("authorization");
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    throw new Error("No token provided");
  }

  try {
    return verifyAccessToken(token);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

/**
 * Middleware wrapper for authenticated routes
 */
export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const user = authenticate(req);
      (req as AuthenticatedRequest).user = user;
      return await handler(req as AuthenticatedRequest);
    } catch (error: any) {
      return NextResponse.json(
        errorResponse(
          "UNAUTHORIZED",
          error.message || "Authentication required"
        ),
        { status: 401 }
      );
    }
  };
}

/**
 * Middleware wrapper for admin-only routes
 */
export function withAdmin(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const user = authenticate(req);

      if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN) {
        return NextResponse.json(
          errorResponse("FORBIDDEN", "Admin access required"),
          { status: 403 }
        );
      }

      (req as AuthenticatedRequest).user = user;
      return await handler(req as AuthenticatedRequest);
    } catch (error: any) {
      return NextResponse.json(
        errorResponse(
          "UNAUTHORIZED",
          error.message || "Authentication required"
        ),
        { status: 401 }
      );
    }
  };
}

/**
 * Middleware wrapper for super admin-only routes
 */
export function withSuperAdmin(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const user = authenticate(req);

      if (user.role !== UserRole.SUPER_ADMIN) {
        return NextResponse.json(
          errorResponse("FORBIDDEN", "Super admin access required"),
          { status: 403 }
        );
      }

      (req as AuthenticatedRequest).user = user;
      return await handler(req as AuthenticatedRequest);
    } catch (error: any) {
      return NextResponse.json(
        errorResponse(
          "UNAUTHORIZED",
          error.message || "Authentication required"
        ),
        { status: 401 }
      );
    }
  };
}
