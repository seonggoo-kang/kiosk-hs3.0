"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { formatPrice, type Product } from "@/lib/mock-data"

type ProductCardProps = {
  product: Product
  isSelected?: boolean
  onSelect: (product: Product) => void
  priority?: boolean
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

export function ProductCard({ product, isSelected, onSelect, priority }: ProductCardProps) {
  return (
    <button
      onClick={() => onSelect(product)}
      className={cn(
        "flex flex-col items-center rounded-xl border-2 bg-card p-2 pb-2.5 transition-all active:scale-[0.97]",
        isSelected ? "border-primary shadow-md" : "border-transparent shadow-sm"
      )}
    >
      <div className="relative mb-2 flex h-20 w-full items-center justify-center rounded-lg bg-muted/30">
        <Image
          src={product.image}
          alt={product.name}
          width={80}
          height={80}
          className="h-[72px] w-[72px] object-contain"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />
        {product.tag && (
          <span
            className={cn(
              "absolute left-0 top-0 rounded-br-lg rounded-tl-lg px-1 py-px text-[7px] font-bold leading-tight",
              TAG_STYLES[product.tag] ?? "bg-muted text-foreground"
            )}
          >
            {product.tag}
          </span>
        )}
      </div>
      <p className="whitespace-pre-wrap text-center text-xs font-semibold leading-tight text-foreground">
        {product.name}
      </p>
      <p className="mt-0.5 text-center text-[10px] leading-tight text-muted-foreground">
        {product.weight && product.weight !== "-" && !product.size.includes(product.weight)
          ? `${product.size} (${product.weight})`
          : product.size}
      </p>
      <p className="mt-1 text-xs font-bold text-primary">
        {product.price === 0 ? "0원" : formatPrice(product.price)}
      </p>
    </button>
  )
}
