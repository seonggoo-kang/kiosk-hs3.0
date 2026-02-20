"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
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
    <div className="relative flex flex-1 flex-col">
      {/* Full-screen hero image */}
      <div className="absolute inset-0">
        <Image
          src="/images/landing-hero.jpg"
          alt="Baskin Robbins ice cream"
          fill
          className="object-cover"
          priority
          loading="eager"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/70" />
      </div>

      {/* Logo at top */}
      <div className="relative z-10 flex flex-col items-center pt-14">
        <div className="flex items-baseline gap-1.5">
          <span className="text-7xl font-extrabold text-white drop-shadow-lg">B</span>
          <span className="text-7xl font-extrabold text-pink-200 drop-shadow-lg">R</span>
        </div>
        <p className="mt-1 text-lg font-bold tracking-widest text-white/90 drop-shadow-md">
          BASKIN ROBBINS
        </p>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Order type buttons over image */}
      <div className="relative z-10 px-5 pb-4">
        <div className="flex gap-4">
          <button
            onClick={() => handleOrderType("takeout")}
            className="flex flex-1 flex-col items-center gap-3 rounded-2xl bg-white/95 py-6 shadow-lg backdrop-blur-sm transition-all active:scale-[0.97]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <ShoppingBag className="h-7 w-7 text-primary" />
            </div>
            <span className="text-base font-bold text-foreground">가져가기</span>
          </button>
          <button
            onClick={() => handleOrderType("dine-in")}
            className="flex flex-1 flex-col items-center gap-3 rounded-2xl bg-white/95 py-6 shadow-lg backdrop-blur-sm transition-all active:scale-[0.97]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <Store className="h-7 w-7 text-primary" />
            </div>
            <span className="text-base font-bold text-foreground">먹고가기</span>
          </button>
        </div>
      </div>

      {/* Bottom accessibility bar */}
      <div className="relative z-10 flex shrink-0 items-center justify-between bg-black/50 px-4 py-3 backdrop-blur-sm">
        <p className="text-xs font-medium text-white/70">카운터에서도 주문할 수 있어요.</p>
        <div className="flex items-center gap-4">
          <button className="flex flex-col items-center gap-0.5" aria-label="낮은자세">
            <Accessibility className="h-5 w-5 text-white/70" />
            <span className="text-[10px] text-white/70">낮은자세</span>
          </button>
          <button className="flex flex-col items-center gap-0.5" aria-label="고대비">
            <Sun className="h-5 w-5 text-white/70" />
            <span className="text-[10px] text-white/70">고대비</span>
          </button>
          <button className="flex flex-col items-center gap-0.5" aria-label="돋보기">
            <Search className="h-5 w-5 text-white/70" />
            <span className="text-[10px] text-white/70">돋보기</span>
          </button>
          <button className="flex flex-col items-center gap-0.5" aria-label="Language">
            <Languages className="h-5 w-5 text-white/70" />
            <span className="text-[10px] text-white/70">Language</span>
          </button>
        </div>
      </div>
    </div>
  )
}
