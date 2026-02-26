"use client"

import { Keyboard, Accessibility, HelpCircle } from "lucide-react"

export function KioskFooter() {
  return (
    <footer className="flex h-footer shrink-0 items-center justify-around border-t border-border bg-panel">
      <button className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground transition-colors active:text-foreground">
        <Keyboard className="h-3.5 w-3.5" />
        <span>교환권조회</span>
      </button>
      <div className="h-3 w-px bg-border" />
      <button className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground transition-colors active:text-foreground">
        <Accessibility className="h-3.5 w-3.5" />
        <span>낮은자세</span>
      </button>
      <div className="h-3 w-px bg-border" />
      <button className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground transition-colors active:text-foreground">
        <HelpCircle className="h-3.5 w-3.5" />
        <span>도움기능</span>
      </button>
    </footer>
  )
}
