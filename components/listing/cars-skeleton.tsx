
export function CarsSkeleton({ count = 4, compact = true }: { count?: number, compact?: boolean }) {
    return (
        <div className={
            compact ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        }>
            {[...Array(count)].map((_, i) => (
                <div
                    key={i}
                    className="bg-card rounded-xl border border-border p-4 animate-pulse"
                >
                    <div className="aspect-[4/3] bg-muted rounded-lg mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
            ))}
        </ div>
    );
}

export function CarSectionSkeleton({ count = 4 }: { count?: number }) {
    return (
        <section className="py-10 bg-[#FFF9F3]">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex items-start justify-between mb-6 gap-2">
                    <div>
                        <div className="h-6 w-20 bg-secondary animate-pulse rounded-md" />
                        <div className="h-4 w-40 bg-secondary animate-pulse rounded-md" />
                    </div>
                </div>
                <CarsSkeleton count={count} />
            </div>
        </section>
    )
}
