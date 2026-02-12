import type { Metadata, Viewport } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import { OrderProvider } from '@/lib/order-context'

import './globals.css'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-noto-sans-kr',
})

export const metadata: Metadata = {
  title: '키오스크 주문',
  description: '매장 키오스크 주문 시스템',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#e84088',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        <OrderProvider>
          <div className="relative mx-auto flex h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-card shadow-2xl">
            {children}
          </div>
        </OrderProvider>
      </body>
    </html>
  )
}
