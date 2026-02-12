// ─── Types ────────────────────────────────────────────────
export type Category = { id: string; name: string }

export type Product = {
  id: string
  categoryId: string
  name: string
  description: string
  size: string
  weight: string
  price: number
  calories: string
  totalServing: string
  colorAccent: string
  requiresFlavor: boolean
  maxFlavors: number
}

export type Flavor = { id: string; name: string; color: string }

export type OptionGroup = {
  id: string
  name: string
  type: "single" | "multi"
  options: OptionItem[]
}

export type OptionItem = {
  id: string
  name: string
  priceAdd: number
  hasQuantity: boolean
  defaultQty?: number
  unit?: string
}

export type PaymentMethod = {
  id: string
  name: string
  description?: string
  icons: string[]
}

export type DiscountSection = {
  id: string
  title: string
  items: DiscountItem[]
}

export type DiscountItem = {
  id: string
  name: string
  discount?: number
  icon?: string
}

// ─── Categories ───────────────────────────────────────────
export const categories: Category[] = [
  { id: "event", name: "이벤트" },
  { id: "workshop", name: "워크샵 스페셜" },
  { id: "cone-cup", name: "콘/컵" },
  { id: "packable-icecream", name: "포장가능\n아이스크림" },
  { id: "icecream-cake", name: "아이스크림\n케이크" },
  { id: "bingsu", name: "빙수" },
  { id: "coffee", name: "커피" },
  { id: "beverage", name: "음료\n블라스트" },
  { id: "gelato", name: "젤라또\n쉐프디저트" },
  { id: "dessert", name: "디저트" },
  { id: "prepack", name: "프리팩" },
  { id: "party", name: "상품\n파티용품" },
]

// ─── Products ─────────────────────────────────────────────
const icecreamColors = [
  "hsl(340, 65%, 85%)",
  "hsl(210, 60%, 80%)",
  "hsl(150, 45%, 80%)",
  "hsl(30, 70%, 85%)",
  "hsl(280, 40%, 85%)",
  "hsl(0, 60%, 85%)",
  "hsl(190, 55%, 82%)",
  "hsl(50, 65%, 85%)",
]

export const products: Product[] = [
  // 포장가능 아이스크림
  {
    id: "pint-3",
    categoryId: "packable-icecream",
    name: "파인트",
    description: "3가지 맛",
    size: "3가지 맛 (320g)",
    weight: "320g",
    price: 9800,
    calories: "200~350 kcal",
    totalServing: "320g",
    colorAccent: icecreamColors[0],
    requiresFlavor: true,
    maxFlavors: 3,
  },
  {
    id: "quart-4",
    categoryId: "packable-icecream",
    name: "쿼터",
    description: "4가지 맛",
    size: "4가지 맛 (620g)",
    weight: "620g",
    price: 18500,
    calories: "324~704 kcal",
    totalServing: "620g",
    colorAccent: icecreamColors[1],
    requiresFlavor: true,
    maxFlavors: 4,
  },
  {
    id: "family-5",
    categoryId: "packable-icecream",
    name: "패밀리",
    description: "5가지 맛",
    size: "5가지 맛 (960g)",
    weight: "960g",
    price: 26000,
    calories: "324~704 kcal",
    totalServing: "960g",
    colorAccent: icecreamColors[2],
    requiresFlavor: true,
    maxFlavors: 5,
  },
  {
    id: "half-gallon",
    categoryId: "packable-icecream",
    name: "하프갤론",
    description: "6가지 맛",
    size: "6가지 맛 (1200g)",
    weight: "1200g",
    price: 31500,
    calories: "450~900 kcal",
    totalServing: "1200g",
    colorAccent: icecreamColors[3],
    requiresFlavor: true,
    maxFlavors: 6,
  },
  {
    id: "dad-pack",
    categoryId: "packable-icecream",
    name: "아빠왔다팩",
    description: "싱글레귤러 4개",
    size: "싱글레귤러 4개",
    weight: "4개",
    price: 15600,
    calories: "150~280 kcal",
    totalServing: "4개",
    colorAccent: icecreamColors[4],
    requiresFlavor: true,
    maxFlavors: 4,
  },
  {
    id: "variety-pack",
    categoryId: "packable-icecream",
    name: "버라이어티팩",
    description: "싱글레귤러 6개",
    size: "싱글레귤러 6개",
    weight: "6개",
    price: 23400,
    calories: "150~280 kcal",
    totalServing: "6개",
    colorAccent: icecreamColors[5],
    requiresFlavor: true,
    maxFlavors: 6,
  },
  {
    id: "joy-pack",
    categoryId: "packable-icecream",
    name: "옹기종기팩",
    description: "싱글레귤러 8개",
    size: "싱글레귤러 8개",
    weight: "8개",
    price: 31200,
    calories: "150~280 kcal",
    totalServing: "8개",
    colorAccent: icecreamColors[6],
    requiresFlavor: true,
    maxFlavors: 8,
  },
  {
    id: "quart-4b",
    categoryId: "packable-icecream",
    name: "쿼터",
    description: "4가지 맛",
    size: "4가지 맛 (620g)",
    weight: "620g",
    price: 18500,
    calories: "324~704 kcal",
    totalServing: "620g",
    colorAccent: icecreamColors[7],
    requiresFlavor: true,
    maxFlavors: 4,
  },
  {
    id: "quart-4c",
    categoryId: "packable-icecream",
    name: "쿼터",
    description: "4가지 맛",
    size: "4가지 맛 (620g)",
    weight: "620g",
    price: 18500,
    calories: "324~704 kcal",
    totalServing: "620g",
    colorAccent: icecreamColors[0],
    requiresFlavor: true,
    maxFlavors: 4,
  },
  {
    id: "quart-4d",
    categoryId: "packable-icecream",
    name: "쿼터",
    description: "4가지 맛",
    size: "4가지 맛 (620g)",
    weight: "620g",
    price: 18500,
    calories: "324~704 kcal",
    totalServing: "620g",
    colorAccent: icecreamColors[1],
    requiresFlavor: true,
    maxFlavors: 4,
  },
  {
    id: "quart-4e",
    categoryId: "packable-icecream",
    name: "쿼터",
    description: "4가지 맛",
    size: "4가지 맛 (620g)",
    weight: "620g",
    price: 18500,
    calories: "324~704 kcal",
    totalServing: "620g",
    colorAccent: icecreamColors[2],
    requiresFlavor: true,
    maxFlavors: 4,
  },
  {
    id: "quart-4f",
    categoryId: "packable-icecream",
    name: "쿼터",
    description: "4가지 맛",
    size: "4가지 맛 (620g)",
    weight: "620g",
    price: 18500,
    calories: "324~704 kcal",
    totalServing: "620g",
    colorAccent: icecreamColors[3],
    requiresFlavor: true,
    maxFlavors: 4,
  },
  // 커피
  {
    id: "americano",
    categoryId: "coffee",
    name: "아메리카노",
    description: "아이스/레귤러",
    size: "아이스/레귤러",
    weight: "350ml",
    price: 3500,
    calories: "5~10 kcal",
    totalServing: "350ml",
    colorAccent: "hsl(30, 30%, 75%)",
    requiresFlavor: false,
    maxFlavors: 0,
  },
  {
    id: "cafe-latte",
    categoryId: "coffee",
    name: "카페라떼",
    description: "아이스/레귤러",
    size: "아이스/레귤러",
    weight: "350ml",
    price: 4500,
    calories: "120~180 kcal",
    totalServing: "350ml",
    colorAccent: "hsl(30, 40%, 80%)",
    requiresFlavor: false,
    maxFlavors: 0,
  },
  // 음료 블라스트
  {
    id: "strawberry-blast",
    categoryId: "beverage",
    name: "딸기 연유 블라스트",
    description: "",
    size: "레귤러",
    weight: "400ml",
    price: 6500,
    calories: "280~350 kcal",
    totalServing: "400ml",
    colorAccent: "hsl(350, 65%, 82%)",
    requiresFlavor: false,
    maxFlavors: 0,
  },
  {
    id: "mango-blast",
    categoryId: "beverage",
    name: "망고 패션 블라스트",
    description: "",
    size: "레귤러",
    weight: "400ml",
    price: 6500,
    calories: "260~320 kcal",
    totalServing: "400ml",
    colorAccent: "hsl(40, 70%, 82%)",
    requiresFlavor: false,
    maxFlavors: 0,
  },
  // 콘/컵
  {
    id: "single-cone",
    categoryId: "cone-cup",
    name: "싱글 레귤러",
    description: "콘",
    size: "레귤러",
    weight: "120g",
    price: 3900,
    calories: "150~280 kcal",
    totalServing: "120g",
    colorAccent: "hsl(340, 55%, 82%)",
    requiresFlavor: true,
    maxFlavors: 1,
  },
  {
    id: "double-cone",
    categoryId: "cone-cup",
    name: "더블 레귤러",
    description: "콘",
    size: "레귤러",
    weight: "240g",
    price: 6800,
    calories: "300~520 kcal",
    totalServing: "240g",
    colorAccent: "hsl(200, 50%, 82%)",
    requiresFlavor: true,
    maxFlavors: 2,
  },
  // 이벤트
  {
    id: "event-1",
    categoryId: "event",
    name: "베리굿 스페셜",
    description: "딸기 아이스크림",
    size: "스페셜 에디션",
    weight: "500g",
    price: 15900,
    calories: "300~500 kcal",
    totalServing: "500g",
    colorAccent: "hsl(350, 70%, 85%)",
    requiresFlavor: true,
    maxFlavors: 3,
  },
  {
    id: "event-2",
    categoryId: "event",
    name: "윈터 스페셜",
    description: "초코 아이스크림",
    size: "스페셜 에디션",
    weight: "500g",
    price: 15900,
    calories: "350~550 kcal",
    totalServing: "500g",
    colorAccent: "hsl(20, 50%, 75%)",
    requiresFlavor: true,
    maxFlavors: 3,
  },
]

// ─── Flavors ──────────────────────────────────────────────
export const flavors: Flavor[] = [
  { id: "green-tea", name: "그린티", color: "hsl(140, 40%, 70%)" },
  { id: "wind", name: "바람과 함께 사라지다", color: "hsl(200, 60%, 80%)" },
  { id: "strawberry-love", name: "사랑에 빠진 딸기", color: "hsl(350, 65%, 80%)" },
  { id: "winter-night", name: "윈터 밤", color: "hsl(30, 40%, 65%)" },
  { id: "berry-night", name: "베리밤", color: "hsl(300, 40%, 70%)" },
  { id: "choco-brownie", name: "초코나무 숲", color: "hsl(20, 50%, 55%)" },
  { id: "mint-choco", name: "민트 초콜릿 칩", color: "hsl(160, 50%, 75%)" },
  { id: "rainbow-sherbet", name: "레인보우 샤베트", color: "hsl(40, 80%, 80%)" },
  { id: "cookies-cream", name: "쿠키 앤 크림", color: "hsl(0, 0%, 80%)" },
  { id: "vanilla", name: "바닐라", color: "hsl(50, 60%, 90%)" },
  { id: "mango-tango", name: "망고 탱고", color: "hsl(35, 80%, 75%)" },
  { id: "ny-cheesecake", name: "뉴욕 치즈케이크", color: "hsl(45, 50%, 82%)" },
  { id: "strawberry-cream", name: "베리베리 스트로베리", color: "hsl(340, 60%, 78%)" },
  { id: "almond-bonbon", name: "아몬드 봉봉", color: "hsl(25, 35%, 72%)" },
  { id: "shooting-star", name: "슈팅스타", color: "hsl(220, 60%, 80%)" },
]

// ─── Option Groups ────────────────────────────────────────
export const optionGroups: OptionGroup[] = [
  {
    id: "spoon",
    name: "스폰",
    type: "single",
    options: [
      { id: "no-spoon", name: "필요 없음", priceAdd: 0, hasQuantity: false },
      { id: "spoon-normal", name: "스폰", priceAdd: 0, hasQuantity: true, defaultQty: 1, unit: "개" },
      { id: "spoon-extra", name: "스폰추가", priceAdd: 50, hasQuantity: true, defaultQty: 1, unit: "개" },
    ],
  },
  {
    id: "cooling",
    name: "보냉",
    type: "single",
    options: [
      { id: "dry-ice", name: "드라이 아이스", priceAdd: 0, hasQuantity: true, defaultQty: 30, unit: "분" },
      { id: "no-cooling", name: "필요 없음", priceAdd: 0, hasQuantity: false },
    ],
  },
  {
    id: "topping1",
    name: "토핑1",
    type: "multi",
    options: [
      { id: "choco-ball", name: "초코볼", priceAdd: 500, hasQuantity: true, defaultQty: 0, unit: "개" },
      { id: "strawberry-top", name: "딸기", priceAdd: 0, hasQuantity: true, defaultQty: 0, unit: "개" },
      { id: "crunch-cookie", name: "크런치 쿠키", priceAdd: 0, hasQuantity: true, defaultQty: 0, unit: "개" },
    ],
  },
  {
    id: "topping2",
    name: "토핑2",
    type: "multi",
    options: [
      { id: "rainbow-sprinkle", name: "레인보우 스프링클", priceAdd: 0, hasQuantity: true, defaultQty: 0, unit: "개" },
      { id: "oreo-crumble", name: "오레오 크럼블", priceAdd: 300, hasQuantity: true, defaultQty: 0, unit: "개" },
      { id: "waffle-piece", name: "와플 조각", priceAdd: 0, hasQuantity: true, defaultQty: 0, unit: "개" },
    ],
  },
]

// ─── Payment Methods ──────────────────────────────────────
export const paymentMethods: PaymentMethod[] = [
  { id: "credit-samsung", name: "신용카드/삼성페이", icons: ["CreditCard"] },
  { id: "easy-pay", name: "간편결제", description: "카카오페이, 네이버페이", icons: ["Wallet"] },
  { id: "transport-apple", name: "교통카드/애플페이/SPC사원증", icons: ["Smartphone"] },
  { id: "card-point", name: "카드사 포인트", icons: ["Award"] },
  { id: "cash-voucher", name: "현금 지류상품권", icons: ["Banknote"] },
]

// ─── Discount Sections ────────────────────────────────────
export const discountSections: DiscountSection[] = [
  {
    id: "one-click",
    title: "원클릭 결제",
    items: [
      { id: "br-app-pay", name: "배라앱 매장 결제", icon: "Store" },
    ],
  },
  {
    id: "mobile-coupon",
    title: "모바일 교환권 / 쿠폰 / 기프티콘",
    items: [
      { id: "mobile-voucher", name: "모바일 교환권", discount: 3900, icon: "Ticket" },
      { id: "br-app-coupon", name: "배라앱 발급 쿠폰", icon: "Tag" },
    ],
  },
  {
    id: "carrier",
    title: "통신사 멤버십 할인",
    items: [
      { id: "t-membership", name: "T 멤버십", icon: "Signal" },
      { id: "kt-membership", name: "KT 멤버십", icon: "Wifi" },
    ],
  },
  {
    id: "points",
    title: "포인트 사용",
    items: [
      { id: "happy-point", name: "해피포인트", icon: "Circle" },
      { id: "h-point", name: "현대 H.Point", discount: 1240, icon: "Hexagon" },
      { id: "kia-members", name: "기아멤버스", icon: "Car" },
      { id: "blue-members", name: "블루멤버스", icon: "Shield" },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────
export function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR") + "원"
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId)
}
