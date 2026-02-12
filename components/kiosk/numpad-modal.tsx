"use client"

import { useState } from "react"
import { X, Delete } from "lucide-react"
import { cn } from "@/lib/utils"

type NumpadModalProps = {
  open: boolean
  onClose: () => void
  onSubmit: (phone: string) => void
}

export function NumpadModal({ open, onClose, onSubmit }: NumpadModalProps) {
  const [phone, setPhone] = useState("010")
  const [tab, setTab] = useState<"number" | "barcode">("number")

  if (!open) return null

  const handleKey = (key: string) => {
    if (phone.length < 11) {
      setPhone((prev) => prev + key)
    }
  }

  const handleDelete = () => {
    if (phone.length > 3) {
      setPhone((prev) => prev.slice(0, -1))
    }
  }

  const handleClear = () => {
    setPhone("010")
  }

  const formatDisplay = (p: string) => {
    if (p.length <= 3) return p
    if (p.length <= 7) return `${p.slice(0, 3)}-${p.slice(3)}`
    return `${p.slice(0, 3)}-${p.slice(3, 7)}-${p.slice(7)}`
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-foreground/50 p-6">
      <div className="relative w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-card"
          aria-label="닫기"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Tabs */}
        <div className="mx-auto mb-5 flex w-fit rounded-full border border-border">
          <button
            onClick={() => setTab("number")}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-colors",
              tab === "number"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            )}
          >
            번호 입력
          </button>
          <button
            onClick={() => setTab("barcode")}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-colors",
              tab === "barcode"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            )}
          >
            바코드 스캔
          </button>
        </div>

        {tab === "number" ? (
          <>
            <h2 className="text-center text-lg font-bold text-foreground">
              휴대폰번호를 입력해 주세요.
            </h2>
            <p className="mt-1 text-center text-xs leading-relaxed text-muted-foreground">
              {"해피포인트 사용은 위 '사용 및 적립' 탭 선택 후"}
              <br />
              해피앱 바코드 인증을 해 주세요.
            </p>

            {/* Phone display */}
            <div className="my-4 text-center text-2xl font-bold tracking-wider text-foreground">
              {formatDisplay(phone)}
            </div>

            {/* Numpad */}
            <div className="mx-auto grid max-w-[280px] grid-cols-3 gap-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((key) => (
                <button
                  key={key}
                  onClick={() => handleKey(key)}
                  className="flex h-12 items-center justify-center rounded-xl border border-border bg-card text-lg font-semibold text-foreground transition-colors active:bg-muted"
                >
                  {key}
                </button>
              ))}
              <button
                onClick={handleClear}
                className="flex h-12 items-center justify-center rounded-xl border border-border bg-card text-xs font-semibold text-muted-foreground transition-colors active:bg-muted"
              >
                전체지움
              </button>
              <button
                onClick={() => handleKey("0")}
                className="flex h-12 items-center justify-center rounded-xl border border-border bg-card text-lg font-semibold text-foreground transition-colors active:bg-muted"
              >
                0
              </button>
              <button
                onClick={handleDelete}
                className="flex h-12 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors active:bg-muted"
              >
                <Delete className="h-5 w-5" />
              </button>
            </div>

            {/* QR promo */}
            <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
              할인, 적립, 쿠폰 등의 혜택을 받아보려면
              <br />
              해피포인트 회원이 되어보세요.
            </p>
          </>
        ) : (
          <div className="flex h-48 items-center justify-center">
            <p className="text-sm text-muted-foreground">바코드를 스캔해 주세요.</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-secondary-foreground"
          >
            비회원 적립
          </button>
          <button
            onClick={() => {
              onSubmit(phone)
              onClose()
            }}
            disabled={phone.length < 11}
            className={cn(
              "flex h-12 flex-1 items-center justify-center rounded-xl text-sm font-bold transition-colors",
              phone.length >= 11
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            적립하기
          </button>
        </div>
      </div>
    </div>
  )
}
