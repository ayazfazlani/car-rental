import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { carFiltersSchema } from "@/lib/validations";
import { successResponse, errorResponse } from "@/lib/utils";
import { CarStatus, Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.nextUrl)
    const paramsObj = Object.fromEntries(searchParams.entries())
    const params = carFiltersSchema.parse(paramsObj)
    const where: Prisma.CarWhereInput = {
      status: CarStatus.ACTIVE,
      deletedAt: null
    }

    if (params.brandId) {
      where.brandId = params.brandId
    }

    if (params.categoryId) {
      where.categoryId = params.categoryId
    }

    if (params.transmission) {
      where.transmission = params.transmission
    }

    if (params.fuelType) {
      where.fuelType = params.fuelType
    }

    if (params.seats) {
      where.seats = params.seats
    }

    if (Object.prototype.hasOwnProperty.call(params, 'hasChauffeur')) {
      where.hasChauffeur = params.hasChauffeur
    }

    if (Object.prototype.hasOwnProperty.call(params, 'hasSelfDrive')) {
      where.hasSelfDrive = params.hasSelfDrive
    }

    if (Object.prototype.hasOwnProperty.call(params, 'hasGPS')) {
      where.hasGPS = params.hasGPS
    }

    if (Object.prototype.hasOwnProperty.call(params, 'hasBluetooth')) {
      where.hasBluetooth = params.hasBluetooth
    }

    if (Object.prototype.hasOwnProperty.call(params, 'hasSunroof')) {
      where.hasSunroof = params.hasSunroof
    }

    if (Object.prototype.hasOwnProperty.call(params, 'hasLeatherSeats')) {
      where.hasLeatherSeats = params.hasLeatherSeats
    }

    if (Object.prototype.hasOwnProperty.call(params, 'hasBackupCamera')) {
      where.hasBackupCamera = params.hasBackupCamera
    }

    if (Object.prototype.hasOwnProperty.call(params, 'afforable')) {
      where.affordable = params.afforable
    }

    if (Object.prototype.hasOwnProperty.call(params, 'recommended')) {
      where.recommended = params.recommended
    }

    if (params.search && params.search.length > 0) {
      where.OR = [
        {
          name: {
            contains: params.search,
            mode: "insensitive"
          }
        },
        {
          model: {
            contains: params.search,
            mode: "insensitive"
          }
        },
        {
          color: {
            contains: params.search,
            mode: "insensitive"
          }
        },
        {
          brand: {
            name: {
              contains: params.search,
              mode: "insensitive"
            }
          },
          category: {
            name: {
              contains: params.search,
              mode: "insensitive"
            }
          }
        },
        {
          description: {
            contains: params.search,
            mode: "insensitive"
          }
        },
        {
          engineSize: {
            contains: params.search,
            mode: "insensitive"
          }
        }
      ]
    }

    if (params.period && (
      Object.prototype.hasOwnProperty.call(params, 'minPrice') ||
      Object.prototype.hasOwnProperty.call(params, 'maxPrice')
    )) {
      const price: Prisma.CarWhereInput['baseDailyPrice'] = {}
      if (Object.prototype.hasOwnProperty.call(params, 'minPrice')) {
        price.gte = params.minPrice
      }
      if (Object.prototype.hasOwnProperty.call(params, 'maxPrice')) {
        price.lte = params.maxPrice
      }
      switch (params.period) {
        case 'DAILY':
          where.baseDailyPrice = price
          break
        case 'WEEKLY':
          where.baseWeeklyPrice = price
          break
        case 'MONTHLY':
          where.baseMonthlyPrice = price
          break
      }
    }

    const options: Prisma.CarFindManyArgs = {
      where,
      include: {
        brand: true,
        category: true,
        images: true
      }
    }

    if (
      Object.prototype.hasOwnProperty.call(params, 'start') &&
      Object.prototype.hasOwnProperty.call(params, 'limit')
    ) {
      const cars = await prisma.car.findMany({
        ...options,
        skip: params.start,
        take: params.limit
      })

      const total = await prisma.car.count({
        where
      })

      return NextResponse.json(
        successResponse({
          cars,
          total,
        })
      )
    }

    const cars = await prisma.car.findMany(options)

    return NextResponse.json(
      successResponse({
        cars,
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
