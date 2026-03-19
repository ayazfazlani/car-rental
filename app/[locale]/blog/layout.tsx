
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Luxus Car Rental',
  description: 'Luxus Car Rental',
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
