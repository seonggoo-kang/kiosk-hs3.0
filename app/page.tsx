"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useOrder } from "@/lib/order-context"
import { LandingScreen } from "@/components/kiosk/screens/landing-screen"
import { MenuScreen } from "@/components/kiosk/screens/menu-screen"
import { FlavorsScreen } from "@/components/kiosk/screens/flavors-screen"
import { OptionsScreen } from "@/components/kiosk/screens/options-screen"
import { DiscountsScreen } from "@/components/kiosk/screens/discounts-screen"
import { PaymentScreen } from "@/components/kiosk/screens/payment-screen"
import { ConfirmationScreen } from "@/components/kiosk/screens/confirmation-screen"
import { products } from "@/lib/mock-data"

// Screen indices
const SCREEN = {
  LANDING: 0,
  MENU: 1,
  FLAVORS: 2,
  OPTIONS: 3,
  DISCOUNTS: 4,
  PAYMENT: 5,
  CONFIRMATION: 6,
} as const

type ScreenIndex = (typeof SCREEN)[keyof typeof SCREEN]

export default function KioskApp() {
  const { dispatch } = useOrder()

  // ── Screen navigation state ──
  const [activeScreen, setActiveScreen] = useState<ScreenIndex>(SCREEN.LANDING)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState<"left" | "right">("left")

  // ── Navigation params passed between screens ──
  const [navProductId, setNavProductId] = useState<string | null>(null)
  const [navCartId, setNavCartId] = useState<string | null>(null)
  const [navFlavorIds, setNavFlavorIds] = useState<string[]>([])
  const [showMenuToast, setShowMenuToast] = useState(false)

  // ── Preload all product images on mount ──
  useEffect(() => {
    const allSrcs = products.map((p) => p.image).filter(Boolean)
    allSrcs.forEach((src) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = src
    })
  }, [])

  // ── Navigate with slide animation ──
  const navigateTo = useCallback(
    (screen: ScreenIndex, dir: "left" | "right" = "left") => {
      if (isTransitioning) return
      setDirection(dir)
      setIsTransitioning(true)
      // Allow a single frame for the direction class to be applied, then set screen
      requestAnimationFrame(() => {
        setActiveScreen(screen)
        // Clear transitioning flag after the CSS transition completes
        setTimeout(() => setIsTransitioning(false), 320)
      })
    },
    [isTransitioning]
  )

  // ── Navigation callbacks ──
  const goToLanding = useCallback(() => {
    setActiveScreen(SCREEN.LANDING)
    setIsTransitioning(false)
    setNavProductId(null)
    setNavCartId(null)
    setNavFlavorIds([])
    setShowMenuToast(false)
  }, [])

  const handleOrderType = useCallback(
    (type: "takeout" | "dine-in") => {
      dispatch({ type: "SET_ORDER_TYPE", payload: type })
      navigateTo(SCREEN.MENU, "left")
    },
    [dispatch, navigateTo]
  )

  const handleGoToFlavors = useCallback(
    (productId: string, cartId: string) => {
      setNavProductId(productId)
      setNavCartId(cartId)
      navigateTo(SCREEN.FLAVORS, "left")
    },
    [navigateTo]
  )

  const handleGoToOptions = useCallback(
    (cartId: string) => {
      // Find the cart item to get productId
      setNavCartId(cartId)
      navigateTo(SCREEN.OPTIONS, "left")
    },
    [navigateTo]
  )

  const handleFlavorsComplete = useCallback(
    (productId: string, flavors: import("@/lib/mock-data").Flavor[]) => {
      setNavProductId(productId)
      setNavFlavorIds(flavors.map((f) => f.id))
      navigateTo(SCREEN.OPTIONS, "left")
    },
    [navigateTo]
  )

  const handleOptionsComplete = useCallback(() => {
    setShowMenuToast(true)
    navigateTo(SCREEN.MENU, "right")
    // Clear toast after a delay
    setTimeout(() => setShowMenuToast(false), 3000)
  }, [navigateTo])

  const handleGoToDiscounts = useCallback(() => {
    navigateTo(SCREEN.DISCOUNTS, "left")
  }, [navigateTo])

  const handleGoToPayment = useCallback(() => {
    navigateTo(SCREEN.PAYMENT, "left")
  }, [navigateTo])

  const handlePaymentComplete = useCallback(() => {
    navigateTo(SCREEN.CONFIRMATION, "left")
  }, [navigateTo])

  const handleReset = useCallback(() => {
    goToLanding()
  }, [goToLanding])

  // ── Determine which screens to render ──
  // We always render the current screen. For performance, we also keep
  // the adjacent screens mounted for instant sliding.
  const screenComponents: Record<ScreenIndex, React.ReactNode> = {
    [SCREEN.LANDING]: (
      <LandingScreen onSelectOrderType={handleOrderType} />
    ),
    [SCREEN.MENU]: (
      <MenuScreen
        onBack={goToLanding}
        onGoToFlavors={handleGoToFlavors}
        onGoToOptions={handleGoToOptions}
        onGoToDiscounts={handleGoToDiscounts}
        showAddedToast={showMenuToast}
      />
    ),
    [SCREEN.FLAVORS]: (
      <FlavorsScreen
        productId={navProductId}
        onBack={() => navigateTo(SCREEN.MENU, "right")}
        onComplete={handleFlavorsComplete}
        onHome={goToLanding}
      />
    ),
    [SCREEN.OPTIONS]: (
      <OptionsScreen
        productId={navProductId}
        flavorIds={navFlavorIds}
        onBack={() => navigateTo(SCREEN.FLAVORS, "right")}
        onComplete={handleOptionsComplete}
        onHome={goToLanding}
      />
    ),
    [SCREEN.DISCOUNTS]: (
      <DiscountsScreen
        onBack={() => navigateTo(SCREEN.MENU, "right")}
        onGoToPayment={handleGoToPayment}
        onHome={goToLanding}
      />
    ),
    [SCREEN.PAYMENT]: (
      <PaymentScreen
        onBack={() => navigateTo(SCREEN.DISCOUNTS, "right")}
        onComplete={handlePaymentComplete}
        onHome={goToLanding}
      />
    ),
    [SCREEN.CONFIRMATION]: (
      <ConfirmationScreen onReset={handleReset} />
    ),
  }

  return (
    <div className="relative flex flex-1 overflow-hidden">
      {/* Render all screens in a horizontal track */}
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{
          width: `${Object.keys(SCREEN).length * 100}%`,
          transform: `translateX(-${activeScreen * (100 / Object.keys(SCREEN).length)}%)`,
        }}
      >
        {Object.values(SCREEN).map((screenIdx) => (
          <div
            key={screenIdx}
            className="flex h-full shrink-0 flex-col"
            style={{ width: `${100 / Object.keys(SCREEN).length}%` }}
          >
            {screenComponents[screenIdx]}
          </div>
        ))}
      </div>
    </div>
  )
}
