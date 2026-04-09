'use client'
import { useTranslations } from 'next-intl'

export default function Translated({
    key,
    fallback,
    className,
    withFragment = false,
}: { key?: string, fallback: string, className?: string, withFragment?: boolean }) {
    const t = useTranslations()

    if (withFragment) {
        return (
            <>
                {key ? t(key, { key: fallback }) : fallback}
            </>
        )
    }

    return (
        <p className={className}>
            {key ? t(key) : fallback}
        </p>
    )
}
