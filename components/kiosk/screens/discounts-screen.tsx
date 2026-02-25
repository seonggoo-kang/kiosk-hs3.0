"use client"

import { useState } from "react"
import {
  Store, Ticket, Tag, Signal, Wifi,
  Circle, Hexagon, Car, Shield,
} from "lucide-react"
import { KioskHeader } from "@/components/kiosk/kiosk-header"
import { ProgressStepper } from "@/components/kiosk/progress-stepper"
import { KioskFooter } from "@/components/kiosk/kiosk-footer"
import { ActionBar } from "@/components/kiosk/action-bar"
import { NumpadModal } from "@/components/kiosk/numpad-modal"
import { useOrder } from "@/lib/order-context"
import { discountSections, formatPrice } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Store, Ticket, Tag, Signal, Wifi, Circle, Hexagon, Car, Shield,
}

interface DiscountsScreenProps {
  onBack: () => void
  onGoToPayment: () => void
  onHome: () => void
  currentStep: 1 | 2 | 3 | 4 | 5
  elapsedSeconds: number
}

export function DiscountsScreen({ onBack, onGoToPayment, onHome, currentStep, elapsedSeconds }: DiscountsScreenProps) {
  const { state, dispatch, subtotal, totalDiscount, finalAmount } = useOrder()
  const [numpadOpen, setNumpadOpen] = useState(false)
  const [activeItems, setActiveItems] = useState<Set<string>>(new Set())

  const handleItemToggle = (itemId: string, discount?: number) => {
    setActiveItems((prev) => {
      const next = new Set(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
        dispatch({ type: "REMOVE_DISCOUNT", payload: itemId })
      } else {
        next.add(itemId)
        if (discount && discount > 0) {
          dispatch({ type: "APPLY_DISCOUNT", payload: { id: itemId, name: itemId, amount: discount } })
        }
      }
      return next
    })
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <KioskHeader title="할인/적립" onHome={onHome} />
      <ProgressStepper currentStep={currentStep} elapsedSeconds={elapsedSeconds} />

      <div className="flex-1 overflow-y-auto bg-muted/40 p-4">
        {discountSections.map((section) => (
          <section key={section.id} className="mb-6">
            <h2 className="mb-2.5 text-base font-bold text-foreground">{section.title}</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {section.items.map((item) => {
                const IconComp = item.icon ? iconMap[item.icon] : null
                const isActive = activeItems.has(item.id)
                return (
                  <button key={item.id}
                    onClick={() => {
                      if (section.id === "points") setNumpadOpen(true)
                      else handleItemToggle(item.id, item.discount)
                    }}
                    className={cn("flex flex-col items-center gap-2 rounded-xl border-2 bg-card p-4 transition-all active:scale-[0.97]",
                      isActive ? "border-primary shadow-md" : "border-border"
                    )}>
                    {IconComp && (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <IconComp className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <span className="text-center text-sm font-semibold text-foreground">{item.name}</span>
                    {item.discount && item.discount > 0 && (
                      <span className="text-xs font-bold text-primary">-{formatPrice(item.discount)}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="shrink-0 border-t border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-muted-foreground">총 할인금액</span>
            <span className="text-base font-bold text-foreground">{formatPrice(totalDiscount)}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-muted-foreground">최종 결제금액</span>
            <span className="text-xl font-extrabold text-primary">{formatPrice(finalAmount)}</span>
          </div>
        </div>
      </div>

      <ActionBar onBack={onBack} primaryLabel="결제하기" onPrimary={onGoToPayment} primaryDisabled={subtotal === 0} />
      <KioskFooter />

      <NumpadModal open={numpadOpen} onClose={() => setNumpadOpen(false)}
        onSubmit={(phone) => {
          dispatch({ type: "APPLY_DISCOUNT", payload: { id: "phone-points", name: `포인트 (${phone})`, amount: 1000 } })
        }}
      />
    </div>
  )
}
