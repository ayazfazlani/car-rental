'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

type Props = {
  params: {
    locale: string
  }
}

export default function LocaleNotFound({ params }: Props) {
  const t = useTranslations('common')

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-16">
      <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">404</p>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{t('pageNotFoundTitle')}</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">{t('pageNotFoundDescription')}</p>
        <div className="mt-8">
          <Link
            href={`/${params.locale}`}
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            {t('backToHome')}
          </Link>
        </div>
      </div>
    </main>
  )
}
