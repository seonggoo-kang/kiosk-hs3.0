"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useOrder } from "@/lib/order-context"
import { LandingScreen } from "@/components/kiosk/screens/landing-screen"
import { MenuScreen, type MenuScreenHandle } from "@/components/kiosk/screens/menu-screen"
import { FlavorsScreen } from "@/components/kiosk/screens/flavors-screen"
import { OptionsScreen } from "@/components/kiosk/screens/options-screen"
import { OrderReviewScreen } from "@/components/kiosk/screens/order-review-screen"
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
  ORDER_REVIEW: 4,
  DISCOUNTS: 5,
  PAYMENT: 6,
  CONFIRMATION: 7,
} as const

type ScreenIndex = (typeof SCREEN)[keyof typeof SCREEN]

export default function KioskApp() {
  // ── Client-only guard to avoid SSR hydration mismatch with Korean text ──
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { dispatch } = useOrder()

  // ── Screen navigation state ──
  const [activeScreen, setActiveScreen] = useState<ScreenIndex>(SCREEN.LANDING)
  const [prevScreen, setPrevScreen] = useState<ScreenIndex | null>(null)
  const [slideDir, setSlideDir] = useState<"left" | "right">("left")
  const [animating, setAnimating] = useState(false)

  // ── Session timer ──
  const [sessionStart, setSessionStart] = useState<number | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    if (sessionStart === null) { setElapsedSeconds(0); return }
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - sessionStart) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [sessionStart])

  // ── Compute current step from active screen ──
  const currentStep: 1 | 2 | 3 | 4 | 5 = (() => {
    switch (activeScreen) {
      case SCREEN.MENU: case SCREEN.FLAVORS: case SCREEN.OPTIONS: return 2
      case SCREEN.ORDER_REVIEW: return 3
      case SCREEN.DISCOUNTS: case SCREEN.PAYMENT: return 4
      case SCREEN.CONFIRMATION: return 5
      default: return 1
    }
  })()

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
      if (animating) return
      setSlideDir(dir)
      setPrevScreen(activeScreen)
      setActiveScreen(screen)
      setAnimating(true)
      setTimeout(() => {
        setPrevScreen(null)
        setAnimating(false)
      }, 300)
    },
    [animating, activeScreen]
  )

  // ── Instant reset (no animation) ──
  const goToLanding = useCallback(() => {
    setPrevScreen(null)
    setAnimating(false)
    setActiveScreen(SCREEN.LANDING)
    setNavProductId(null)
    setNavCartId(null)
    setNavFlavorIds([])
    setShowMenuToast(false)
    setSessionStart(null)
  }, [])

  // ── Navigation callbacks ──
  const handleOrderType = useCallback(
    (type: "takeout" | "dine-in") => {
      dispatch({ type: "SET_ORDER_TYPE", payload: type })
      setSessionStart(Date.now())
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
      setNavCartId(cartId)
      navigateTo(SCREEN.OPTIONS, "left")
    },
    [navigateTo]
  )

  // Ref to MenuScreen for imperative sheet reopen
  const menuScreenRef = useRef<MenuScreenHandle>(null)
  // Store saved required selections while user is on flavor screen
  const pendingSheetReqSelectionsRef = useRef<import("@/lib/order-context").ResolvedRequiredOption[]>([])

  const handleFlavorsComplete = useCallback(
    (productId: string, flavors: import("@/lib/mock-data").Flavor[]) => {
      if (navCartId === "__sheet__") {
        // Returning from flavor picker to the bottom sheet flow.
        // Navigate back to menu first, then reopen the sheet after the transition.
        navigateTo(SCREEN.MENU, "right")
        // Reopen the sheet after the slide animation completes (300ms)
        setTimeout(() => {
          menuScreenRef.current?.reopenSheetWithFlavors(productId, flavors, pendingSheetReqSelectionsRef.current)
          pendingSheetReqSelectionsRef.current = []
        }, 350)
      } else {
        setNavProductId(productId)
        setNavFlavorIds(flavors.map((f) => f.id))
        navigateTo(SCREEN.OPTIONS, "left")
      }
    },
    [navigateTo, navCartId]
  )

  const handleOptionsComplete = useCallback(() => {
    setShowMenuToast(true)
    navigateTo(SCREEN.MENU, "right")
    setTimeout(() => setShowMenuToast(false), 3000)
  }, [navigateTo])

  const handleGoToOrderReview = useCallback(() => {
    navigateTo(SCREEN.ORDER_REVIEW, "left")
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

  // ── Compute slide positions ──
  // Active screen: starts offset, slides to center (0%)
  // Previous screen: starts at center, slides away
  const getScreenStyle = (
    screenIdx: ScreenIndex
  ): React.CSSProperties => {
    const isActive = screenIdx === activeScreen
    const isPrev = screenIdx === prevScreen

    if (!isActive && !isPrev) {
      // Off-screen, hidden
      return {
        position: "absolute",
        inset: 0,
        transform: "translateX(100%)",
        visibility: "hidden",
        pointerEvents: "none",
      }
    }

    if (isActive && !animating) {
      // Settled in place
      return {
        position: "absolute",
        inset: 0,
        transform: "translateX(0%)",
        visibility: "visible",
        pointerEvents: "auto",
      }
    }

    if (isActive && animating) {
      // Sliding into view
      const from = slideDir === "left" ? "100%" : "-100%"
      return {
        position: "absolute",
        inset: 0,
        transform: "translateX(0%)",
        visibility: "visible",
        pointerEvents: "none",
        transition: "transform 300ms ease-out",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "--slide-from": from,
      } as any
    }

    if (isPrev && animating) {
      // Sliding out of view
      const to = slideDir === "left" ? "-100%" : "100%"
      return {
        position: "absolute",
        inset: 0,
        transform: `translateX(${to})`,
        visibility: "visible",
        pointerEvents: "none",
        transition: "transform 300ms ease-out",
      }
    }

    return {
      position: "absolute",
      inset: 0,
      visibility: "hidden",
      pointerEvents: "none",
    }
  }

  // We need a ref-based approach for the "slide in" animation:
  // On first render the active screen is at the offset, then we
  // animate it to 0. We use a key trick to trigger re-render.
  const [slideKey, setSlideKey] = useState(0)

  // When activeScreen changes while animating, kick a re-render
  // to trigger the CSS transition from offset → 0
  useEffect(() => {
    if (animating) {
      // Force the incoming screen to start at offset
      setSlideKey((k) => k + 1)
    }
  }, [activeScreen, animating])

  // Build screen elements
  const screens: Record<ScreenIndex, React.ReactNode> = {
    [SCREEN.LANDING]: (
      <LandingScreen onSelectOrderType={handleOrderType} />
    ),
    [SCREEN.MENU]: (
      <MenuScreen
        ref={menuScreenRef}
        onBack={goToLanding}
        onGoToFlavors={handleGoToFlavors}
        onGoToOptions={handleGoToOptions}
        onGoToDiscounts={handleGoToOrderReview}
        showAddedToast={showMenuToast}
        currentStep={currentStep}
        elapsedSeconds={elapsedSeconds}
        onSetPendingSheet={(productId, reqSelections) => { pendingSheetReqSelectionsRef.current = reqSelections }}
      />
    ),
    [SCREEN.FLAVORS]: (
      <FlavorsScreen
        productId={navProductId}
        onBack={() => navigateTo(SCREEN.MENU, "right")}
        onComplete={handleFlavorsComplete}
        onHome={goToLanding}
        currentStep={currentStep}
        elapsedSeconds={elapsedSeconds}
      />
    ),
    [SCREEN.OPTIONS]: (
      <OptionsScreen
        productId={navProductId}
        flavorIds={navFlavorIds}
        onBack={() => navigateTo(SCREEN.FLAVORS, "right")}
        onComplete={handleOptionsComplete}
        onHome={goToLanding}
        currentStep={currentStep}
        elapsedSeconds={elapsedSeconds}
      />
    ),
    [SCREEN.ORDER_REVIEW]: (
      <OrderReviewScreen
        onBack={() => navigateTo(SCREEN.MENU, "right")}
        onGoToDiscounts={handleGoToDiscounts}
        onHome={goToLanding}
        onGoToMenu={() => navigateTo(SCREEN.MENU, "right")}
        currentStep={currentStep}
        elapsedSeconds={elapsedSeconds}
      />
    ),
    [SCREEN.DISCOUNTS]: (
      <DiscountsScreen
        onBack={() => navigateTo(SCREEN.ORDER_REVIEW, "right")}
        onGoToPayment={handleGoToPayment}
        onHome={goToLanding}
        onGoToMenu={() => navigateTo(SCREEN.MENU, "right")}
        onGoToOrderReview={() => navigateTo(SCREEN.ORDER_REVIEW, "right")}
        currentStep={currentStep}
        elapsedSeconds={elapsedSeconds}
      />
    ),
    [SCREEN.PAYMENT]: (
      <PaymentScreen
        onBack={() => navigateTo(SCREEN.DISCOUNTS, "right")}
        onComplete={handlePaymentComplete}
        onHome={goToLanding}
        onGoToMenu={() => navigateTo(SCREEN.MENU, "right")}
        onGoToOrderReview={() => navigateTo(SCREEN.ORDER_REVIEW, "right")}
        currentStep={currentStep}
        elapsedSeconds={elapsedSeconds}
      />
    ),
    [SCREEN.CONFIRMATION]: (
      <ConfirmationScreen
        onReset={handleReset}
        currentStep={currentStep}
        elapsedSeconds={elapsedSeconds}
      />
    ),
  }

  if (!mounted) {
    return <div className="relative flex-1 overflow-hidden bg-background" />
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      {Object.values(SCREEN).map((idx) => {
        const isActive = idx === activeScreen
        const isPrev = idx === prevScreen
        
        // Don't mount ConfirmationScreen until it's needed (it has a timer that auto-resets)
        if (idx === SCREEN.CONFIRMATION && !isActive && !isPrev) {
          return null
        }
        
        if (!isActive && !isPrev) {
          // Keep mounted but invisible for instant access
          return (
            <div
              key={idx}
              className="absolute inset-0 flex flex-col overflow-hidden"
              style={{ visibility: "hidden", pointerEvents: "none" }}
            >
              {screens[idx]}
            </div>
          )
        }

        if (isPrev && animating) {
          // Sliding out
          const to = slideDir === "left" ? "-100%" : "100%"
          return (
            <div
              key={idx}
              className="absolute inset-0 flex flex-col overflow-hidden"
              style={{
                transform: `translateX(${to})`,
                transition: "transform 300ms ease-out",
                pointerEvents: "none",
              }}
            >
              {screens[idx]}
            </div>
          )
        }

        // Active screen
        return (
          <SlideIn
            key={`${idx}-${slideKey}`}
            from={animating ? (slideDir === "left" ? "100%" : "-100%") : "0%"}
            active
          >
            {screens[idx]}
          </SlideIn>
        )
      })}
    </div>
  )
}

/**
 * A wrapper that slides its children from `from` → 0% on mount.
 * Uses requestAnimationFrame to ensure the initial offset is painted
 * before transitioning to 0%.
 */
function SlideIn({
  from,
  active,
  children,
}: {
  from: string
  active: boolean
  children: React.ReactNode
}) {
  const [offset, setOffset] = useState(from)

  useEffect(() => {
    if (from === "0%") return
    // After the first paint with the offset, transition to 0
    const raf = requestAnimationFrame(() => {
      setOffset("0%")
    })
    return () => cancelAnimationFrame(raf)
  }, [from])

  return (
    <div
      className="absolute inset-0 flex flex-col overflow-hidden"
      style={{
        transform: `translateX(${offset})`,
        transition: offset === from && from !== "0%" ? "none" : "transform 300ms ease-out",
        pointerEvents: active ? "auto" : "none",
      }}
    >
      {children}
    </div>
  )
}
