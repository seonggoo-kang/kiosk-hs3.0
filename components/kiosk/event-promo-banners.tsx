"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"

// ── Promotion data ──────────────────────────────────────────
export type PromoBanner = {
  id: string
  /** Badge label */
  badge: string
  /** Main headline */
  headline: string
  /** Sub-description (2-3 lines) */
  description: string[]
  period?: string
  /** Detail image shown in the top hero area */
  detailImage: string
  /** Accent colour for badge + ring on selected thumbnail */
  accentColor: string
  /** Gradient for the detail overlay text area */
  overlayGradient: string
}

export const eventPromotions: PromoBanner[] = [
  {
    id: "super-week",
    badge: "해피오더",
    headline: "SUPER WEEK\n최대 5천원 OFF!",
    description: [
      "Coupon Zone에서 원하는 브랜드 쿠폰 다운!",
      "Bonus Zone에서 더 많은 혜택 확인하고 구매!",
      "참여 브랜드: 쉐이크쉑, 잠바주스, 패션파이브",
    ],
    period: "02.09 - 02.22",
    detailImage: "/promos/event-superweek.jpg",
    accentColor: "hsl(340, 75%, 55%)",
    overlayGradient: "from-rose-900/90 via-rose-900/60 to-transparent",
  },
  {
    id: "flavor-of-month",
    badge: "이달의 맛",
    headline: "진정한 쫀꾸렛",
    description: [
      "바삭 쫀득 초콜릿 아이스크림에",
      "초콜릿 쿠키와 브라우니가 가득!",
      "2월 한정 스페셜 플레이버",
    ],
    period: "02.01 - 02.28",
    detailImage: "/promos/event-flavor-month.jpg",
    accentColor: "hsl(25, 60%, 45%)",
    overlayGradient: "from-amber-950/90 via-amber-950/60 to-transparent",
  },
  {
    id: "double-cup",
    badge: "이달의 더블컵",
    headline: "싱글레귤러 +500원\n더블주니어로 UP!",
    description: [
      "이달의 맛 포함 싱글레귤러 주문 시",
      "500원만 추가하면 더블주니어!",
      "매장 방문 고객 한정 혜택",
    ],
    period: "02.01 - 02.28",
    detailImage: "/promos/event-double-cup.jpg",
    accentColor: "hsl(340, 70%, 55%)",
    overlayGradient: "from-pink-900/90 via-pink-900/60 to-transparent",
  },
  {
    id: "dubai-mochi",
    badge: "신제품 출시",
    headline: "두바이st 모찌 &\n두바이st 파르페",
    description: [
      "쫀득 바삭 두바이st 모찌 신메뉴!",
      "원물 가득 두바이st 파르페도 함께",
      "지금 매장에서 만나보세요",
    ],
    detailImage: "/promos/event-dubai-mochi.jpg",
    accentColor: "hsl(170, 60%, 40%)",
    overlayGradient: "from-teal-900/90 via-teal-900/60 to-transparent",
  },
  {
    id: "card-discount",
    badge: "삼성카드 LINK",
    headline: "삼성카드로 결제시\n2천원 즉시 할인!",
    description: [
      "삼성카드 LINK 연결 후 결제 시",
      "18,500원 이상 결제 시 2,000원 OFF",
      "해피포인트 앱에서 LINK 연결하세요",
    ],
    period: "02.01 - 02.28",
    detailImage: "/promos/event-card-discount.jpg",
    accentColor: "hsl(215, 80%, 55%)",
    overlayGradient: "from-blue-950/90 via-blue-950/60 to-transparent",
  },
]

// ── Component ───────────────────────────────────────────────
export function EventPromoBanners() {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const selected = eventPromotions[selectedIdx]

  // Horizontal drag scroll for thumbnails
  const stripRef = useRef<HTMLDivElement>(null)
  const dragStartX = useRef(0)
  const scrollStart = useRef(0)
  const dragged = useRef(false)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragStartX.current = e.clientX
    scrollStart.current = stripRef.current?.scrollLeft ?? 0
    dragged.current = false
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (e.buttons === 0) return
    const dx = e.clientX - dragStartX.current
    if (Math.abs(dx) > 4) dragged.current = true
    if (stripRef.current) {
      stripRef.current.scrollLeft = scrollStart.current - dx
    }
  }, [])

  const handleThumbClick = useCallback((idx: number) => {
    if (!dragged.current) setSelectedIdx(idx)
  }, [])

  return (
    <div className="flex h-full flex-col">
      {/* ── Top: Hero detail banner ── */}
      <div className="relative flex-1 min-h-0">
        <Image
          key={selected.id}
          src={selected.detailImage}
          alt={selected.headline}
          fill
          className="object-cover animate-in fade-in duration-300"
          sizes="480px"
          priority
        />
        {/* Text overlay at bottom of image */}
        <div
          className={`absolute inset-x-0 bottom-0 flex flex-col gap-1.5 bg-gradient-to-t ${selected.overlayGradient} px-4 pb-4 pt-16`}
        >
          <span
            className="w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white"
            style={{ backgroundColor: selected.accentColor }}
          >
            {selected.badge}
          </span>
          <h2 className="whitespace-pre-line text-[18px] font-extrabold leading-tight text-white drop-shadow-md">
            {selected.headline}
          </h2>
          <div className="flex flex-col gap-0.5">
            {selected.description.map((line, i) => (
              <p key={i} className="text-[11px] leading-snug text-white/85">
                {line}
              </p>
            ))}
          </div>
          {selected.period && (
            <span className="mt-0.5 text-[10px] font-medium text-white/60">
              {selected.period}
            </span>
          )}
        </div>
      </div>

      {/* ── Bottom: Thumbnail strip ── */}
      <div className="shrink-0 border-t border-border bg-card">
        <div
          ref={stripRef}
          className="flex gap-2.5 overflow-x-auto px-3 py-2.5 scrollbar-hide select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
        >
          {eventPromotions.map((promo, idx) => (
            <button
              key={promo.id}
              onClick={() => handleThumbClick(idx)}
              className="group relative shrink-0 overflow-hidden rounded-lg transition-all duration-200"
              style={{
                width: 80,
                height: 100,
                outline:
                  idx === selectedIdx
                    ? `2.5px solid ${promo.accentColor}`
                    : "2.5px solid transparent",
                outlineOffset: 1,
              }}
            >
              <Image
                src={promo.detailImage}
                alt={promo.badge}
                fill
                className="object-cover"
                sizes="80px"
              />
              {/* Dark overlay with badge text */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 pb-1.5 pt-5">
                <p className="truncate text-[9px] font-bold leading-tight text-white">
                  {promo.badge}
                </p>
              </div>
              {/* Active indicator dot */}
              {idx === selectedIdx && (
                <div
                  className="absolute right-1 top-1 h-2 w-2 rounded-full"
                  style={{ backgroundColor: promo.accentColor }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
