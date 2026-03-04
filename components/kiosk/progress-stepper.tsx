"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Home, Check, ChevronDown, Hourglass } from "lucide-react"
import { useOrder } from "@/lib/order-context"
import { cn } from "@/lib/utils"

const STEP_LABELS = ["", "메뉴 선택", "주문확인", "할인/적립", "결제완료"] as const

interface ProgressStepperProps {
  currentStep: 1 | 2 | 3 | 4 | 5
  elapsedSeconds: number
  onHome?: () => void
  onGoToStep?: (step: number) => void
}

export function ProgressStepper({ currentStep, elapsedSeconds, onHome, onGoToStep }: ProgressStepperProps) {
  const { state, dispatch } = useOrder()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e: PointerEvent) => {
      const target = e.target as Node
      // Ignore clicks on the toggle area (label + chevron) -- those handle their own toggle
      if (toggleRef.current?.contains(target)) return
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("pointerdown", handler)
    return () => document.removeEventListener("pointerdown", handler)
  }, [dropdownOpen])

  const toggleDropdown = useCallback(() => setDropdownOpen((o) => !o), [])

  const handleSwitchOrderType = useCallback(
    (type: "takeout" | "dine-in") => {
      dispatch({ type: "SET_ORDER_TYPE", payload: type })
      setDropdownOpen(false)
    },
    [dispatch]
  )

  const step1Label = state.orderType === "takeout" ? "가져가기" : "먹고가기"
  const altType: "takeout" | "dine-in" = state.orderType === "takeout" ? "dine-in" : "takeout"
  const altLabel = altType === "takeout" ? "가져가기" : "먹고가기"

  return (
    <div className="relative shrink-0 border-b border-border bg-card">
      <div className="flex h-10 items-center px-1.5">
        {/* Home button */}
        {onHome && (
          <button
            onClick={() => {
              dispatch({ type: "RESET_ORDER" })
              onHome()
            }}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-primary transition-colors active:bg-accent"
            aria-label="홈으로"
          >
            <Home className="h-4 w-4" />
          </button>
        )}

        {/* Steps flow */}
        <div className="flex flex-1 items-center overflow-hidden">
          {[1, 2, 3, 4, 5].map((stepNum) => {
            const isCompleted = stepNum < currentStep
            const isActive = stepNum === currentStep
            const label = stepNum === 1 ? step1Label : STEP_LABELS[stepNum - 1]

            return (
              <div key={stepNum} className="flex items-center">
                {/* Arrow separator */}
                <span
                  className={cn(
                    "mx-0.5 text-[9px] leading-none",
                    isCompleted || isActive ? "text-primary/60" : "text-border"
                  )}
                >
                  {">"}
                </span>

                {/* Step circle */}
                {isCompleted ? (
                  <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Check className="h-2.5 w-2.5 text-primary-foreground" strokeWidth={3} />
                  </div>
                ) : isActive ? (
                  <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] border-primary bg-background">
                    <span className="text-[8px] font-bold leading-none text-primary">{stepNum}</span>
                  </div>
                ) : (
                  <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                    <span className="text-[8px] font-medium leading-none text-muted-foreground">{stepNum}</span>
                  </div>
                )}

                {/* Step 1: clickable label + dropdown chevron */}
                {stepNum === 1 ? (
                  <div ref={toggleRef} className="flex items-center">
                    <button
                      onPointerDown={(e) => { e.stopPropagation(); toggleDropdown() }}
                      className={cn(
                        "ml-0.5 whitespace-nowrap rounded px-1 py-0.5 text-[9px] font-bold leading-none transition-colors",
                        isCompleted ? "bg-primary/10 text-primary" : "bg-primary/10 text-foreground"
                      )}
                    >
                      {step1Label}
                    </button>
                    <button
                      onPointerDown={(e) => { e.stopPropagation(); toggleDropdown() }}
                      className={cn(
                        "ml-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-colors",
                        dropdownOpen ? "border-primary bg-primary/10" : "border-border bg-background"
                      )}
                      aria-label="주문 유형 변경"
                    >
                      <ChevronDown className={cn("h-2 w-2 transition-transform", dropdownOpen && "rotate-180")} />
                    </button>
                  </div>
                ) : isCompleted && onGoToStep ? (
                  <button
                    onClick={() => onGoToStep(stepNum)}
                    className="ml-0.5 whitespace-nowrap rounded px-1 py-0.5 text-[9px] font-medium leading-none text-primary transition-colors active:bg-primary/10"
                  >
                    {label}
                  </button>
                ) : (
                  <span
                    className={cn(
                      "ml-0.5 whitespace-nowrap leading-none",
                      isActive ? "text-[9px] font-bold text-foreground" :
                      "text-[9px] font-normal text-muted-foreground"
                    )}
                  >
                    {label}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Timer */}
        <div className="ml-1 flex shrink-0 items-center gap-0.5 rounded-full bg-muted/60 px-1.5 py-0.5">
          <Hourglass className="h-2.5 w-2.5 text-muted-foreground" />
          <span className="text-[9px] font-medium tabular-nums text-muted-foreground">
            {elapsedSeconds}
            {" 초"}
          </span>
        </div>
      </div>

      {/* Step 1 dropdown -- shows only the alternative option */}
      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-8 top-full z-50 mt-0.5 rounded-lg border border-border bg-card p-1 shadow-lg"
        >
          <button
            onClick={() => handleSwitchOrderType(altType)}
            className="flex w-full items-center gap-1.5 rounded-md px-3 py-1.5 text-left text-xs font-medium text-foreground transition-colors hover:bg-muted/60"
          >
            {altLabel}
            <span className="text-[10px] text-muted-foreground">{"(으)로 변경"}</span>
          </button>
        </div>
      )}
    </div>
  )
}
