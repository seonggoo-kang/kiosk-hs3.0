"use client"

import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { useOrder } from "@/lib/order-context"
import { formatPrice } from "@/lib/mock-data"
import { ProgressStepper } from "@/components/kiosk/progress-stepper"

interface ConfirmationScreenProps {
  onReset: () => void
  currentStep: 1 | 2 | 3 | 4 | 5
  elapsedSeconds: number
}

export function ConfirmationScreen({ onReset, currentStep, elapsedSeconds }: ConfirmationScreenProps) {
  const { state, finalAmount, totalItems, dispatch } = useOrder()
  const [orderNumber] = useState(() => Math.floor(Math.random() * 900) + 100)

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: "RESET_ORDER" })
      onReset()
    }, 15000)
    return () => clearTimeout(timer)
  }, [dispatch, onReset])

  return (
    <div className="flex flex-1 flex-col bg-card">
      <ProgressStepper currentStep={currentStep} elapsedSeconds={elapsedSeconds} />
      <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent">
          <CheckCircle2 className="h-14 w-14 text-primary" />
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">주문번호</p>
          <p className="mt-1 text-5xl font-extrabold text-foreground">{orderNumber}</p>
        </div>

        <div className="w-full max-w-xs rounded-xl border border-border bg-muted/50 p-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-sm text-muted-foreground">주문유형</span>
            <span className="text-sm font-semibold text-foreground">
              {state.orderType === "takeout" ? "가져가기" : "먹고가기"}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-border py-3">
            <span className="text-sm text-muted-foreground">주문수량</span>
            <span className="text-sm font-semibold text-foreground">{totalItems}개</span>
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="text-sm text-muted-foreground">결제금액</span>
            <span className="text-lg font-extrabold text-primary">{formatPrice(finalAmount)}</span>
          </div>
        </div>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          주문이 완료되었습니다.<br />카운터에서 주문번호를 확인해 주세요.
        </p>

        <button
          onClick={() => { dispatch({ type: "RESET_ORDER" }); onReset() }}
          className="mt-4 flex h-14 w-full max-w-xs items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground transition-colors active:opacity-80"
        >
          처음으로
        </button>

        <p className="text-[11px] text-muted-foreground">15초 후 자동으로 처음 화면으로 이동합니다.</p>
      </div>
      </div>
    </div>
  )
}
