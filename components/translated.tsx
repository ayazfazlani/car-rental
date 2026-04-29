'use client'
import { useTranslations } from 'next-intl'

export default function Translated({
    translationKey,
    fallback,
    className,
    withFragment = false,
    as: Tag = 'span' as any,
}: { translationKey?: string, fallback: string, className?: string, withFragment?: boolean, as?: any }) {
    const t = useTranslations()

    if (withFragment) {
        return (
            <>
                {translationKey ? t(translationKey, { key: fallback }) : fallback}
            </>
        )
    }

    return (
        <Tag className={className}>
            {translationKey ? t(translationKey) : fallback}
        </Tag>
    )
}
