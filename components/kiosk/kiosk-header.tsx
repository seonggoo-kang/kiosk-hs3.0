"use client"

import { Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { useOrder } from "@/lib/order-context"

export function KioskHeader({ title }: { title: string }) {
  const router = useRouter()
  const { dispatch } = useOrder()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-2.5">
        <img
          src="/images/br-logo.png"
          alt="Baskin Robbins"
          className="h-7 w-auto"
        />
        <h1 className="text-base font-semibold text-foreground">{title}</h1>
      </div>
      <button
        onClick={() => {
          dispatch({ type: "RESET_ORDER" })
          router.push("/")
        }}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-primary transition-colors active:bg-accent"
        aria-label="홈으로"
      >
        <Home className="h-6 w-6" />
      </button>
    </header>
  )
}
