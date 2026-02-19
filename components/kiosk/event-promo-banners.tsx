"use client"

import Image from "next/image"

export type PromoBanner = {
  id: string
  title: string
  line1: string
  line2: string
  period?: string
  image: string
  /** Accent colour for the title badge */
  accentColor: string
}

export const eventPromotions: PromoBanner[] = [
  {
    id: "hyundai-mpoint",
    title: "현대 M포인트",
    line1: "구매금액의 50%",
    line2: "현대 M포인트 사용 가능",
    period: "02.01 - 02.28",
    image: "/promos/hyundai-mpoint.jpg",
    accentColor: "hsl(350, 70%, 55%)",
  },
  {
    id: "hyundai-hpoint",
    title: "현대 H.Point",
    line1: "구매금액의 50%",
    line2: "현대 H.Point 사용 가능",
    period: "02.01 - 02.28",
    image: "/promos/hyundai-hpoint.jpg",
    accentColor: "hsl(25, 80%, 55%)",
  },
  {
    id: "samsung-link",
    title: "삼성카드 LINK",
    line1: "삼성카드 LINK 연결 후",
    line2: "18,500원 이상 결제시 2천원 OFF",
    period: "02.01 - 02.28",
    image: "/promos/samsung-link.jpg",
    accentColor: "hsl(215, 80%, 55%)",
  },
  {
    id: "flavor-of-month",
    title: "이달의 맛 진정한 쫀꾸렛",
    line1: "바삭 쫀득 초콜릿 아이스크림에",
    line2: "초콜릿 쿠키와 브라우니 가득~",
    period: "02.01 - 02.28",
    image: "/promos/flavor-of-month.jpg",
    accentColor: "hsl(25, 60%, 45%)",
  },
  {
    id: "dubai-mochi",
    title: "신제품 출시",
    line1: "쫀득 바삭 두바이st 모찌,",
    line2: "원물 가득 두바이st 파르페",
    image: "/promos/dubai-mochi.jpg",
    accentColor: "hsl(170, 60%, 40%)",
  },
  {
    id: "happypoint-seol",
    title: "해피포인트 앱 스페셜 혜택",
    line1: "설 선물 아이스 찹쌀 한과",
    line2: "세트 4천원 / 단품 1천원 OFF",
    period: "02.09 - 02.18",
    image: "/promos/happypoint-seol.jpg",
    accentColor: "hsl(0, 70%, 50%)",
  },
  {
    id: "double-shake",
    title: "직영 스페셜 음료",
    line1: "더블쉐이크 31% OFF",
    line2: "14~18시 타임 이벤트",
    period: "02.01 - 02.28",
    image: "/promos/double-shake.jpg",
    accentColor: "hsl(280, 60%, 55%)",
  },
  {
    id: "double-cup",
    title: "이달의 더블 컵",
    line1: "이달의 맛 포함 싱글레귤러",
    line2: "500원 추가하면 더블주니어!",
    period: "02.01 - 02.28",
    image: "/promos/double-cup.jpg",
    accentColor: "hsl(340, 70%, 55%)",
  },
]

export function EventPromoBanners() {
  return (
    <div className="flex flex-col gap-3 p-3">
      {eventPromotions.map((promo) => (
        <button
          key={promo.id}
          className="relative flex w-full overflow-hidden rounded-xl bg-card shadow-sm active:scale-[0.98] transition-transform"
        >
          {/* Background image */}
          <div className="relative h-24 w-28 shrink-0">
            <Image
              src={promo.image}
              alt={promo.title}
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>

          {/* Text content */}
          <div className="flex flex-1 flex-col items-start justify-center gap-0.5 px-3 py-2">
            <span
              className="rounded-full px-2 py-0.5 text-[9px] font-bold text-white"
              style={{ backgroundColor: promo.accentColor }}
            >
              {promo.title}
            </span>
            <p className="text-left text-[11px] font-semibold leading-snug text-foreground">
              {promo.line1}
            </p>
            <p className="text-left text-[10px] leading-snug text-muted-foreground">
              {promo.line2}
            </p>
            {promo.period && (
              <span className="mt-0.5 text-[8px] text-muted-foreground/70">
                {promo.period}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
