/**
 * ══════════════════════════════════════════════════════════════════════════════
 * BR KIOSK UI PRIMITIVES
 * ══════════════════════════════════════════════════════════════════════════════
 * 
 * Standardized UI components for consistent design across all screens.
 * Import these components instead of creating inline styles.
 * 
 * Usage:
 * import { ActionButton, QuantityStepper, RemoveButton, ScrollIndicators } from '@/components/kiosk/ui'
 * 
 * ══════════════════════════════════════════════════════════════════════════════
 */

"use client"

import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes } from "react"
import { ChevronUp, ChevronDown, Minus, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"


// ══════════════════════════════════════════════════════════════════════════════
// ACTION BUTTON
// ══════════════════════════════════════════════════════════════════════════════

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
      secondary: "bg-muted text-foreground hover:bg-muted/80 active:bg-muted/70",
      ghost: "bg-transparent text-foreground hover:bg-muted active:bg-muted/80",
    }

    const sizes = {
      sm: "h-10 px-4 text-xs",
      md: "h-12 px-6 text-sm",
      lg: "h-14 px-8 text-base",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-bold transition-colors disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
ActionButton.displayName = "ActionButton"


// ══════════════════════════════════════════════════════════════════════════════
// QUANTITY STEPPER
// ══════════════════════════════════════════════════════════════════════════════

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: "sm" | "md"
  className?: string
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  className,
}: QuantityStepperProps) {
  const sizes = {
    sm: {
      container: "h-7",
      button: "h-6 w-6",
      icon: "h-3 w-3",
      value: "min-w-[24px] text-[10px]",
    },
    md: {
      container: "h-8",
      button: "h-7 w-7",
      icon: "h-3.5 w-3.5",
      value: "min-w-[28px] text-xs",
    },
  }

  const s = sizes[size]

  return (
    <div className={cn("inline-flex items-center gap-0.5 rounded-full border border-border bg-card", s.container, className)}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn("flex items-center justify-center rounded-full transition-colors hover:bg-muted active:bg-muted/80 disabled:opacity-30", s.button)}
      >
        <Minus className={s.icon} />
      </button>
      <span className={cn("text-center font-bold text-primary", s.value)}>{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn("flex items-center justify-center rounded-full transition-colors hover:bg-muted active:bg-muted/80 disabled:opacity-30", s.button)}
      >
        <Plus className={s.icon} />
      </button>
    </div>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
// REMOVE BUTTON
// ══════════════════════════════════════════════════════════════════════════════

interface RemoveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg"
}

export const RemoveButton = forwardRef<HTMLButtonElement, RemoveButtonProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizes = {
      sm: { button: "h-4 w-4", icon: "h-2.5 w-2.5" },
      md: { button: "h-5 w-5", icon: "h-3 w-3" },
      lg: { button: "h-6 w-6", icon: "h-3.5 w-3.5" },
    }

    const s = sizes[size]

    return (
      <button
        ref={ref}
        className={cn(
          "flex items-center justify-center rounded-full bg-foreground/70 text-white transition-opacity hover:bg-foreground/90",
          s.button,
          className
        )}
        {...props}
      >
        <X className={s.icon} />
      </button>
    )
  }
)
RemoveButton.displayName = "RemoveButton"


// ══════════════════════════════════════════════════════════════════════════════
// SCROLL INDICATORS
// ══════════════════════════════════════════════════════════════════════════════

interface ScrollIndicatorsProps {
  canScrollUp: boolean
  canScrollDown: boolean
  onScrollUp: () => void
  onScrollDown: () => void
  className?: string
}

export function ScrollIndicators({
  canScrollUp,
  canScrollDown,
  onScrollUp,
  onScrollDown,
  className,
}: ScrollIndicatorsProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <button
        onClick={onScrollUp}
        disabled={!canScrollUp}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card shadow-sm transition-colors hover:bg-muted disabled:opacity-30"
      >
        <ChevronUp className="h-4 w-4" />
      </button>
      <button
        onClick={onScrollDown}
        disabled={!canScrollDown}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card shadow-sm transition-colors hover:bg-muted disabled:opacity-30"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
// SUMMARY BAR
// ══════════════════════════════════════════════════════════════════════════════

interface SummaryBarProps extends HTMLAttributes<HTMLDivElement> {
  leftLabel?: string
  leftValue?: string | number
  rightLabel?: string
  rightValue?: string
  leftBadge?: boolean
}

export function SummaryBar({
  leftLabel = "주문수량",
  leftValue,
  rightLabel = "총 주문금액",
  rightValue,
  leftBadge = true,
  className,
  ...props
}: SummaryBarProps) {
  return (
    <div className={cn("flex items-center justify-between bg-card px-3 py-2", className)} {...props}>
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium text-foreground">{leftLabel}</span>
        {leftValue !== undefined && (
          leftBadge ? (
            <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
              {leftValue}
            </span>
          ) : (
            <span className="text-[11px] font-bold text-primary">{leftValue}</span>
          )
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium text-foreground">{rightLabel}</span>
        {rightValue && (
          <span className="text-lg font-extrabold text-primary">{rightValue}</span>
        )}
      </div>
    </div>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
// SECTION TITLE
// ══════════════════════════════════════════════════════════════════════════════

interface SectionTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  size?: "sm" | "md" | "lg"
}

export function SectionTitle({ size = "md", className, children, ...props }: SectionTitleProps) {
  const sizes = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  }

  return (
    <h3 className={cn("font-bold text-foreground", sizes[size], className)} {...props}>
      {children}
    </h3>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
// CARD
// ══════════════════════════════════════════════════════════════════════════════

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-border bg-card shadow-sm",
          interactive && "transition-transform active:scale-[0.98]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = "Card"


// ══════════════════════════════════════════════════════════════════════════════
// BADGE
// ══════════════════════════════════════════════════════════════════════════════

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md"
}

export function Badge({ variant = "primary", size = "md", className, children, ...props }: BadgeProps) {
  const variants = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-muted text-muted-foreground",
    outline: "border border-border bg-transparent text-foreground",
  }

  const sizes = {
    sm: "h-4 px-1.5 text-[8px]",
    md: "h-5 px-2 text-[9px]",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
// PANEL
// ══════════════════════════════════════════════════════════════════════════════

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  bordered?: boolean
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ className, bordered = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-panel px-3 py-2",
          bordered && "border-t border-border",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Panel.displayName = "Panel"


// ══════════════════════════════════════════════════════════════════════════════
// FLAVOR PILL
// ══════════════════════════════════════════════════════════════════════════════

interface FlavorPillProps extends HTMLAttributes<HTMLSpanElement> {
  image?: string
  name: string
  onRemove?: () => void
}

export function FlavorPill({ image, name, onRemove, className, ...props }: FlavorPillProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2 text-[9px] font-medium text-foreground",
        className
      )}
      {...props}
    >
      {image && (
        <img src={image} alt="" className="h-[18px] w-[18px] rounded-full object-cover" />
      )}
      <span className="truncate">{name}</span>
      {onRemove && (
        <button onClick={onRemove} className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-foreground/10">
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </span>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
// PRICE
// ══════════════════════════════════════════════════════════════════════════════

interface PriceProps extends HTMLAttributes<HTMLSpanElement> {
  value: number | string
  size?: "sm" | "md" | "lg" | "xl"
  showWon?: boolean
}

export function Price({ value, size = "md", showWon = true, className, ...props }: PriceProps) {
  const sizes = {
    sm: "text-[10px] font-bold",
    md: "text-xs font-bold",
    lg: "text-sm font-bold",
    xl: "text-lg font-extrabold",
  }

  const formatted = typeof value === "number" 
    ? value.toLocaleString("ko-KR") 
    : value

  return (
    <span className={cn("text-primary", sizes[size], className)} {...props}>
      {formatted}{showWon && "원"}
    </span>
  )
}


// ══════════════════════════════════════════════════════════════════════════════
// CATEGORY TAB
// ══════════════════════════════════════════════════════════════════════════════

interface CategoryTabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export const CategoryTab = forwardRef<HTMLButtonElement, CategoryTabProps>(
  ({ active = false, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "flex h-10 items-center justify-center text-[10px] font-medium transition-colors",
          active
            ? "border-b-2 border-primary font-bold text-primary"
            : "border-b-2 border-transparent text-muted-foreground hover:text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
CategoryTab.displayName = "CategoryTab"


// ══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════════════════════

export const UI = {
  ActionButton,
  QuantityStepper,
  RemoveButton,
  ScrollIndicators,
  SummaryBar,
  SectionTitle,
  Card,
  Badge,
  Panel,
  FlavorPill,
  Price,
  CategoryTab,
}

export default UI
