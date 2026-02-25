"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { formatPrice, type Product } from "@/lib/mock-data"

type CardSize = "sm" | "md" | "lg" | "xl"

type ProductCardProps = {
  product: Product
  isSelected?: boolean
  onSelect: (product: Product) => void
  priority?: boolean
  size?: CardSize
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
}> = {
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

export function ProductCard({ product, isSelected, onSelect, priority, size = "sm" }: ProductCardProps) {
  const s = SIZE_CONFIG[size]
  return (
    <button
      onClick={() => onSelect(product)}
      className={cn(
        "flex flex-col items-center rounded-xl border-2 bg-card transition-all active:scale-[0.97]",
        s.padding,
        isSelected ? "border-primary shadow-md" : "border-transparent shadow-sm"
      )}
    >
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
      </div>
      <p className={cn("line-clamp-2 whitespace-pre-wrap text-center font-semibold leading-snug text-foreground", s.name)}>
        {product.name}
      </p>
      <p className={cn("mt-0.5 text-center leading-tight text-muted-foreground", s.detail)}>
        {product.weight && product.weight !== "-" && !product.size.includes(product.weight)
          ? `${product.size} (${product.weight})`
          : product.size}
      </p>
      <p className={cn("mt-1 font-bold text-primary", s.price)}>
        {product.price === 0 ? "0원" : formatPrice(product.price)}
      </p>
    </button>
  )
}
