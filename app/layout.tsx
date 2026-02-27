import type { Metadata, Viewport } from 'next'
import { OrderProvider } from '@/lib/order-context'
import { KioskScaler } from '@/components/kiosk/kiosk-scaler'

import './globals.css'

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

/**
 * Kiosk hardware: 1080 x 1920 (9:16 portrait)
 *
 * Layout is authored at a "logical" viewport of 480 x 853
 * (physical / 2.25) so existing Tailwind utilities render correctly.
 * A CSS transform: scale() controlled by KioskScaler maps the
 * logical frame onto any screen size:
 *   - Real kiosk (1080x1920): scale ≈ 2.25
 *   - Browser preview:        scales to fit the window
 *
 * For a "table order" variant, adjust --kiosk-w / --kiosk-h and
 * the constants in KioskScaler.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <OrderProvider>
          <KioskScaler />
          {/* 
            Outer wrapper:
            - Kiosk mode: centres + scales the fixed-size frame (480x853 logical)
            - Mobile mode: full viewport, no scaling (100vw x 100dvh)
            
            The --kiosk-w, --kiosk-h, --kiosk-scale variables are set dynamically
            by KioskScaler based on device detection.
          */}
          <div className="flex h-dvh w-dvw items-center justify-center overflow-hidden bg-black kiosk-outer">
            <div
              className="relative flex flex-col overflow-hidden bg-card shadow-2xl kiosk-frame"
              style={{
                width: 'var(--kiosk-w)',
                height: 'var(--kiosk-h)',
                transform: 'scale(var(--kiosk-scale))',
                transformOrigin: 'center center',
              }}
            >
              {children}
            </div>
          </div>
        </OrderProvider>
      </body>
    </html>
  )
}
