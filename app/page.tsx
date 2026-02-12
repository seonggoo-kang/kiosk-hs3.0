"use client"

import { useRouter } from "next/navigation"
import { ShoppingBag, Store, Accessibility, Sun, Search, Languages } from "lucide-react"
import { useOrder } from "@/lib/order-context"

export default function LandingPage() {
  const router = useRouter()
  const { dispatch } = useOrder()

  const handleOrderType = (type: "takeout" | "dine-in") => {
    dispatch({ type: "SET_ORDER_TYPE", payload: type })
    router.push("/menu")
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Main area with pattern background */}
      <div className="relative flex flex-1 flex-col items-center justify-center bg-muted">
        {/* Subtle decorative pattern */}
        <div className="absolute inset-0 opacity-[0.06]" aria-hidden="true">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="kiosk-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="8" fill="currentColor" />
                <path d="M55 10 L60 20 L50 20 Z" fill="currentColor" />
                <rect x="15" y="55" width="12" height="3" rx="1.5" fill="currentColor" transform="rotate(-30 21 56.5)" />
                <circle cx="60" cy="55" r="6" fill="currentColor" />
                <path d="M35 45 L38 38 L41 45 Z" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#kiosk-pattern)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-baseline gap-1">
            <span className="text-6xl font-extrabold text-primary">B</span>
            <span className="text-6xl font-extrabold" style={{ color: "hsl(220, 65%, 40%)" }}>R</span>
          </div>
          <p className="mt-1 text-lg font-bold tracking-wide" style={{ color: "hsl(220, 65%, 40%)" }}>
            baskin robbins
          </p>
          <p className="mt-4 text-base font-medium text-muted-foreground">배라 프로모션</p>
        </div>
      </div>

      {/* Order type selection */}
      <div className="shrink-0 bg-muted px-5 pb-4">
        <div className="flex gap-4">
          <button
            onClick={() => handleOrderType("takeout")}
            className="flex flex-1 flex-col items-center gap-3 rounded-2xl bg-card py-6 shadow-sm transition-all active:scale-[0.97] active:shadow-md"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent">
              <ShoppingBag className="h-7 w-7 text-primary" />
            </div>
            <span className="text-base font-bold text-foreground">가져가기</span>
          </button>
          <button
            onClick={() => handleOrderType("dine-in")}
            className="flex flex-1 flex-col items-center gap-3 rounded-2xl bg-card py-6 shadow-sm transition-all active:scale-[0.97] active:shadow-md"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent">
              <Store className="h-7 w-7 text-primary" />
            </div>
            <span className="text-base font-bold text-foreground">먹고가기</span>
          </button>
        </div>
      </div>

      {/* Bottom accessibility bar */}
      <div className="flex shrink-0 items-center justify-between border-t border-border bg-card px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground">카운터에서도 주문할 수 있어요.</p>
        <div className="flex items-center gap-4">
          <button className="flex flex-col items-center gap-0.5" aria-label="낮은자세">
            <Accessibility className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">낮은자세</span>
          </button>
          <button className="flex flex-col items-center gap-0.5" aria-label="고대비">
            <Sun className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">고대비</span>
          </button>
          <button className="flex flex-col items-center gap-0.5" aria-label="돋보기">
            <Search className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">돋보기</span>
          </button>
          <button className="flex flex-col items-center gap-0.5" aria-label="Language">
            <Languages className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">Language</span>
          </button>
        </div>
      </div>
    </div>
  )
}
