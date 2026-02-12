"use client"

import { IceCreamCone } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatPrice, type Product } from "@/lib/mock-data"

type ProductCardProps = {
  product: Product
  isSelected?: boolean
  onSelect: (product: Product) => void
}

export function ProductCard({ product, isSelected, onSelect }: ProductCardProps) {
  return (
    <button
      onClick={() => onSelect(product)}
      className={cn(
        "flex flex-col items-center rounded-xl border-2 bg-card p-2 pb-2.5 transition-all active:scale-[0.97]",
        isSelected ? "border-primary shadow-md" : "border-transparent shadow-sm"
      )}
    >
      <div
        className="mb-2 flex h-20 w-full items-center justify-center rounded-lg"
        style={{ backgroundColor: product.colorAccent }}
      >
        <IceCreamCone className="h-8 w-8 text-card/70" />
      </div>
      <p className="text-center text-xs font-semibold leading-tight text-foreground">
        {product.name}
      </p>
      <p className="mt-0.5 text-center text-[10px] leading-tight text-muted-foreground">
        {product.size}
      </p>
      <p className="mt-1 text-xs font-bold text-primary">
        {formatPrice(product.price)}
      </p>
    </button>
  )
}
