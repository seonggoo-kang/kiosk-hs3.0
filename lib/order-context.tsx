"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { Product, Flavor, OptionItem } from "./mock-data"

// ─── Types ────────────────────────────────────────────────
export type OrderType = "takeout" | "dine-in" | null

export type CartItemOption = {
  groupId: string
  groupName: string
  option: OptionItem
  quantity: number
}

export type ResolvedRequiredOption = {
  groupId: string
  selectedOptionId: string
  selectedOptionName: string
  priceAdd: number
}

export type CartItem = {
  cartId: string
  product: Product
  selectedFlavors: Flavor[]
  options: CartItemOption[]
  requiredSelections: ResolvedRequiredOption[]
  quantity: number
}

export type DiscountApplied = {
  id: string
  name: string
  amount: number
}

type OrderState = {
  orderType: OrderType
  cart: CartItem[]
  discounts: DiscountApplied[]
  selectedProductId: string | null
}

type OrderAction =
  | { type: "SET_ORDER_TYPE"; payload: OrderType }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { cartId: string; quantity: number } }
  | { type: "SELECT_PRODUCT"; payload: string | null }
  | { type: "ADD_TO_CART_INSTANT"; payload: Product }
  | { type: "RESOLVE_OPTIONS"; payload: { cartId: string; flavors?: Flavor[]; requiredSelections?: ResolvedRequiredOption[] } }
  | { type: "APPLY_DISCOUNT"; payload: DiscountApplied }
  | { type: "REMOVE_DISCOUNT"; payload: string }
  | { type: "RESET_ORDER" }

// ─── Reducer ──────────────────────────────────────────────
function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case "SET_ORDER_TYPE":
      return { ...state, orderType: action.payload }
    case "ADD_TO_CART": {
      // Ensure requiredSelections exists for backward compatibility
      const cartItem = { ...action.payload, requiredSelections: action.payload.requiredSelections ?? [] }
      return { ...state, cart: [...state.cart, cartItem], selectedProductId: null }
    }
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((item) => item.cartId !== action.payload) }
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return { ...state, cart: state.cart.filter((item) => item.cartId !== action.payload.cartId) }
      }
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.cartId === action.payload.cartId ? { ...item, quantity: action.payload.quantity } : item
        ),
      }
    }
    case "SELECT_PRODUCT":
      return { ...state, selectedProductId: action.payload }
    case "ADD_TO_CART_INSTANT": {
      const product = action.payload
      const newItem: CartItem = {
        cartId: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        product,
        selectedFlavors: [],
        options: [],
        requiredSelections: [],
        quantity: 1,
      }
      return { ...state, cart: [...state.cart, newItem], selectedProductId: null }
    }
    case "RESOLVE_OPTIONS": {
      const { cartId, flavors, requiredSelections } = action.payload
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.cartId === cartId
            ? {
                ...item,
                ...(flavors !== undefined ? { selectedFlavors: flavors } : {}),
                ...(requiredSelections !== undefined ? { requiredSelections } : {}),
              }
            : item
        ),
      }
    }
    case "APPLY_DISCOUNT":
      return { ...state, discounts: [...state.discounts.filter((d) => d.id !== action.payload.id), action.payload] }
    case "REMOVE_DISCOUNT":
      return { ...state, discounts: state.discounts.filter((d) => d.id !== action.payload) }
    case "RESET_ORDER":
      return initialState
    default:
      return state
  }
}

const initialState: OrderState = {
  orderType: null,
  cart: [],
  discounts: [],
  selectedProductId: null,
}

// ─── Context ──────────────────────────────────────────────
type OrderContextValue = {
  state: OrderState
  dispatch: React.Dispatch<OrderAction>
  totalItems: number
  subtotal: number
  totalDiscount: number
  finalAmount: number
}

const OrderContext = createContext<OrderContextValue | null>(null)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, initialState)

  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0)

  const subtotal = state.cart.reduce((sum, item) => {
    const optionsCost = item.options.reduce(
      (oSum, o) => oSum + o.option.priceAdd * o.quantity,
      0
    )
    return sum + (item.product.price + optionsCost) * item.quantity
  }, 0)

  const totalDiscount = state.discounts.reduce((sum, d) => sum + d.amount, 0)

  const finalAmount = Math.max(0, subtotal - totalDiscount)

  return (
    <OrderContext.Provider value={{ state, dispatch, totalItems, subtotal, totalDiscount, finalAmount }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider")
  }
  return context
}

// Helper: check if a cart item still needs required options resolved
export function itemNeedsOptions(item: CartItem): boolean {
  const needsFlavor = item.product.requiresFlavor && item.selectedFlavors.length === 0
  const needsRequired = item.product.requiredOptions.length > item.requiredSelections.length
  return needsFlavor || needsRequired
}
