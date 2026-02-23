"use client"

import { Sparkles, RefreshCw } from "lucide-react"
import { ProductCard } from "@/components/kiosk/product-card"
import type { Product } from "@/lib/mock-data"

type RecommendedPanelProps = {
  products: Product[]
  selectedProductId: string | null
  onSelectProduct: (product: Product) => void
  onRefresh: () => void
  loading?: boolean
}

export function RecommendedPanel({
  products,
  selectedProductId,
  onSelectProduct,
  onRefresh,
  loading,
}: RecommendedPanelProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Compact header with refresh button */}
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-card px-3 py-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-[11px] font-bold text-foreground">
            {"\uCD94\uCC9C \uBA54\uB274"}
          </span>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          {"\uC624\uB298\uC758 \uC870\uD569 \uCD94\uCC9C"}
        </button>
      </div>

      {/* Product grid -- same 4-column layout as other categories */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="flex min-h-full flex-col p-3">
          {loading ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 pt-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-xs text-muted-foreground">
                {"\uCD94\uCC9C \uBA54\uB274\uB97C \uAD6C\uC131\uD558\uACE0 \uC788\uC5B4\uC694..."}
              </p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={selectedProductId === product.id}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
