"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { IceCreamCone, Check, Plus, Minus } from "lucide-react"
import { ProgressStepper } from "@/components/kiosk/progress-stepper"
import { KioskFooter } from "@/components/kiosk/kiosk-footer"
import { CategoryTabs } from "@/components/kiosk/category-tabs"
import { ProductCard } from "@/components/kiosk/product-card"
import { MiniCart } from "@/components/kiosk/cart-strip"
import { ActionBar } from "@/components/kiosk/action-bar"
import { SubcategoryFilter } from "@/components/kiosk/subcategory-filter"
import { RecommendedPanel } from "@/components/kiosk/ai-pick-panel"
import { useOrder, itemNeedsOptions } from "@/lib/order-context"
import {
  categories,
  getProductsByCategory,
  getRankedRecommendations,
  cakeSubcategories,
  beverageSubcategories,
  dessertSubcategories,
  prepackSubcategories,
  partySubcategories,
  packableSubcategories,
  workshopSubcategories,
  type Product,
} from "@/lib/mock-data"

// Zoom levels: 1=1col, 2=2col, 3=3col, 4=4col(default auto), 5=5col
// null = auto mode (picks based on product count)
type ZoomLevel = 1 | 2 | 3 | 4 | 5 | null

const ZOOM_ITEMS: Record<number, number> = { 1: 1, 2: 4, 3: 9, 4: 16, 5: 20 }
const ZOOM_GRID: Record<number, string> = {
  1: "grid grid-cols-1 gap-4 px-6",
  2: "grid grid-cols-2 gap-4 px-2",
  3: "grid grid-cols-3 gap-3 px-1",
  4: "grid grid-cols-4 gap-2",
  5: "grid grid-cols-5 gap-1.5",
}
const ZOOM_SIZE: Record<number, "xs" | "sm" | "md" | "lg" | "xl"> = { 1: "xl", 2: "lg", 3: "md", 4: "sm", 5: "xs" }

function perPageForCount(count: number, zoom: ZoomLevel = null) {
  if (zoom) return ZOOM_ITEMS[zoom]
  if (count <= 1) return 1
  if (count <= 4) return 4
  if (count <= 9) return 9
  return 16
}

function gridClassForCount(count: number, zoom: ZoomLevel = null) {
  if (zoom) return ZOOM_GRID[zoom]
  if (count <= 1) return ZOOM_GRID[1]
  if (count <= 4) return ZOOM_GRID[2]
  if (count <= 9) return ZOOM_GRID[3]
  return ZOOM_GRID[4]
}

function cardSizeForCount(count: number, zoom: ZoomLevel = null): "xs" | "sm" | "md" | "lg" | "xl" {
  if (zoom) return ZOOM_SIZE[zoom]
  if (count <= 1) return "xl"
  if (count <= 4) return "lg"
  if (count <= 9) return "md"
  return "sm"
}

type Slide = {
  categoryId: string
  pageIndex: number
  totalPages: number
  products: Product[]
  totalCategoryProducts: number
  isAiPick?: boolean
}

function SlideContent({
  slide,
  cartProductIds,
  cartProductMap,
  onSelectProduct,
  onRemoveProduct,
  orderType,
  categoryName,
  crossSellProducts,
  onSwitchOrderType,
  autoReturnSeconds,
  onCancelAutoReturn,
  zoomLevel,
}: {
  slide: Slide
  cartProductIds: Set<string>
  cartProductMap: Map<string, { quantity: number; cartId: string }>
  onSelectProduct: (p: Product) => void
  onRemoveProduct: (p: Product) => void
  orderType?: "takeout" | "dine-in" | null
  categoryName?: string
  crossSellProducts?: Product[]
  onSwitchOrderType?: () => void
  autoReturnSeconds?: number | null
  onCancelAutoReturn?: () => void
  zoomLevel?: ZoomLevel
}) {
  if (slide.isAiPick) {
    return (
      <RecommendedPanel
        cartProductIds={cartProductIds}
        cartProductMap={cartProductMap}
        onSelectProduct={onSelectProduct}
        onRemoveProduct={onRemoveProduct}
        orderType={orderType}
        zoomLevel={zoomLevel}
      />
    )
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden">
      <div className="flex min-h-full flex-col p-3">
        {slide.products.length > 0 ? (
          <div className={gridClassForCount(slide.totalCategoryProducts, zoomLevel)}>
            {slide.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={cartProductIds.has(product.id)}
                quantity={cartProductMap.get(product.id)?.quantity}
                onSelect={onSelectProduct}
                onRemove={onRemoveProduct}
                priority={slide.pageIndex === 0}
                size={cardSizeForCount(slide.totalCategoryProducts, zoomLevel)}
              />
            ))}
          </div>
        ) : orderType && crossSellProducts && crossSellProducts.length > 0 ? (
          <div className="flex h-full flex-col">
            {/* Friendly explanation */}
            <div className="flex flex-col items-center gap-2 px-6 pt-4 pb-2 text-center">
              <p className="text-xs font-semibold text-foreground leading-relaxed">
                {`'${categoryName}' 메뉴는 '${orderType === "takeout" ? "매장(먹고가기)" : "포장(가져가기)"}' 전용이에요`}
              </p>
              {onSwitchOrderType && (
                <button
                  onClick={onSwitchOrderType}
                  className="rounded-full bg-primary px-4 py-1.5 text-[11px] font-bold text-primary-foreground shadow-sm transition-colors active:bg-primary/80"
                >
                  {orderType === "takeout" ? "먹고가기로 변경하기" : "가져가기로 변경하기"}
                </button>
              )}
            </div>

            {/* Cross-sell products */}
            <div className="flex flex-1 flex-col px-3 pb-2">
              <p className="mb-2 text-center text-[10px] font-medium text-muted-foreground">
                {`'${categoryName}' 좋아하시는 고객님들이 대신 많이 구매하시는 제품들`}
              </p>
              <div className="grid grid-cols-2 gap-3 px-1">
                {crossSellProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isSelected={cartProductIds.has(product.id)}
                    quantity={cartProductMap.get(product.id)?.quantity}
                    onSelect={(p) => { onCancelAutoReturn?.(); onSelectProduct(p) }}
                    onRemove={onRemoveProduct}
                    size="md"
                  />
                ))}
              </div>
            </div>

            {/* Auto-return countdown */}
            {autoReturnSeconds !== null && autoReturnSeconds !== undefined && autoReturnSeconds > 0 && (
              <div className="flex shrink-0 flex-col items-center gap-1.5 border-t border-border bg-muted/30 px-4 py-2.5">
                <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
                  {"마음에 드시는 대체 제품이 없으시면,"}
                  <br />
                  <span className="font-bold text-foreground">{autoReturnSeconds}{"초"}</span>
                  {" 후 이전 메뉴로 돌아갑니다"}
                </p>
                <div className="h-1 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear"
                    style={{ width: `${(autoReturnSeconds / 10) * 100}%` }}
                  />
                </div>
                <button
                  onClick={onCancelAutoReturn}
                  className="mt-0.5 rounded-full border border-border bg-card px-4 py-1 text-[10px] font-medium text-foreground shadow-sm transition-colors active:bg-muted"
                >
                  {"여기서 더 볼게요"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
            <IceCreamCone className="h-12 w-12 opacity-30" />
            <p className="text-center text-sm leading-relaxed px-6">
              {"이 카테고리에 상품이 없습니다."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

interface MenuScreenProps {
  onBack: () => void
  onGoToFlavors: (productId: string, cartId: string) => void
  onGoToOptions: (cartId: string) => void
  onGoToDiscounts: () => void
  showAddedToast?: boolean
  currentStep: 1 | 2 | 3 | 4 | 5
  elapsedSeconds: number
}

export function MenuScreen({ onBack, onGoToFlavors, onGoToOptions, onGoToDiscounts, showAddedToast: externalToast, currentStep, elapsedSeconds }: MenuScreenProps) {
  const { state, dispatch } = useOrder()

  const [cakeFilter, setCakeFilter] = useState("all")
  const [beverageFilter, setBeverageFilter] = useState("all")
  const [dessertFilter, setDessertFilter] = useState("all")
  const [prepackFilter, setPrepackFilter] = useState("all")
  const [partyFilter, setPartyFilter] = useState("all")
  const [packableFilter, setPackableFilter] = useState("all")
  const [workshopFilter, setWorkshopFilter] = useState("all")

  // ── Grid zoom (per-category) ──
  const [zoomMap, setZoomMap] = useState<Record<string, ZoomLevel>>({})
  const [showZoomHint, setShowZoomHint] = useState(false)
  const [zoomIndicator, setZoomIndicator] = useState<number | null>(null)
  const zoomIndicatorTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const show = setTimeout(() => setShowZoomHint(true), 2000)
    const hide = setTimeout(() => setShowZoomHint(false), 6000)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [])

  const dismissZoomHint = useCallback(() => setShowZoomHint(false), [])

  const showZoomBadge = useCallback((level: number) => {
    setZoomIndicator(level)
    if (zoomIndicatorTimeout.current) clearTimeout(zoomIndicatorTimeout.current)
    zoomIndicatorTimeout.current = setTimeout(() => setZoomIndicator(null), 800)
  }, [])

  const [showAddedToast, setShowAddedToast] = useState(false)

  useEffect(() => {
    if (externalToast) {
      setShowAddedToast(true)
      const timer = setTimeout(() => setShowAddedToast(false), 2500)
      return () => clearTimeout(timer)
    }
  }, [externalToast])

  const flatSlides = useMemo<Slide[]>(() => {
    const slides: Slide[] = []
    for (const cat of categories) {
      if (cat.id === "ai-pick") {
        slides.push({ categoryId: cat.id, pageIndex: 0, totalPages: 1, products: [], totalCategoryProducts: 0, isAiPick: true })
      } else {
        const products = getProductsByCategory(cat.id, state.orderType)
        const catZoom = zoomMap[cat.id] ?? null
        const perPage = perPageForCount(products.length, catZoom)
        const totalPages = Math.max(1, Math.ceil(products.length / perPage))
        for (let p = 0; p < totalPages; p++) {
          slides.push({ categoryId: cat.id, pageIndex: p, totalPages, products: products.slice(p * perPage, (p + 1) * perPage), totalCategoryProducts: products.length })
        }
      }
    }
    return slides
  }, [state.orderType, zoomMap])

  const initialFlatIndex = useMemo(() => {
    const idx = flatSlides.findIndex((s) => s.categoryId === "ai-pick")
    return idx >= 0 ? idx : 0
  }, [flatSlides])

  const [flatIndex, setFlatIndex] = useState(initialFlatIndex)

  // When flatSlides recomputes (e.g. order type change), the current
  // flatIndex may point to a wrong slide. Re-sync to the first page
  // of whatever category we were on.
  const prevSlidesRef = useRef(flatSlides)
  let correctedFlatIndex = flatIndex
  if (prevSlidesRef.current !== flatSlides) {
    const oldCat = prevSlidesRef.current[flatIndex]?.categoryId
    prevSlidesRef.current = flatSlides
    if (oldCat) {
      const idx = flatSlides.findIndex((s) => s.categoryId === oldCat && s.pageIndex === 0)
      if (idx >= 0) correctedFlatIndex = idx
    }
    // Clamp in case total slide count changed
    correctedFlatIndex = Math.min(correctedFlatIndex, flatSlides.length - 1)
    if (correctedFlatIndex !== flatIndex) {
      setFlatIndex(correctedFlatIndex)
    }
  }

  const currentSlide = flatSlides[correctedFlatIndex]
  const activeCategory = currentSlide.categoryId
  const zoomLevel = zoomMap[activeCategory] ?? null
  const totalPagesForCategory = currentSlide.totalPages

  const activeFilter = useMemo(() => {
    const filterMap: Record<string, string> = {
      "icecream-cake": cakeFilter, beverage: beverageFilter, dessert: dessertFilter,
      prepack: prepackFilter, party: partyFilter, "packable-icecream": packableFilter,
      workshop: workshopFilter,
    }
    return filterMap[activeCategory] ?? "all"
  }, [activeCategory, cakeFilter, beverageFilter, dessertFilter, prepackFilter, partyFilter, packableFilter, workshopFilter])

  const filteredSlides = useMemo(() => {
    if (activeFilter === "all" || currentSlide.isAiPick) return null
    const allCatProducts = getProductsByCategory(activeCategory, state.orderType)
    const filtered = allCatProducts.filter((p) => p.subcategory === activeFilter)
    const catZoom = zoomMap[activeCategory] ?? null
    const perPage = perPageForCount(filtered.length, catZoom)
    const pages = Math.max(1, Math.ceil(filtered.length / perPage))
    const slides: Slide[] = []
    for (let p = 0; p < pages; p++) {
      slides.push({ categoryId: activeCategory, pageIndex: p, totalPages: pages, products: filtered.slice(p * perPage, (p + 1) * perPage), totalCategoryProducts: filtered.length })
    }
    return slides
  }, [activeFilter, activeCategory, currentSlide.isAiPick, state.orderType, zoomMap])

  const [filteredPageIndex, setFilteredPageIndex] = useState(0)
  useEffect(() => { setFilteredPageIndex(0) }, [activeFilter])

  const displaySlide = useMemo<Slide>(() => {
    if (filteredSlides && filteredSlides.length > 0) {
      const idx = Math.min(filteredPageIndex, filteredSlides.length - 1)
      return filteredSlides[idx]
    }
    if (filteredSlides && filteredSlides.length === 0) {
      return { categoryId: activeCategory, pageIndex: 0, totalPages: 1, products: [], totalCategoryProducts: 0 }
    }
    return currentSlide
  }, [filteredSlides, filteredPageIndex, currentSlide, activeCategory])

  const selectedProduct = state.selectedProductId
    ? displaySlide.products.find((p) => p.id === state.selectedProductId) ||
      currentSlide.products.find((p) => p.id === state.selectedProductId) ||
      getRankedRecommendations(state.orderType).find((p) => p.id === state.selectedProductId) ||
      null
    : null

  const hasCart = state.cart.length > 0
  const cartProductMap = useMemo(() => {
    const m = new Map<string, { quantity: number; cartId: string }>()
    for (const item of state.cart) {
      const existing = m.get(item.product.id)
      if (existing) {
        existing.quantity += item.quantity
      } else {
        m.set(item.product.id, { quantity: item.quantity, cartId: item.cartId })
      }
    }
    return m
  }, [state.cart])

  // Keep a Set version for backwards-compat with components that just need has()
  const cartProductIds = useMemo(() => new Set(cartProductMap.keys()), [cartProductMap])

  // Categories with zero products under current order type
  const emptyCategoryIds = useMemo(() => {
    const s = new Set<string>()
    for (const cat of categories) {
      if (cat.id === "ai-pick") continue
      if (getProductsByCategory(cat.id, state.orderType).length === 0) s.add(cat.id)
    }
    return s
  }, [state.orderType])

  const prevCategoryRef = useRef<string>("ai-pick")

  const handleCategoryChange = useCallback(
    (id: string) => {
      prevCategoryRef.current = activeCategory
      const idx = flatSlides.findIndex((s) => s.categoryId === id && s.pageIndex === 0)
      if (idx >= 0) setFlatIndex(idx)
      setCakeFilter("all"); setBeverageFilter("all"); setDessertFilter("all")
      setPrepackFilter("all"); setPartyFilter("all"); setPackableFilter("all"); setWorkshopFilter("all")
      dispatch({ type: "SELECT_PRODUCT", payload: null })
    },
    [flatSlides, dispatch, activeCategory]
  )

  const jumpToFirstPageOfCategory = useCallback(() => {
    const idx = flatSlides.findIndex((s) => s.categoryId === activeCategory && s.pageIndex === 0)
    if (idx >= 0) setFlatIndex(idx)
  }, [flatSlides, activeCategory])

  // ── Drag / swipe ──
  const [dragOffset, setDragOffset] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const dragStartX = useRef(0)
  const dragStartY = useRef(0)
  const dragActive = useRef(false)
  const dragLocked = useRef<"horizontal" | "vertical" | null>(null)
  const dragOffsetRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const canGoLeft = flatIndex > 0
  const canGoRight = flatIndex < flatSlides.length - 1

  const isFiltered = filteredSlides !== null
  const prevSlide = useMemo(() => {
    if (isFiltered) return filteredPageIndex > 0 ? filteredSlides![filteredPageIndex - 1] : null
    return canGoLeft ? flatSlides[flatIndex - 1] : null
  }, [isFiltered, filteredSlides, filteredPageIndex, canGoLeft, flatSlides, flatIndex])

  const nextSlide = useMemo(() => {
    if (isFiltered) return filteredSlides && filteredPageIndex < filteredSlides.length - 1 ? filteredSlides[filteredPageIndex + 1] : null
    return canGoRight ? flatSlides[flatIndex + 1] : null
  }, [isFiltered, filteredSlides, filteredPageIndex, canGoRight, flatSlides, flatIndex])

  const wasDragging = useRef(false)

  useEffect(() => {
    const handleGlobalUp = () => {
      if (dragActive.current) {
        dragActive.current = false
        const dx = dragOffsetRef.current
        if (Math.abs(dx) > 0) { setIsAnimating(true); setDragOffset(0); setTimeout(() => setIsAnimating(false), 250) }
        dragOffsetRef.current = 0
      }
    }
    window.addEventListener("pointerup", handleGlobalUp)
    return () => window.removeEventListener("pointerup", handleGlobalUp)
  }, [])

  const onDragPointerDown = useCallback((e: React.PointerEvent) => {
    if (isAnimating) return
    wasDragging.current = false; dragStartX.current = e.clientX; dragStartY.current = e.clientY
    dragActive.current = true; dragLocked.current = null; dragOffsetRef.current = 0; setDragOffset(0)
  }, [isAnimating])

  const onDragPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragActive.current) return
    const dx = e.clientX - dragStartX.current
    const dy = e.clientY - dragStartY.current
    if (!dragLocked.current && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      dragLocked.current = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical"
      if (dragLocked.current === "horizontal") wasDragging.current = true
    }
    if (dragLocked.current !== "horizontal") return
    let offset = dx
    if ((!prevSlide && dx > 0) || (!nextSlide && dx < 0)) offset = dx * 0.2
    dragOffsetRef.current = offset; setDragOffset(offset)
  }, [prevSlide, nextSlide])

  const onDragPointerUp = useCallback(() => {
    if (!dragActive.current) return
    dragActive.current = false
    const dx = dragOffsetRef.current
    const containerWidth = containerRef.current?.offsetWidth || 400
    const threshold = containerWidth * 0.2
    dragLocked.current = null
    if (dx < -threshold && nextSlide) {
      setIsAnimating(true); setDragOffset(-containerWidth)
      setTimeout(() => {
        if (isFiltered) setFilteredPageIndex((prev) => prev + 1)
        else setFlatIndex((prev) => prev + 1)
        setDragOffset(0); setIsAnimating(false); dispatch({ type: "SELECT_PRODUCT", payload: null })
      }, 250)
    } else if (dx > threshold && prevSlide) {
      setIsAnimating(true); setDragOffset(containerWidth)
      setTimeout(() => {
        if (isFiltered) setFilteredPageIndex((prev) => prev - 1)
        else setFlatIndex((prev) => prev - 1)
        setDragOffset(0); setIsAnimating(false); dispatch({ type: "SELECT_PRODUCT", payload: null })
      }, 250)
    } else {
      setIsAnimating(true); setDragOffset(0); setTimeout(() => setIsAnimating(false), 250)
    }
    dragOffsetRef.current = 0
  }, [nextSlide, prevSlide, isFiltered, dispatch])

  const handleProductSelect = useCallback((product: Product) => {
    if (wasDragging.current) { wasDragging.current = false; return }
    dispatch({ type: "ADD_TO_CART_INSTANT", payload: product })
  }, [dispatch])

  const handleRemoveProduct = useCallback((product: Product) => {
    const entry = cartProductMap.get(product.id)
    if (entry) dispatch({ type: "REMOVE_FROM_CART", payload: entry.cartId })
  }, [cartProductMap, dispatch])

  // ── Pinch-to-zoom ──
  const pinchPointers = useRef<Map<number, { x: number; y: number }>>(new Map())
  const pinchStartDist = useRef<number | null>(null)
  const pinchFired = useRef(false)

  const onPinchPointerDown = useCallback((e: React.PointerEvent) => {
    pinchPointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pinchPointers.current.size === 2) {
      const pts = [...pinchPointers.current.values()]
      pinchStartDist.current = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y)
      pinchFired.current = false
      dragActive.current = false
      dragOffsetRef.current = 0
      setDragOffset(0)
    }
  }, [])

  const onPinchPointerMove = useCallback((e: React.PointerEvent) => {
    if (!pinchPointers.current.has(e.pointerId)) return
    pinchPointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pinchPointers.current.size === 2 && pinchStartDist.current !== null && !pinchFired.current) {
      const pts = [...pinchPointers.current.values()]
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y)
      const delta = dist - pinchStartDist.current
      if (Math.abs(delta) > 60) {
        pinchFired.current = true
        dismissZoomHint()
        setZoomMap((prev) => {
          const cat = activeCategory
          const cur = prev[cat] ?? 4
          const next = delta > 0 ? Math.max(1, cur - 1) : Math.min(5, cur + 1)
          showZoomBadge(next)
          return { ...prev, [cat]: next as 1 | 2 | 3 | 4 | 5 }
        })
      }
    }
  }, [dismissZoomHint, showZoomBadge])

  const onPinchPointerUp = useCallback((e: React.PointerEvent) => {
    pinchPointers.current.delete(e.pointerId)
    if (pinchPointers.current.size < 2) { pinchStartDist.current = null; pinchFired.current = false }
  }, [])

  const handleZoomIn = useCallback(() => {
    dismissZoomHint()
    setZoomMap((prev) => {
      const cur = prev[activeCategory] ?? 4
      const next = Math.max(1, cur - 1) as 1 | 2 | 3 | 4 | 5
      showZoomBadge(next)
      return { ...prev, [activeCategory]: next }
    })
  }, [dismissZoomHint, showZoomBadge, activeCategory])

  const handleZoomOut = useCallback(() => {
    dismissZoomHint()
    setZoomMap((prev) => {
      const cur = prev[activeCategory] ?? 4
      const next = Math.min(5, cur + 1) as 1 | 2 | 3 | 4 | 5
      showZoomBadge(next)
      return { ...prev, [activeCategory]: next }
    })
  }, [dismissZoomHint, showZoomBadge, activeCategory])

  const handleApplyZoomToAll = useCallback(() => {
    const current = zoomMap[activeCategory] ?? null
    if (!current) return
    setZoomMap(() => {
      const m: Record<string, ZoomLevel> = {}
      for (const cat of categories) m[cat.id] = current
      return m
    })
  }, [zoomMap, activeCategory])

  const handleResetZoom = useCallback(() => {
    setZoomMap((prev) => {
      const next = { ...prev }
      delete next[activeCategory]
      return next
    })
    showZoomBadge(4)
  }, [activeCategory, showZoomBadge])

  // Cross-sell products for empty state recovery
  const crossSellProducts = useMemo(() => {
    return getRankedRecommendations(state.orderType).slice(0, 4)
  }, [state.orderType])

  const activeCategoryName = useMemo(() => {
    return categories.find((c) => c.id === activeCategory)?.name ?? ""
  }, [activeCategory])

  // Order type switch from empty state
  const handleSwitchOrderType = useCallback(() => {
    const next = state.orderType === "takeout" ? "dine-in" : "takeout"
    dispatch({ type: "SET_ORDER_TYPE", payload: next as "takeout" | "dine-in" })
    setAutoReturnTimer(null)
  }, [state.orderType, dispatch])

  // Auto-return timer for empty categories
  const [autoReturnTimer, setAutoReturnTimer] = useState<number | null>(null)
  const autoReturnRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isCurrentCategoryEmpty = emptyCategoryIds.has(activeCategory)

  // Start timer when landing on an empty category
  useEffect(() => {
    if (isCurrentCategoryEmpty && state.orderType) {
      setAutoReturnTimer(10)
    } else {
      setAutoReturnTimer(null)
    }
  }, [isCurrentCategoryEmpty, state.orderType, activeCategory])

  // Countdown interval
  useEffect(() => {
    if (autoReturnRef.current) { clearInterval(autoReturnRef.current); autoReturnRef.current = null }
    if (autoReturnTimer === null || autoReturnTimer <= 0) {
      if (autoReturnTimer === 0) {
        // Timer reached zero -- navigate back
        const prev = prevCategoryRef.current
        if (prev && prev !== activeCategory) {
          handleCategoryChange(prev)
        }
        setAutoReturnTimer(null)
      }
      return
    }
    autoReturnRef.current = setInterval(() => {
      setAutoReturnTimer((prev) => (prev !== null && prev > 0 ? prev - 1 : null))
    }, 1000)
    return () => { if (autoReturnRef.current) clearInterval(autoReturnRef.current) }
  }, [autoReturnTimer, activeCategory, handleCategoryChange])

  const cancelAutoReturn = useCallback(() => setAutoReturnTimer(null), [])

  const isCake = activeCategory === "icecream-cake"
  const isBeverage = activeCategory === "beverage"
  const isDessert = activeCategory === "dessert"
  const isPrepack = activeCategory === "prepack"
  const isParty = activeCategory === "party"
  const isPackable = activeCategory === "packable-icecream"
  const isWorkshop = activeCategory === "workshop"

  // Filter out subcategories that have zero matching products.
  // Hide the entire filter bar when 0 or 1 distinct subcategory groups remain
  // (showing a single filter adds no value to the customer).
  const visibleSubcats = useMemo(() => {
    const filterMap: Record<string, Array<{ id: string; name: string }>> = {
      "icecream-cake": cakeSubcategories,
      beverage: beverageSubcategories,
      dessert: dessertSubcategories,
      prepack: prepackSubcategories,
      party: partySubcategories,
      "packable-icecream": packableSubcategories,
      workshop: workshopSubcategories,
    }
    const subcats = filterMap[activeCategory]
    if (!subcats) return null
    const products = getProductsByCategory(activeCategory, state.orderType)
    const withItems = subcats.filter((sc) => sc.id !== "all" && products.some((p) => p.subcategory === sc.id))
    // Need at least 2 distinct groups to make filters useful
    if (withItems.length <= 1) return null
    return [{ id: "all", name: "전체" }, ...withItems]
  }, [activeCategory, state.orderType])

  // Reset active filter to "all" when filter bar disappears
  const prevVisibleSubcats = useRef(visibleSubcats)
  if (prevVisibleSubcats.current !== visibleSubcats) {
    prevVisibleSubcats.current = visibleSubcats
    if (!visibleSubcats) {
      if (isCake && cakeFilter !== "all") setCakeFilter("all")
      if (isBeverage && beverageFilter !== "all") setBeverageFilter("all")
      if (isDessert && dessertFilter !== "all") setDessertFilter("all")
      if (isPrepack && prepackFilter !== "all") setPrepackFilter("all")
      if (isParty && partyFilter !== "all") setPartyFilter("all")
      if (isPackable && packableFilter !== "all") setPackableFilter("all")
      if (isWorkshop && workshopFilter !== "all") setWorkshopFilter("all")
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ProgressStepper currentStep={currentStep} elapsedSeconds={elapsedSeconds} onHome={onBack} />
      <CategoryTabs categories={categories} activeId={activeCategory} onSelect={handleCategoryChange} emptyCategoryIds={emptyCategoryIds} />

      {isCake && visibleSubcats && <SubcategoryFilter items={visibleSubcats} activeId={cakeFilter} onSelect={(id) => { setCakeFilter(id); jumpToFirstPageOfCategory() }} />}
      {isBeverage && visibleSubcats && <SubcategoryFilter items={visibleSubcats} activeId={beverageFilter} onSelect={(id) => { setBeverageFilter(id); jumpToFirstPageOfCategory() }} />}
      {isDessert && visibleSubcats && <SubcategoryFilter items={visibleSubcats} activeId={dessertFilter} onSelect={(id) => { setDessertFilter(id); jumpToFirstPageOfCategory() }} />}
      {isPrepack && visibleSubcats && <SubcategoryFilter items={visibleSubcats} activeId={prepackFilter} onSelect={(id) => { setPrepackFilter(id); jumpToFirstPageOfCategory() }} />}
      {isParty && visibleSubcats && <SubcategoryFilter items={visibleSubcats} activeId={partyFilter} onSelect={(id) => { setPartyFilter(id); jumpToFirstPageOfCategory() }} />}
      {isPackable && visibleSubcats && <SubcategoryFilter items={visibleSubcats} activeId={packableFilter} onSelect={(id) => { setPackableFilter(id); jumpToFirstPageOfCategory() }} />}
      {isWorkshop && visibleSubcats && <SubcategoryFilter items={visibleSubcats} activeId={workshopFilter} onSelect={(id) => { setWorkshopFilter(id); jumpToFirstPageOfCategory() }} />}

      {/* Carousel */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden bg-[#FFFFFF] select-none"
        style={{ touchAction: "none" }}
        onPointerDown={(e) => { onDragPointerDown(e); onPinchPointerDown(e) }}
        onPointerMove={(e) => { onDragPointerMove(e); onPinchPointerMove(e) }}
        onPointerUp={(e) => { onDragPointerUp(e); onPinchPointerUp(e) }}
        onPointerCancel={(e) => { onDragPointerUp(e); onPinchPointerUp(e) }}
      >
        <div className="relative h-full w-full">
          {prevSlide && (
            <div className="absolute inset-0" style={{ transform: `translateX(calc(-100% + ${dragOffset}px))`, transition: isAnimating ? "transform 250ms ease-out" : "none" }}>
              <SlideContent slide={prevSlide} cartProductIds={cartProductIds} cartProductMap={cartProductMap} onSelectProduct={() => {}} onRemoveProduct={handleRemoveProduct} orderType={state.orderType} zoomLevel={zoomLevel} />
            </div>
          )}
          <div
            key={`${displaySlide.categoryId}-${displaySlide.pageIndex}-${activeFilter}`}
            className="absolute inset-0"
            style={{ transform: dragOffset !== 0 ? `translateX(${dragOffset}px)` : undefined, transition: isAnimating ? "transform 250ms ease-out" : "none" }}
          >
            <SlideContent
              slide={displaySlide}
              cartProductIds={cartProductIds}
              cartProductMap={cartProductMap}
              onSelectProduct={handleProductSelect}
              onRemoveProduct={handleRemoveProduct}
              orderType={state.orderType}
              categoryName={activeCategoryName}
              crossSellProducts={crossSellProducts}
              onSwitchOrderType={handleSwitchOrderType}
              autoReturnSeconds={autoReturnTimer}
              onCancelAutoReturn={cancelAutoReturn}
              zoomLevel={zoomLevel}
            />
          </div>
          {nextSlide && (
            <div className="absolute inset-0" style={{ transform: `translateX(calc(100% + ${dragOffset}px))`, transition: isAnimating ? "transform 250ms ease-out" : "none" }}>
              <SlideContent slide={nextSlide} cartProductIds={cartProductIds} cartProductMap={cartProductMap} onSelectProduct={() => {}} onRemoveProduct={handleRemoveProduct} orderType={state.orderType} zoomLevel={zoomLevel} />
            </div>
          )}
        </div>

        {prevSlide && <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-4 bg-gradient-to-r from-foreground/5 to-transparent" aria-hidden="true" />}
        {nextSlide && <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-4 bg-gradient-to-l from-foreground/5 to-transparent" aria-hidden="true" />}

        {displaySlide.totalPages > 1 && (
          <div className="pointer-events-none absolute bottom-2 left-0 right-0 z-10 flex items-center justify-center gap-1.5" aria-hidden="true">
            {Array.from({ length: displaySlide.totalPages }).map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === displaySlide.pageIndex ? "w-4 bg-primary" : "w-1.5 bg-border"}`} />
            ))}
          </div>
        )}

        {/* Floating +/- zoom control */}
        <div className="absolute bottom-10 right-3 z-20 flex flex-col items-center rounded-full border border-border bg-card/80 shadow-lg backdrop-blur-sm">
            <button
              onClick={handleZoomIn}
              disabled={(zoomLevel ?? 4) <= 1}
              className={"flex h-9 w-9 items-center justify-center rounded-t-full transition-colors " + ((zoomLevel ?? 4) <= 1 ? "text-muted-foreground/30" : "text-foreground active:bg-muted")}
              aria-label="메뉴 크게 보기"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <div className="flex flex-col items-center gap-0.5 py-0.5">
              {[1, 2, 3, 4, 5].map((level) => (
                <span
                  key={level}
                  className={"h-1 rounded-full transition-all " + ((zoomLevel ?? 4) === level ? "w-2.5 bg-primary" : "w-1 bg-border")}
                />
              ))}
            </div>
            <button
              onClick={handleZoomOut}
              disabled={(zoomLevel ?? 4) >= 5}
              className={"flex h-9 w-9 items-center justify-center rounded-b-full transition-colors " + ((zoomLevel ?? 4) >= 5 ? "text-muted-foreground/30" : "text-foreground active:bg-muted")}
              aria-label="메뉴 작게 보기"
            >
              <Minus className="h-4 w-4" strokeWidth={2.5} />
            </button>
            {zoomLevel !== null && (
              <div className="flex flex-col items-center gap-0.5 border-t border-border pt-1 pb-1">
                <button
                  onClick={handleResetZoom}
                  className="px-1 text-[7px] font-medium text-muted-foreground leading-tight text-center active:text-foreground"
                >
                  {"초기화"}
                </button>
                <button
                  onClick={handleApplyZoomToAll}
                  className="px-1 text-[7px] font-medium text-primary leading-tight text-center active:text-primary/70"
                >
                  {"전체\n적용"}
                </button>
              </div>
            )}
        </div>

        {/* Zoom level indicator (brief flash on change) */}
        {zoomIndicator !== null && (
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
            <div className="animate-in fade-in zoom-in-95 duration-200 rounded-2xl bg-foreground/70 px-6 py-3 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(" + zoomIndicator + ", 6px)" }}>
                  {Array.from({ length: zoomIndicator * 2 }).map((_, i) => (
                    <span key={i} className="h-1.5 w-1.5 rounded-[1px] bg-primary-foreground/80" />
                  ))}
                </div>
                <span className="text-sm font-bold text-primary-foreground">
                  {zoomIndicator + " x " + Math.min(zoomIndicator, 4)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* First-time zoom hint */}
        {showZoomHint && (
          <div
            className="pointer-events-auto absolute inset-0 z-30 flex items-center justify-center bg-foreground/20 backdrop-blur-[1px] animate-in fade-in duration-500"
            onClick={dismissZoomHint}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") dismissZoomHint() }}
            aria-label="힌트 닫기"
          >
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-card/95 px-6 py-5 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M6 6l4 4M18 6l-4 4M6 18l4-4M18 18l-4-4" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
                <span className="text-xs font-medium text-foreground">
                  {"두 손가락으로 확대/축소"}
                </span>
              </div>
              <div className="h-px w-full bg-border" />
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5">
                  <Plus className="h-3 w-3 text-foreground" />
                  <span className="text-muted-foreground">/</span>
                  <Minus className="h-3 w-3 text-foreground" />
                </div>
                <span className="text-xs font-medium text-foreground">
                  {"버튼으로 메뉴 크기 조절"}
                </span>
              </div>
            </div>
          </div>
        )}

        {showAddedToast && (
          <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 rounded-full bg-foreground px-5 py-3 shadow-lg">
              <Check className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm font-semibold text-primary-foreground">상품이 담겼습니다</span>
            </div>
          </div>
        )}
      </div>

      <MiniCart />
      <ActionBar
        onBack={() => {
          dispatch({ type: "RESET_ORDER" })
          onBack()
        }}
        backLabel="처음으로"
        primaryLabel={(() => {
          if (!hasCart) return "주문하기"
          const hasPending = state.cart.some(itemNeedsOptions)
          return hasPending ? "옵션 일괄 선택하기" : "주문하기"
        })()}
        primaryDisabled={!hasCart}
        onPrimary={() => {
          const pendingItem = state.cart.find(itemNeedsOptions)
          if (pendingItem) {
            if (pendingItem.product.requiresFlavor && pendingItem.selectedFlavors.length === 0) {
              onGoToFlavors(pendingItem.product.id, pendingItem.cartId)
            } else {
              onGoToOptions(pendingItem.cartId)
            }
          } else {
            onGoToDiscounts()
          }
        }}
      />
    </div>
  )
}
