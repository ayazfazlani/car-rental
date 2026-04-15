
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_NAME as string,
  description: process.env.NEXT_PUBLIC_SITE_NAME as string,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <div className='max-w-[1440px] min-w-[350px] mx-auto'>
        {children}
      </div>
      <Footer />
    </>
  )
}
