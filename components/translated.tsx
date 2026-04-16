'use client'
import { useTranslations } from 'next-intl'

export default function Translated({
    key,
    fallback,
    className,
    withFragment = false,
    as: Tag = 'span' as any,
}: { key?: string, fallback: string, className?: string, withFragment?: boolean, as?: any }) {
    const t = useTranslations()

    if (withFragment) {
        return (
            <>
                {key ? t(key, { key: fallback }) : fallback}
            </>
        )
    }

    return (
        <Tag className={className}>
            {key ? t(key) : fallback}
        </Tag>
    )
}
