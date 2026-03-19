"use client"
import { trackCarView } from '@/lib/utils'
import React, { useEffect } from 'react'

export default function TrackViewCar({ car }: {
    car: {
        id: string,
        name: string,
        brandId: string,
        categoryId: string,
        model: string,
    }
}) {

    useEffect(() => {
        trackCarView(car)
    }, [car.id])

    return (
        <></>
    )
}
