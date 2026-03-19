export function BrandsCardSkeleton() {
    return (
        <section className="py-10 bg-background">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="mb-6">
                    <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
                </div>
                <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 h-32 w-40 bg-muted animate-pulse rounded-xl"
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export function BrandsPillsSkeleton() {
    return (
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <button
                    key={i}
                    className="flex items-center gap-2 px-5 py-2.5 bg-background border border-border rounded-full text-sm text-foreground hover:border-primary transition-colors font-medium"
                >
                    <span className="bg-secondary animate-pulse rounded-md h-5 w-6" />
                    <span className="bg-secondary animate-pulse rounded-md h-5 w-20" />
                </button>
            ))}
        </div>
    )
}

export function HeaderBrandSkeleton() {
    return (
        <div className='bg-secondary h-8 w-20 animate-pulse rounded-md' />
    )
}
