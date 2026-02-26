"use client"

import { useState } from "react"
import { CreditCard, Wallet, Smartphone, Award, Banknote } from "lucide-react"
import { ProgressStepper } from "@/components/kiosk/progress-stepper"
import { KioskFooter } from "@/components/kiosk/kiosk-footer"
import { ActionBar } from "@/components/kiosk/action-bar"
import { useOrder } from "@/lib/order-context"
import { paymentMethods, formatPrice } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CreditCard, Wallet, Smartphone, Award, Banknote,
}

interface PaymentScreenProps {
  onBack: () => void
  onComplete: () => void
  onHome: () => void
  onGoToMenu?: () => void
  onGoToOrderReview?: () => void
  currentStep: 1 | 2 | 3 | 4 | 5
  elapsedSeconds: number
}

export function PaymentScreen({ onBack, onComplete, onHome, onGoToMenu, onGoToOrderReview, currentStep, elapsedSeconds }: PaymentScreenProps) {
  const { totalDiscount, finalAmount } = useOrder()
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
            <ProgressStepper currentStep={currentStep} elapsedSeconds={elapsedSeconds} onHome={onHome} onGoToStep={(step) => { if (step === 2 && onGoToMenu) onGoToMenu(); else if (step === 3 && onGoToOrderReview) onGoToOrderReview() }} />

      <div className="flex-1 overflow-y-auto bg-muted/40 p-4">
        <div className="grid grid-cols-2 gap-3">
          {paymentMethods.map((method) => {
            const IconComp = method.icons[0] ? iconMap[method.icons[0]] : null
            const isSelected = selectedMethod === method.id
            return (
              <button key={method.id} onClick={() => setSelectedMethod(method.id)}
                className={cn("flex flex-col items-center gap-3 rounded-xl border-2 bg-card p-6 transition-all active:scale-[0.97]",
                  isSelected ? "border-primary shadow-md" : "border-border"
                )}>
                {IconComp && (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                    <IconComp className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <span className="text-center text-sm font-semibold text-foreground">{method.name}</span>
                {method.description && (
                  <span className="text-center text-[11px] text-muted-foreground">{method.description}</span>
                )}
              </button>
            )
          })}
        </div>
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

      <ActionBar onBack={onBack}
        primaryLabel={selectedMethod ? "결제하기" : "결제취소"}
        onPrimary={() => { if (selectedMethod) onComplete(); else onBack() }}
        primaryDisabled={!selectedMethod}
      />
      <KioskFooter />
    </div>
  )
}
