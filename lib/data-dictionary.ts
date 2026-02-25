/**
 * =====================================================================
 * BR Kiosk - Structured Data Dictionary
 * =====================================================================
 *
 * This file documents every data entity used in the application.
 * Each section maps to a future RDBMS table. Field comments describe
 * column types, constraints, and relationships.
 *
 * ── ENTITY RELATIONSHIP OVERVIEW ──
 *
 *   categories (L1 menus)
 *     ├── subcategory_filters (L2 filters per category)
 *     └── products (items per category)
 *           └── product.subcategory → subcategory_filters.id  (FK)
 *
 *   flavor_categories
 *     └── flavors
 *           └── flavor.categoryId → flavor_categories.id  (FK)
 *
 *   option_groups
 *     └── option_items
 *           └── option_item.groupId → option_groups.id  (FK)
 *
 *   cart_items
 *     ├── cart_item.productId → products.id  (FK)
 *     ├── cart_item_flavors  (M:N join: cart_items ↔ flavors)
 *     └── cart_item_options   (join: cart_items ↔ option_items + qty)
 *
 *   payment_methods  (standalone)
 *   discount_sections → discount_items  (1:N)
 *
 * =====================================================================
 */

// ─────────────────────────────────────────────────────────────────────
// 1. CATEGORIES  (Level 1 Menu Tabs)
// ─────────────────────────────────────────────────────────────────────
// Table: categories
// Display order is defined by `sort_order` (1-based).
// The kiosk grid lays out 6 per row, so rows are:
//   Row 1: sort_order 1-6    Row 2: sort_order 7-12
// `\n` in `display_name` means line break on the kiosk button.
//
// PK: id (VARCHAR)
// ─────────────────────────────────────────────────────────────────────
export const CATEGORIES = [
  { id: "bingsu",             display_name: "빙수",                      sort_order: 1,  is_special: false,  note: "Shaved ice desserts: strawberry, melon, pat (red bean)" },
  { id: "workshop",          display_name: "스폐셜\n디저트",             sort_order: 2,  is_special: false, note: "Special desserts: mochi, macarons, affogato, dubai-style, gift sets" },
  { id: "cone-cup",          display_name: "콘/컵",                     sort_order: 3,  is_special: false, note: "In-store cone/cup scoops" },
  { id: "packable-icecream", display_name: "포장가능\n아이스크림",        sort_order: 4,  is_special: false, note: "Take-home packaged ice cream: pints, quarters, family, packs" },
  { id: "icecream-cake",     display_name: "아이스크림\n케이크",          sort_order: 5,  is_special: false, note: "Ice cream cakes: bowl, egg, hol, premium, character" },
  { id: "coffee",            display_name: "커피",                      sort_order: 6,  is_special: false, note: "Coffee drinks" },
  { id: "beverage",          display_name: "음료\n블라스트",              sort_order: 7,  is_special: false, note: "Non-coffee beverages: shakes, blasts, tea, K-drinks" },
  { id: "gelato",            display_name: "젤라또",                    sort_order: 8,  is_special: false, note: "Gelato items" },
  { id: "dessert",           display_name: "디저트",                    sort_order: 9,  is_special: false, note: "Desserts: baumkuchen, mochi, cookies, churros, hangwa" },
  { id: "prepack",           display_name: "프리팩",                    sort_order: 10, is_special: false, note: "Pre-packaged cups: readypack (large), blockpack (small), Lessly" },
  { id: "party",             display_name: "상품",                      sort_order: 11, is_special: false, note: "Merchandise: trays, stationery, tumblers, caps, brand goods" },
  { id: "ai-pick",           display_name: "AI 추천",                   sort_order: 12, is_special: true,  note: "AI recommendation – auto-fills cart with curated picks" },
] as const

// ─────────────────────────────────────────────────────────────────────
// 2. SUBCATEGORY FILTERS  (Level 2 filter pills per category)
// ─────────────────────────────────────────────────────────────────────
// Table: subcategory_filters
// PK: composite (category_id, filter_id)
// FK: category_id → categories.id
// Every category with filters always has an "all" entry (전체) at
// sort_order 0 which shows all products unfiltered.
// ─────────────────────────────────────────────────────────────────────
export const SUBCATEGORY_FILTERS: Record<string, Array<{ filter_id: string; display_name: string; sort_order: number }>> = {
  "packable-icecream": [
    { filter_id: "all",         display_name: "전체",      sort_order: 0 },
    { filter_id: "pint",        display_name: "파인트",     sort_order: 1 },
    { filter_id: "quarter",     display_name: "쿼터",      sort_order: 2 },
    { filter_id: "family",      display_name: "패밀리",     sort_order: 3 },
    { filter_id: "half-gallon", display_name: "하프갤론",   sort_order: 4 },
    { filter_id: "pack",        display_name: "팩",        sort_order: 5 },
    { filter_id: "set",         display_name: "세트",      sort_order: 6 },
  ],
  "icecream-cake": [
    { filter_id: "all",     display_name: "전체",              sort_order: 0 },
    { filter_id: "small",   display_name: "보울/에그/소형",      sort_order: 1 },
    { filter_id: "basic",   display_name: "기본 홀케이크",       sort_order: 2 },
    { filter_id: "premium", display_name: "프리미엄/캐릭터",     sort_order: 3 },
  ],
  beverage: [
    { filter_id: "all",            display_name: "전체",              sort_order: 0 },
    { filter_id: "signature",      display_name: "시그니처/쉐이크",    sort_order: 1 },
    { filter_id: "tea",            display_name: "Tea/Hot",          sort_order: 2 },
    { filter_id: "k-drink",        display_name: "K-Drink",          sort_order: 3 },
    { filter_id: "classic-shake",  display_name: "클래식 쉐이크",     sort_order: 4 },
  ],
  dessert: [
    { filter_id: "all",                display_name: "전체",                  sort_order: 0 },
    { filter_id: "baum-monaka-mochi",  display_name: "바움쿠헨/모나카/모찌",    sort_order: 1 },
    { filter_id: "cookie-bagel-sand",  display_name: "쿠키/베이글/샌드",       sort_order: 2 },
    { filter_id: "set-menu",           display_name: "세트 메뉴",             sort_order: 3 },
    { filter_id: "churros-cake",       display_name: "츄러스/케이크",          sort_order: 4 },
    { filter_id: "choco-hangwa",       display_name: "초콜릿바/한과/선물",     sort_order: 5 },
    { filter_id: "etc",                display_name: "기타",                  sort_order: 6 },
  ],
  prepack: [
    { filter_id: "all",              display_name: "전체",              sort_order: 0 },
    { filter_id: "readypack",        display_name: "레디팩",            sort_order: 1 },
    { filter_id: "blockpack",        display_name: "블록팩",            sort_order: 2 },
    { filter_id: "lessly-blockpack", display_name: "(Lessly) 블록팩",   sort_order: 3 },
  ],
  party: [
    { filter_id: "all",         display_name: "전체",              sort_order: 0 },
    { filter_id: "tray",        display_name: "트레이",             sort_order: 1 },
    { filter_id: "stationery",  display_name: "클립펜/카드/숫자초",  sort_order: 2 },
    { filter_id: "tumbler-acc", display_name: "텀블러/모자/우산",   sort_order: 3 },
    { filter_id: "brand",       display_name: "브랜드 굿즈",       sort_order: 4 },
    { filter_id: "scent",       display_name: "향 제품",           sort_order: 5 },
    { filter_id: "party-deco",  display_name: "파티/장식/기타",     sort_order: 6 },
  ],
}

// ─────────────────────────────────────────────────────────────────────
// 3. PRODUCTS
// ─────────────────────────────────────────────────────────────────────
// Table: products
// PK: id (VARCHAR, e.g. "packable-icecream-1")
// FK: category_id → categories.id
// FK: subcategory → subcategory_filters.filter_id (nullable)
//
// Columns:
//   id              VARCHAR PK    – "{category_id}-{seq}"
//   category_id     VARCHAR FK    – parent category
//   name            VARCHAR       – product display name (\n = line break)
//   description     VARCHAR       – short description
//   size            VARCHAR       – size label (e.g. "레귤러", "4가지 맛 (620g)")
//   weight          VARCHAR       – weight or volume
//   price           INT           – price in KRW
//   calories        VARCHAR       – calorie range string
//   total_serving   VARCHAR       – serving size
//   image           VARCHAR       – image path
//   requires_flavor BOOLEAN       – whether user must pick flavors
//   max_flavors     INT           – max number of flavors (0 if N/A)
//   tag             VARCHAR NULL  – product badge/tag
//   subcategory     VARCHAR NULL  – FK to subcategory_filters.filter_id
//
// Current product counts per category:
//   event: 30, workshop: 28, cone-cup: 6, packable-icecream: 30,
//   icecream-cake: 58, coffee: 8, beverage: 30, gelato: 6,
//   dessert: 31, prepack: 23, party: 51
// Total: ~301 products
//
// [Product data lives in lib/mock-data.ts – see `generateProducts()` calls]
// ─────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────
// 4. PRODUCT TAGS  (enum / lookup table)
// ─────────────────────────────────────────────────────────────────────
// Table: product_tags (or ENUM)
// Used as badge overlays on product cards.
// ─────────────────────────────────────────────────────────────────────
export const PRODUCT_TAGS = [
  "Chef Made",
  "먹고가기 전용",
  "20% 할인",
  "이달의 더블주니어",
  "NEW",
  "세트포장",
  "먹고가기",
  "가져가기 전용",
] as const

// ─────────────────────────────────────────────────────────────────────
// 5. FLAVOR CATEGORIES
// ─────────────────────────────────────────────────────────────────────
// Table: flavor_categories
// PK: id (VARCHAR)
// ─────────────────────────────────────────────────────────────────────
export const FLAVOR_CATEGORIES = [
  { id: "all",             display_name: "전체",            sort_order: 0, note: "Virtual – shows all flavors" },
  { id: "recommended",     display_name: "추천",            sort_order: 1, note: "Staff picks / monthly highlights" },
  { id: "fruit",           display_name: "과일",            sort_order: 2, note: "" },
  { id: "chocolate",       display_name: "초콜릿",          sort_order: 3, note: "" },
  { id: "milk-cheese",     display_name: "우유/치즈/과자",   sort_order: 4, note: "" },
  { id: "coffee-caramel",  display_name: "커피/카라멜/티",   sort_order: 5, note: "" },
  { id: "vanilla-mint",    display_name: "바닐라/민트",      sort_order: 6, note: "" },
  { id: "grain-nut",       display_name: "곡물/견과류",      sort_order: 7, note: "" },
] as const

// ─────────────────────────────────────────────────────────────────────
// 6. FLAVORS  (100 items)
// ─────────────────────────────────────────────────────────────────────
// Table: flavors
// PK: id (VARCHAR)
// FK: category_id → flavor_categories.id
//
// Columns:
//   id          VARCHAR PK
//   name        VARCHAR         – Korean display name
//   image       VARCHAR         – image path
//   color       VARCHAR         – CSS HSL color for UI chip/swatch
//   category_id VARCHAR FK
//   description VARCHAR         – flavor description
//   badge       VARCHAR NULL    – optional badge text
//
// Badge values: "이달의 맛", "1위"~"5위", "NEW", "과일 섬유질 포함"
//
// Total: 100 flavors across 7 categories (excl. "all" virtual)
//   recommended: 12, fruit: 13, chocolate: 12, milk-cheese: 9,
//   coffee-caramel: 11, vanilla-mint: 10, grain-nut: 12
//
// [Flavor data lives in lib/mock-data.ts – see `flavors` array]
// ─────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────
// 7. OPTION GROUPS & OPTION ITEMS
// ─────────────────────────────────────────────────────────────────────
// Table: option_groups
// PK: id (VARCHAR)
//   id    VARCHAR PK    – "spoon", "cooling", "topping1", "topping2"
//   name  VARCHAR       – display name
//   type  ENUM          – "single" (radio) | "multi" (checkbox)
//
// Table: option_items
// PK: id (VARCHAR)
// FK: group_id → option_groups.id
//   id            VARCHAR PK
//   group_id      VARCHAR FK
//   name          VARCHAR       – display name
//   price_add     INT           – additional price in KRW (0 = free)
//   has_quantity   BOOLEAN       – whether user can adjust qty
//   default_qty   INT NULL      – default quantity if has_quantity
//   unit          VARCHAR NULL  – display unit ("개", "분")
// ───────────────────────────────────────────────��─────────────────────
export const OPTION_GROUPS = [
  {
    id: "spoon",
    display_name: "스푼",
    type: "single" as const,
    items: [
      { id: "no-spoon",     display_name: "필요 없음",  price_add: 0,   has_quantity: false, default_qty: null, unit: null },
      { id: "spoon-normal", display_name: "스푼",       price_add: 0,   has_quantity: true,  default_qty: 1,    unit: "개" },
      { id: "spoon-extra",  display_name: "스푼추가",   price_add: 50,  has_quantity: true,  default_qty: 1,    unit: "개" },
    ],
  },
  {
    id: "cooling",
    display_name: "보냉",
    type: "single" as const,
    items: [
      { id: "dry-ice",    display_name: "드라이 아이스", price_add: 0, has_quantity: true,  default_qty: 30, unit: "분" },
      { id: "no-cooling", display_name: "필요 없음",    price_add: 0, has_quantity: false, default_qty: null, unit: null },
    ],
  },
  {
    id: "topping1",
    display_name: "토핑1",
    type: "multi" as const,
    items: [
      { id: "choco-ball",     display_name: "초코볼",        price_add: 500, has_quantity: true, default_qty: 0, unit: "개" },
      { id: "strawberry-top", display_name: "딸기",          price_add: 0,   has_quantity: true, default_qty: 0, unit: "개" },
      { id: "crunch-cookie",  display_name: "크런치 쿠키",   price_add: 0,   has_quantity: true, default_qty: 0, unit: "개" },
    ],
  },
  {
    id: "topping2",
    display_name: "토핑2",
    type: "multi" as const,
    items: [
      { id: "rainbow-sprinkle", display_name: "레인보우 스프링클", price_add: 0,   has_quantity: true, default_qty: 0, unit: "개" },
      { id: "oreo-crumble",     display_name: "오레오 크럼블",    price_add: 300, has_quantity: true, default_qty: 0, unit: "개" },
      { id: "waffle-piece",     display_name: "와플 조각",        price_add: 0,   has_quantity: true, default_qty: 0, unit: "개" },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────
// 8. CART ITEMS  (runtime only – future: orders table)
// ─────────────────────────────────────────────────────────────────────
// Table: order_items (when persisted to DB as part of an order)
// PK: cart_id (UUID, generated client-side)
// FK: product_id → products.id
//
// Columns:
//   cart_id     UUID PK
//   product_id  VARCHAR FK
//   quantity    INT
//
// Join table: order_item_flavors
//   cart_id     UUID FK → order_items.cart_id
//   flavor_id   VARCHAR FK → flavors.id
//   sort_order  INT          – order the flavors were picked
//
// Join table: order_item_options
//   cart_id     UUID FK → order_items.cart_id
//   group_id    VARCHAR FK → option_groups.id
//   option_id   VARCHAR FK → option_items.id
//   quantity    INT
//
// [Cart state lives in lib/order-context.tsx – see CartItem type]
// ─────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────
// 9. PAYMENT METHODS
// ─────────────────────────────────────────────────────────────────────
// Table: payment_methods
// PK: id (VARCHAR)
// ─────────────────────────────────────────────────────────────────────
export const PAYMENT_METHODS = [
  { id: "credit-samsung",  display_name: "신용카드/삼성페이",              icon_keys: ["CreditCard"],  sort_order: 1 },
  { id: "easy-pay",        display_name: "간편결제",                      icon_keys: ["Wallet"],      sort_order: 2, description: "카카오페이, 네이버페이" },
  { id: "transport-apple", display_name: "교통카드/애플페이/SPC사원증",     icon_keys: ["Smartphone"],  sort_order: 3 },
  { id: "card-point",      display_name: "카드사 포인트",                  icon_keys: ["Award"],       sort_order: 4 },
  { id: "cash-voucher",    display_name: "현금 지류상품권",                icon_keys: ["Banknote"],    sort_order: 5 },
] as const

// ─────────────────────────────────────────────────────────────────────
// 10. DISCOUNT SECTIONS & DISCOUNT ITEMS
// ─────────────────────────────────────────────────────────────────────
// Table: discount_sections
// PK: id (VARCHAR)
//
// Table: discount_items
// PK: id (VARCHAR)
// FK: section_id → discount_sections.id
// ─────────────────────────────────────────────────────────────────────
export const DISCOUNT_SECTIONS = [
  {
    id: "one-click",
    display_name: "원클릭 결제",
    sort_order: 1,
    items: [
      { id: "br-app-pay", display_name: "배라앱 매장 결제", discount_amount: null, icon_key: "Store" },
    ],
  },
  {
    id: "mobile-coupon",
    display_name: "모바일 교환권 / 쿠폰 / 기프티콘",
    sort_order: 2,
    items: [
      { id: "mobile-voucher", display_name: "모바일 교환권", discount_amount: 3900, icon_key: "Ticket" },
      { id: "br-app-coupon",  display_name: "배라앱 발급 쿠폰", discount_amount: null, icon_key: "Tag" },
    ],
  },
  {
    id: "carrier",
    display_name: "통신사 멤버십 할인",
    sort_order: 3,
    items: [
      { id: "t-membership",  display_name: "T 멤버십",  discount_amount: null, icon_key: "Signal" },
      { id: "kt-membership", display_name: "KT 멤버십", discount_amount: null, icon_key: "Wifi" },
    ],
  },
  {
    id: "points",
    display_name: "포인트 사용",
    sort_order: 4,
    items: [
      { id: "happy-point",  display_name: "해피포인트",     discount_amount: null, icon_key: "Circle" },
      { id: "h-point",      display_name: "현대 H.Point",  discount_amount: 1240, icon_key: "Hexagon" },
      { id: "kia-members",  display_name: "기아멤버스",      discount_amount: null, icon_key: "Car" },
      { id: "blue-members", display_name: "블루멤버스",      discount_amount: null, icon_key: "Shield" },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────
// 11. ORDER TYPES  (enum)
// ─────────────────────────────────────────────────────────────────────
// Table column or ENUM: "takeout" | "dine-in"
// ─────────────────────────────────────────────────────────────────────
export const ORDER_TYPES = [
  { id: "takeout", display_name: "가져갈게요", icon_key: "ShoppingBag" },
  { id: "dine-in", display_name: "먹고갈게요", icon_key: "UtensilsCrossed" },
] as const

// ─────────────────────────────────────────────────────────────────────
// 12. FLAVOR BADGES  (enum / lookup)
// ─────────────────────────────────────────────────────────────────────
export const FLAVOR_BADGES = [
  "이달의 맛",
  "1위",
  "2위",
  "3위",
  "5위",
  "NEW",
  "과일 섬유질 포함",
] as const

// ─────────────────────────────────────────────────────────────────────
// 13. KIOSK LAYOUT CONFIG
// ─────────────────────────────────────────────────────────────────────
// Not a DB table, but a system config that controls presentation.
// ─────────────────────────────────────────────────────────────────────
export const KIOSK_CONFIG = {
  /** Number of category tabs per row */
  categories_per_row: 6,
  /** Number of product cards per page (grid) */
  items_per_page: 12,
  /** Grid columns for product cards */
  product_grid_cols: 3,
  /** Kiosk viewport width in px */
  kiosk_width: 480,
  /** Kiosk viewport height in px */
  kiosk_height: 860,
} as const
