"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { ProgressStepper } from "@/components/kiosk/progress-stepper"
import { KioskFooter } from "@/components/kiosk/kiosk-footer"
import { ActionBar } from "@/components/kiosk/action-bar"
import { NumpadModal } from "@/components/kiosk/numpad-modal"
import { useOrder } from "@/lib/order-context"
import { discountSections, formatPrice } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// Brand logo components
function BRLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 24" fill="none">
      <text x="0" y="18" fontFamily="Arial Black, sans-serif" fontSize="16" fontWeight="900" fill="#D5267B">B</text>
      <text x="12" y="18" fontFamily="Arial Black, sans-serif" fontSize="16" fontWeight="900" fill="#009CDC">R</text>
    </svg>
  )
}

function HappyPointIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3" stroke="#0066B3" strokeWidth="2" />
      <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#0066B3" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="5" r="1" fill="#0066B3" />
    </svg>
  )
}

function KTLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 20" fill="none">
      <text x="0" y="16" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="600" fill="#E4002B">kt</text>
    </svg>
  )
}

function TMobileLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center rounded bg-[#6236FF]", className)}>
      <span className="text-[10px] font-bold text-white">T</span>
    </div>
  )
}

function KIALogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 20" fill="none">
      <text x="0" y="16" fontFamily="Arial Black, sans-serif" fontSize="14" fontWeight="900" fill="#05141F">KIA</text>
    </svg>
  )
}

function BlueMemberLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 16" fill="none">
      <text x="0" y="12" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="600" fill="#003DA5">Blue</text>
      <text x="26" y="12" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="600" fill="#E4002B">members</text>
    </svg>
  )
}

function PlaceholderIcon({ className }: { className?: string }) {
  return <div className={cn("rounded-full bg-muted", className)} />
}

interface DiscountsScreenProps {
  onBack: () => void
  onGoToPayment: () => void
  onHome: () => void
  onGoToMenu?: () => void
  onGoToOrderReview?: () => void
  currentStep: 1 | 2 | 3 | 4 | 5
  elapsedSeconds: number
}

export function DiscountsScreen({ onBack, onGoToPayment, onHome, onGoToMenu, onGoToOrderReview, currentStep, elapsedSeconds }: DiscountsScreenProps) {
  const { state, dispatch, subtotal, totalDiscount, finalAmount } = useOrder()
  const [numpadOpen, setNumpadOpen] = useState(false)
  const [activeItems, setActiveItems] = useState<Set<string>>(new Set())
  const [brAppExpanded, setBrAppExpanded] = useState(true)
  const [membershipExpanded, setMembershipExpanded] = useState(true)
  const [carrierExpanded, setCarrierExpanded] = useState(true)

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

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "HappyPoint":
        return <HappyPointIcon className="h-6 w-6" />
      case "KT":
        return <KTLogo className="h-5 w-10" />
      case "TMobile":
        return <TMobileLogo className="h-5 w-5" />
      case "KIA":
        return <KIALogo className="h-4 w-10" />
      case "BlueMember":
        return <BlueMemberLogo className="h-4 w-20" />
      default:
        return <PlaceholderIcon className="h-6 w-6" />
    }
  }

  const membershipSection = discountSections.find((s) => s.id === "membership")
  const carrierSection = discountSections.find((s) => s.id === "carrier")

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
            <ProgressStepper currentStep={currentStep} elapsedSeconds={elapsedSeconds} onHome={onHome} onGoToStep={(step) => { if (step === 2 && onGoToMenu) onGoToMenu(); else if (step === 3 && onGoToOrderReview) onGoToOrderReview() }} />

      <div className="flex-1 overflow-y-auto bg-muted/30 px-3 py-3">
        {/* 배라앱 바코드 Section */}
        <section className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[11px] font-bold text-foreground">배라앱 바코드로 할인·적립·결제 한 번에!</h2>
            <button
              onClick={() => setBrAppExpanded(!brAppExpanded)}
              className="flex h-5 w-5 items-center justify-center rounded bg-primary text-white"
            >
              {brAppExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>
          {brAppExpanded && (
            <button
              onClick={() => handleItemToggle("br-app-pay", 500)}
              className={cn(
                "flex w-full flex-col items-center gap-0.5 rounded-full border-2 py-2.5 transition-all",
                activeItems.has("br-app-pay")
                  ? "border-primary bg-primary/5"
                  : "border-primary/30 bg-background"
              )}
            >
              <BRLogo className="h-4 w-7" />
              <span className="text-[10px] font-medium text-foreground">배라앱 매장 결제</span>
              <span className="text-[10px] font-bold text-primary">-500원</span>
            </button>
          )}
        </section>

        {/* 멤버십 혜택 Section */}
        {membershipSection && (
          <section className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-[11px] font-bold text-foreground">{membershipSection.title}</h2>
              <button
                onClick={() => setMembershipExpanded(!membershipExpanded)}
                className="flex h-5 w-5 items-center justify-center rounded bg-muted text-muted-foreground"
              >
                {membershipExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
              </button>
            </div>
            {membershipExpanded && (
              <div className="grid grid-cols-3 gap-2">
                {membershipSection.items.map((item) => {
                  const isActive = activeItems.has(item.id)
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === "happy-point") setNumpadOpen(true)
                        else handleItemToggle(item.id, item.discount)
                      }}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-2xl border bg-card px-2 py-3 transition-all active:scale-[0.97]",
                        isActive ? "border-primary shadow-sm" : "border-transparent"
                      )}
                    >
                      <div className="flex h-7 w-7 items-center justify-center">
                        {renderIcon(item.icon || "Circle")}
                      </div>
                      <span className="text-center text-[9px] font-medium leading-tight text-foreground">{item.name}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* 통신사/제휴 Section */}
        {carrierSection && (
          <section className="mb-4">
            <h2 className="mb-2 text-[11px] font-bold text-foreground">{carrierSection.title}</h2>
            <div className="grid grid-cols-3 gap-2">
              {carrierSection.items.map((item) => {
                const isActive = activeItems.has(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemToggle(item.id, item.discount)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-2xl border bg-card px-2 py-3 transition-all active:scale-[0.97]",
                      isActive ? "border-primary shadow-sm" : "border-transparent"
                    )}
                  >
                    <div className="flex h-7 w-7 items-center justify-center">
                      {renderIcon(item.icon || "Circle")}
                    </div>
                    <span className="text-center text-[9px] font-medium leading-tight text-foreground">{item.name}</span>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* 할인/적립 안함 Button */}
        <button
          onClick={onGoToPayment}
          className="mt-2 w-full rounded-2xl border border-border bg-card py-3 text-[11px] font-medium text-foreground transition-all active:scale-[0.98]"
        >
          할인/적립 안함
        </button>
      </div>

      {/* Bottom Summary */}
      <div className="shrink-0 border-t border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] text-muted-foreground">총 할인금액</span>
            <span className="text-xs font-bold text-foreground">{formatPrice(totalDiscount)}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] text-muted-foreground">최종 결제금액</span>
            <span className="text-base font-extrabold text-primary">{formatPrice(finalAmount)}</span>
          </div>
        </div>
      </div>

      <ActionBar onBack={onBack} primaryLabel="결제하기" onPrimary={onGoToPayment} primaryDisabled={subtotal === 0} />
      <KioskFooter />

      <NumpadModal
        open={numpadOpen}
        onClose={() => setNumpadOpen(false)}
        onSubmit={(phone) => {
          dispatch({ type: "APPLY_DISCOUNT", payload: { id: "phone-points", name: `포인트 (${phone})`, amount: 1000 } })
        }}
      />
    </div>
  )
}
