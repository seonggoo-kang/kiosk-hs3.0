"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Check, ChevronDown, Hourglass } from "lucide-react"
import { useOrder } from "@/lib/order-context"
import { cn } from "@/lib/utils"

const STEPS = [
  { label: "매장/포장 선택" },
  { label: "메뉴 선택" },
  { label: "주문확인" },
  { label: "결제하기" },
  { label: "결제완료" },
] as const

interface ProgressStepperProps {
  currentStep: 1 | 2 | 3 | 4 | 5
  elapsedSeconds: number
}

export function ProgressStepper({ currentStep, elapsedSeconds }: ProgressStepperProps) {
  const { state, dispatch } = useOrder()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("pointerdown", handler)
    return () => document.removeEventListener("pointerdown", handler)
  }, [dropdownOpen])

  const handleSwitchOrderType = useCallback(
    (type: "takeout" | "dine-in") => {
      dispatch({ type: "SET_ORDER_TYPE", payload: type })
      setDropdownOpen(false)
    },
    [dispatch]
  )

  return (
    <div className="relative shrink-0 border-b border-border bg-card px-2 py-1.5">
      <div className="flex items-center">
        {/* Steps */}
        <div className="flex flex-1 items-center gap-0">
          {STEPS.map((step, i) => {
            const stepNum = (i + 1) as 1 | 2 | 3 | 4 | 5
            const isCompleted = stepNum < currentStep
            const isActive = stepNum === currentStep
            const isUpcoming = stepNum > currentStep

            return (
              <div key={i} className="flex items-center">
                {/* Connector line (before each step except the first) */}
                {i > 0 && (
                  <div
                    className={cn(
                      "mx-0.5 h-px w-2",
                      isCompleted || isActive ? "bg-primary" : "bg-border"
                    )}
                    style={isUpcoming ? { backgroundImage: "repeating-linear-gradient(90deg, hsl(var(--border)) 0 3px, transparent 3px 6px)", backgroundColor: "transparent" } : undefined}
                  />
                )}

                <div className="flex flex-col items-center gap-0.5">
                  {/* Circle */}
                  <div className="relative flex items-center gap-0.5">
                    {isCompleted ? (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                        <Check className="h-2.5 w-2.5 text-primary-foreground" strokeWidth={3} />
                      </div>
                    ) : isActive ? (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full border-[1.5px] border-primary bg-background">
                        <span className="text-[8px] font-bold leading-none text-primary">{stepNum}</span>
                      </div>
                    ) : (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full border border-border bg-background">
                        <span className="text-[8px] font-medium leading-none text-muted-foreground">{stepNum}</span>
                      </div>
                    )}

                    {/* Step 1 dropdown trigger */}
                    {i === 0 && (
                      <button
                        onClick={() => setDropdownOpen((o) => !o)}
                        className={cn(
                          "flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-colors",
                          dropdownOpen ? "border-primary bg-primary/10" : "border-border bg-background"
                        )}
                        aria-label="주문 유형 변경"
                      >
                        <ChevronDown className={cn("h-2 w-2 transition-transform", dropdownOpen && "rotate-180")} />
                      </button>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={cn(
                      "whitespace-nowrap text-center leading-none",
                      isCompleted ? "text-[7px] font-medium text-primary" :
                      isActive ? "text-[7px] font-bold text-foreground" :
                      "text-[7px] font-normal text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
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

      {/* Step 1 dropdown popover */}
      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-2 top-full z-50 mt-0.5 w-32 rounded-lg border border-border bg-card p-1 shadow-lg"
        >
          <button
            onClick={() => handleSwitchOrderType("takeout")}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors",
              state.orderType === "takeout" ? "bg-primary/10 font-bold text-primary" : "text-foreground hover:bg-muted/60"
            )}
          >
            {state.orderType === "takeout" && <Check className="h-3 w-3 text-primary" />}
            <span className={state.orderType === "takeout" ? "" : "ml-5"}>{"가져가기"}</span>
          </button>
          <button
            onClick={() => handleSwitchOrderType("dine-in")}
            className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors",
              state.orderType === "dine-in" ? "bg-primary/10 font-bold text-primary" : "text-foreground hover:bg-muted/60"
            )}
          >
            {state.orderType === "dine-in" && <Check className="h-3 w-3 text-primary" />}
            <span className={state.orderType === "dine-in" ? "" : "ml-5"}>{"먹고가기"}</span>
          </button>
        </div>
      )}
    </div>
  )
}
