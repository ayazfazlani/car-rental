import ManageCarComponent from '@/components/admin/manage-car'
import { getCarById } from '@/lib/data/cars'
import { toNumberSafe } from '@/lib/utils'
import { TCreateCar } from '@/lib/validations'
import { prisma } from '@/lib/prisma'
type PageProps = {
    params: Promise<{ id: string }>
}

export default async function pages({ params }: PageProps) {
    const { id } = await params
    const car = await prisma.car.findUnique({
        where: {
            id: id,
            deletedAt: null,
        },
        include: {
            images: true,
            pricing: true,
            carFeatures: true,
            carFaqs: true,
            rentalTerms: true
        },
    })

    if (!car) {
        return <div>Car not found</div>
    }
    const formated: TCreateCar = {
        brandId: car.brandId,
        categoryId: car.categoryId,
        name: car.name,
        model: car.model,
        year: car.year,
        transmission: car.transmission,
        fuelType: car.fuelType,
        seats: car.seats,
        engineSize: car.engineSize || undefined,
        horsepower: car.horsepower || undefined,
        topSpeed: car.topSpeed || undefined,
        acceleration: car.acceleration || undefined,
        hasChauffeur: car.hasChauffeur,
        hasSelfDrive: car.hasSelfDrive,
        hasGPS: car.hasGPS,
        hasBluetooth: car.hasBluetooth,
        hasSunroof: car.hasSunroof,
        hasLeatherSeats: car.hasLeatherSeats,
        hasBackupCamera: car.hasBackupCamera,
        oneDayRental: car.oneDayRental,
        insurance: car.insurance,
        baseDailyPrice: toNumberSafe(car.baseDailyPrice),
        baseWeeklyPrice: toNumberSafe(car.baseWeeklyPrice),
        baseMonthlyPrice: toNumberSafe(car.baseMonthlyPrice),
        chauffeurDailyPrice: toNumberSafe(car.chauffeurDailyPrice),
        description: car.description || undefined,
        highlights: car.highlights,
        color: car.color || undefined,
        licensePlate: car.licensePlate || undefined,
        vin: car.vin || undefined,
        affordable: car.affordable,
        recommended: car.recommended,
        doors: car.doors,
        bags: car.bags,
        carFeatures: car.carFeatures,
        carFaqs: car.carFaqs,
        requirments: car.requirments,
        rentalTerms: car?.rentalTerms || [],
        additionalMileage: toNumberSafe(car.additionalMileage),
        mileageLimit: toNumberSafe(car.mileageLimit),
        seo_description: car.seo_description || undefined,
        seo_keywords: car.seo_keywords || undefined,
        seo_title: car.seo_title || undefined,
    }

    return (
        <ManageCarComponent
            id={car.id}
            car={formated}
        />
    )
}
