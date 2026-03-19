import 'server-only'
import { prisma } from '../prisma'
import { Prisma } from '@prisma/client'
import { unstable_cache } from 'next/cache'
import crypto from 'crypto'

function hashWhere(where: object) {
    return crypto.createHash('sha1').update(JSON.stringify(where)).digest('hex')
}

export function getFilterdCars(
    where: Prisma.CarWhereInput,
    start = 0,
    take = 10
) {
    const whereHash = hashWhere(where)

    return unstable_cache(
        async () => {
            return prisma.car.findMany({
                where,
                include: { images: true },
                skip: start,
                take,
            })
        },
        ['filtered-cars', whereHash, start.toString(), take.toString()],
        {
            tags: ['cars'],
            revalidate: 300, // optional TTL
        }
    )()
}
