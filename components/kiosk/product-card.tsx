"use client"

import Image from "next/image"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatPrice, type Product } from "@/lib/mock-data"

type CardSize = "xs" | "sm" | "md" | "lg" | "xl"

type ProductCardProps = {
  product: Product
  isSelected?: boolean
  quantity?: number
  onSelect: (product: Product) => void
  onRemove?: (product: Product) => void
  priority?: boolean
  size?: CardSize
  rank?: number | null
}

const RANK_BADGE_SIZE: Record<CardSize, string> = {
  xs: "h-3 w-3 text-[6px]",
  sm: "h-3.5 w-3.5 text-[7px]",
  md: "h-4 w-4 text-[8px]",
  lg: "h-5 w-5 text-[9px]",
  xl: "h-6 w-6 text-xs",
}

const SIZE_CONFIG: Record<CardSize, {
  container: string
  image: string
  imgPx: number
  name: string
  detail: string
  price: string
  tag: string
  padding: string
  hideDetail?: boolean
}> = {
  xs: {
    container: "h-16",
    image: "h-[52px] w-[52px]",
    imgPx: 56,
    name: "text-[9px]",
    detail: "text-[8px]",
    price: "text-[9px]",
    tag: "text-[6px]",
    padding: "p-1 pb-1.5",
    hideDetail: true,
  },
  sm: {
    container: "h-20",
    image: "h-[72px] w-[72px]",
    imgPx: 80,
    name: "text-[10px]",
    detail: "text-[10px]",
    price: "text-[10px]",
    tag: "text-[7px]",
    padding: "p-2 pb-2.5",
  },
  md: {
    container: "h-28",
    image: "h-[100px] w-[100px]",
    imgPx: 110,
    name: "text-xs",
    detail: "text-[11px]",
    price: "text-xs",
    tag: "text-[8px]",
    padding: "p-2.5 pb-3",
  },
  lg: {
    container: "h-36",
    image: "h-[128px] w-[128px]",
    imgPx: 140,
    name: "text-sm",
    detail: "text-xs",
    price: "text-sm",
    tag: "text-[9px]",
    padding: "p-3 pb-3.5",
  },
  xl: {
    container: "h-56",
    image: "h-[200px] w-[200px]",
    imgPx: 220,
    name: "text-lg",
    detail: "text-sm",
    price: "text-lg",
    tag: "text-xs",
    padding: "p-5 pb-6",
  },
}

const TAG_STYLES: Record<string, string> = {
  "Chef Made": "bg-amber-600 text-white",
  "먹고가기 전용": "bg-sky-500 text-white",
  "먹고가기": "bg-sky-500 text-white",
  "20% 할인": "bg-red-500 text-white",
  "이달의 더블주니어": "bg-primary text-primary-foreground",
  "NEW": "bg-rose-500 text-white",
  "세트포장": "bg-violet-500 text-white",
  "가져가기 전용": "bg-emerald-600 text-white",
}

export function ProductCard({ product, isSelected, quantity, onSelect, onRemove, priority, size = "sm", rank }: ProductCardProps) {
  const s = SIZE_CONFIG[size]
  const inCart = (quantity ?? 0) > 0
  return (
    <button
      onClick={() => onSelect(product)}
      className={cn(
        "relative flex flex-col items-center rounded-xl border-2 bg-card transition-all active:scale-[0.97]",
        s.padding,
        inCart ? "border-primary shadow-md" : "border-transparent shadow-sm"
      )}
    >
      {/* Quantity badge -- top-left */}
      {inCart && (
        <span className="absolute -left-1 -top-1 z-[1] flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow">
          {quantity}
        </span>
      )}

      {/* Remove button -- top-right */}
      {inCart && onRemove && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => { e.stopPropagation(); onRemove(product) }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onRemove(product) } }}
          className="absolute -right-1 -top-1 z-[1] flex h-5 w-5 items-center justify-center rounded-full bg-foreground/80 text-background shadow transition-colors hover:bg-destructive"
          aria-label="장바구니에서 제거"
        >
          <X className="h-3 w-3" strokeWidth={3} />
        </span>
      )}

      <div className={cn("relative mb-2 flex w-full items-center justify-center rounded-lg bg-muted/30", s.container)}>
        <Image
          src={product.image}
          alt={product.name}
          width={s.imgPx}
          height={s.imgPx}
          className={cn("object-contain", s.image)}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />
        {product.tag && (
          <span
            className={cn(
              "absolute left-0 top-0 rounded-br-lg rounded-tl-lg px-1 py-px font-bold leading-tight",
              s.tag,
              TAG_STYLES[product.tag] ?? "bg-muted text-foreground"
            )}
          >
            {product.tag}
          </span>
        )}
        {rank != null && rank >= 1 && !inCart && (
          <span
            className={cn(
              "absolute right-0 top-0 flex items-center justify-center rounded-bl-lg rounded-tr-lg font-bold leading-none",
              RANK_BADGE_SIZE[size],
              rank === 1 && "bg-amber-500 text-white",
              rank === 2 && "bg-slate-400 text-white",
              rank === 3 && "bg-amber-700 text-white",
              rank >= 4 && "bg-muted-foreground/20 text-foreground"
            )}
          >
            {rank}
          </span>
        )}
      </div>
      <p className={cn("whitespace-pre-wrap text-center font-semibold leading-snug text-foreground", s.hideDetail ? "line-clamp-1" : "line-clamp-2", s.name)}>
        {product.name}
      </p>
      {!s.hideDetail && (
        <p className={cn("mt-0.5 text-center leading-tight text-muted-foreground", s.detail)}>
          {product.weight && product.weight !== "-" && !product.size.includes(product.weight)
            ? `${product.size} (${product.weight})`
            : product.size}
        </p>
      )}
      <p className={cn("mt-1 font-bold text-primary", s.price)}>
        {product.price === 0 ? "0원" : formatPrice(product.price)}
      </p>
    </button>
  )
}
