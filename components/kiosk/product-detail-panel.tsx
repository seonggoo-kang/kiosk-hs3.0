"use client"

import Image from "next/image"
import { formatPrice, type Product } from "@/lib/mock-data"

type ProductDetailPanelProps = {
  product: Product
}

export function ProductDetailPanel({ product }: ProductDetailPanelProps) {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted/30">
          <Image
            src={product.image}
            alt={product.name}
            width={56}
            height={56}
            className="h-14 w-14 object-contain"
          />
        </div>
        <p className="mt-1.5 text-center text-xs font-bold text-foreground">{product.name}</p>
        <p className="text-center text-[10px] text-muted-foreground">{product.size}</p>
        <p className="mt-0.5 text-xs font-bold text-primary">{formatPrice(product.price)}</p>
      </div>
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex items-baseline gap-2 text-sm">
          <span className="font-semibold text-foreground">열량</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">{product.calories} / 총 제공량 기준</span>
        </div>
        <div className="mt-0.5 flex items-baseline gap-2 text-sm">
          <span className="font-semibold text-foreground">총제공량</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">{product.totalServing}</span>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          알레르기 유발 제품 및 선택옵션에 대한 정보는 매장 내 책자에 안내되어 있어요.
        </p>
      </div>
    </div>
  )
}
