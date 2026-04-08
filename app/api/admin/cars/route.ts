import { NextResponse } from "next/server";
import { withAdmin, AuthenticatedRequest } from "@/lib/middleware";
import { prisma } from "@/lib/prisma";
import { createCarSchema } from "@/lib/validations";
import {
  successResponse,
  errorResponse,
  getPaginationParams,
  getPaginationMeta,
  createSlug,
} from "@/lib/utils";
import { CarStatus, Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";

// GET - List all cars (admin view)
async function getCars(req: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pagination = getPaginationParams({
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
    });

    const status = searchParams.get("status") as CarStatus | null;
    const brandId = searchParams.get("brandId");
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");

    const where: Prisma.CarWhereInput = {
      deletedAt: null,
    };

    if (search && search !== "") {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { brand: { name: { contains: search, mode: 'insensitive' } } },
        { category: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status) {
      where.status = status;
    }
    if (brandId && brandId !== "") {
      where.brandId = brandId;
    }
    if (categoryId && categoryId !== "") {
      where.categoryId = categoryId;
    }

    const total = await prisma.car.count({ where });

    const cars = await prisma.car.findMany({
      where,
      include: {
        brand: true,
        category: true,
        images: {
          where: { deletedAt: null },
          orderBy: { displayOrder: "asc" },
        },
        _count: {
          select: {
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    });

    return NextResponse.json(
      successResponse({
        cars,
        pagination: getPaginationMeta(total, pagination.page, pagination.limit),
      })
    );
  } catch (error: any) {
    console.error("Get cars error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to fetch cars"),
      { status: 500 }
    );
  }
}

// POST - Create new car
async function createCar(req: AuthenticatedRequest) {
  try {
    const body = await req.json();
    const validatedData = createCarSchema.parse(body);
 
    // Check for duplicate creation in last 60 seconds
    const existingDuplicate = await prisma.car.findFirst({
      where: {
        name: validatedData.name,
        model: validatedData.model,
        year: validatedData.year,
        brandId: validatedData.brandId,
        categoryId: validatedData.categoryId,
        color: validatedData.color,
        createdAt: {
          gt: new Date(Date.now() - 60000), // Created in the last 60 seconds
        },
      },
    });
 
    if (existingDuplicate) {
      return NextResponse.json(
        successResponse(existingDuplicate, "Car already created recently"),
        { status: 200 } // Return 200 instead of 409 to be idempotent for slow/double clicks
      );
    }

    // Generate slug and ensure uniqueness
    const baseSlug = createSlug(
      `${validatedData.name}-${validatedData.model}-${validatedData.year}`
    );

    let slug = baseSlug;
    let counter = 1;

    // Check if slug exists and append number if needed
    while (true) {
      const existingCar = await prisma.car.findUnique({
        where: { slug },
      });

      if (!existingCar) {
        break; // Slug is unique, use it
      }

      // Append counter to make it unique
      slug = `${baseSlug}-${counter}`;
      counter++;

      // Safety check to prevent infinite loop
      if (counter > 100) {
        // Fallback to timestamp-based slug
        slug = `${baseSlug}-${Date.now()}`;
        break;
      }
    }

    const features = validatedData.carFeatures
    const faqs = validatedData.carFaqs
    const rentalTerms = validatedData.rentalTerms
    // @ts-expect-error remove carFeatures from validatedData
    delete validatedData.carFeatures
    // @ts-expect-error remove carFaqs from validatedData
    delete validatedData.carFaqs
    // @ts-expect-error remove rentalTerms from validatedData
    delete validatedData.rentalTerms

    // Create car
    const car = await prisma.car.create({
      data: {
        ...validatedData,
        slug,
        status: CarStatus.ACTIVE,
        carFeatures: {
          createMany: {
            data: features
          }
        },
        carFaqs: {
          createMany: {
            data: faqs
          }
        },
        rentalTerms: {
          createMany: {
            data: rentalTerms
          }
        },
      },
      include: {
        brand: true,
        category: true,
      },
    });

    revalidateTag('cars', 'max');

    return NextResponse.json(successResponse(car, "Car created successfully"), {
      status: 201,
    });
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

    console.error("Create car error:", error);
    return NextResponse.json(
      errorResponse("INTERNAL_ERROR", "Failed to create car"),
      { status: 500 }
    );
  }
}

export const GET = withAdmin(getCars);
export const POST = withAdmin(createCar);
