'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-16">
      <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">404</p>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Oops — page not found</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          We couldn’t find the page you were looking for. Please choose a language home page to continue browsing our car rental services.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/en"
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Go to English Home
          </Link>
          <Link
            href="/ar"
            className="rounded-full border border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            الذهاب إلى الصفحة الرئيسية العربية
          </Link>
        </div>
      </div>
    </main>
  )
}
