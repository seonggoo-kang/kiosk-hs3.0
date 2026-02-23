"use client"

import { useState, useEffect, useCallback } from "react"
import { Sparkles, RotateCcw, ShoppingCart } from "lucide-react"
import { useOrder, type CartItem, type CartItemOption } from "@/lib/order-context"
import {
  getProductsByCategory,
  flavors,
  optionGroups,
  type Product,
  type Flavor,
} from "@/lib/mock-data"

// ── Helpers ──────────────────────────────────────────────

function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

type AiCartItem = {
  product: Product
  flavors: Flavor[]
  spoonQty: number
}

function generateAiPick(): AiCartItem[] {
  const items: AiCartItem[] = []

  // 1. Packable icecream -- 쿼터 (4 flavors)
  const packable = getProductsByCategory("packable-icecream")
  const quarter = packable.find((p) => p.name === "쿼터")
  if (quarter) {
    items.push({
      product: quarter,
      flavors: pickRandom(flavors, 4),
      spoonQty: 4,
    })
  }

  // 2. Cone/cup -- 싱글레귤러 (1 flavor)
  const coneCup = getProductsByCategory("cone-cup")
  const single = coneCup.find((p) => p.name.includes("싱글") && p.name.includes("레귤러"))
    ?? coneCup[0]
  if (single) {
    items.push({
      product: single,
      flavors: pickRandom(flavors, Math.min(1, single.maxFlavors)),
      spoonQty: 0,
    })
  }

  // 3. Beverage or dessert (no flavors)
  const beverages = getProductsByCategory("beverage")
  const desserts = getProductsByCategory("dessert")
  const beverageOrDessert = pickRandom([...beverages, ...desserts].filter((p) => !p.requiresFlavor), 1)
  if (beverageOrDessert[0]) {
    items.push({
      product: beverageOrDessert[0],
      flavors: [],
      spoonQty: 0,
    })
  }

  return items
}

function buildCartItem(item: AiCartItem): CartItem {
  const spoonGroup = optionGroups.find((g) => g.id === "spoon")
  const options: CartItemOption[] = []

  if (item.spoonQty > 0 && spoonGroup) {
    const spoonOpt = spoonGroup.options.find((o) => o.id === "spoon-normal")
    if (spoonOpt) {
      options.push({
        groupId: spoonGroup.id,
        groupName: spoonGroup.name,
        option: spoonOpt,
        quantity: item.spoonQty,
      })
    }
  }

  return {
    cartId: `ai-${item.product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    product: item.product,
    selectedFlavors: item.flavors,
    options,
    quantity: 1,
  }
}

// ── Component ────────────────────────────────────────────

export function AiPickPanel() {
  const { dispatch } = useOrder()
  const [items, setItems] = useState<AiCartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)

  const generate = useCallback(() => {
    setLoading(true)
    setAdded(false)
    // Fake AI delay
    setTimeout(() => {
      setItems(generateAiPick())
      setLoading(false)
    }, 1200)
  }, [])

  useEffect(() => {
    generate()
  }, [generate])

  const totalPrice = items.reduce((sum, it) => sum + it.product.price, 0)

  const handleAddAll = () => {
    for (const item of items) {
      dispatch({ type: "ADD_TO_CART", payload: buildCartItem(item) })
    }
    setAdded(true)
  }

  return (
    <div className="flex h-full flex-col bg-muted/40">
      {/* Header */}
      <div className="flex flex-col items-center gap-1 bg-card px-4 pb-3 pt-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-sm font-bold text-foreground">AI가 추천하는 오늘의 조합</h2>
        <p className="text-[10px] text-muted-foreground">
          취향을 분석해 딱 맞는 조합을 골라봤어요
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 pt-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-xs text-muted-foreground animate-pulse">
              AI가 추천 조합을 만들고 있어요...
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {items.map((item, idx) => (
              <div
                key={`${item.product.id}-${idx}`}
                className="rounded-xl border border-border bg-card p-3 shadow-sm"
              >
                {/* Product header */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-foreground">{item.product.name}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {item.product.size}
                    </p>
                  </div>
                  <p className="text-xs font-bold text-primary">
                    {item.product.price.toLocaleString()}원
                  </p>
                </div>

                {/* Flavors */}
                {item.flavors.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.flavors.map((f) => (
                      <span
                        key={f.id}
                        className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[9px] font-medium text-foreground"
                      >
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: f.color }}
                        />
                        {f.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Spoon info */}
                {item.spoonQty > 0 && (
                  <p className="mt-1.5 text-[9px] text-muted-foreground">
                    스푼 {item.spoonQty}개
                  </p>
                )}
              </div>
            ))}

            {/* Total */}
            <div className="flex items-center justify-between rounded-lg bg-card px-3 py-2 border border-border">
              <span className="text-[11px] font-medium text-muted-foreground">추천 총 금액</span>
              <span className="text-sm font-bold text-foreground">
                {totalPrice.toLocaleString()}원
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!loading && (
        <div className="flex gap-2 border-t border-border bg-card px-3 py-3">
          <button
            onClick={generate}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-card py-2.5 text-xs font-medium text-foreground transition-colors active:bg-muted"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            다시 추천
          </button>
          <button
            onClick={handleAddAll}
            disabled={added}
            className="flex flex-[2] items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-xs font-bold text-primary-foreground transition-colors active:bg-primary/90 disabled:opacity-60"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {added ? "담기 완료" : "전체 담기"}
          </button>
        </div>
      )}
    </div>
  )
}
