import { getCategory } from '@/lib/data/category'
import React, { Suspense } from 'react'
import Skeleton from './sekeleton'
import { CategoriesComponent } from './category-component'

export default function Category() {
    const categories = getCategory()
    return (
        <Suspense fallback={<Skeleton />}>
            <CategoriesComponent categories={categories} />
        </Suspense>
    )
}
