// ─── Types ────────────────────────────────────────────────
export type Category = { id: string; name: string }

export type ProductTag = "Chef Made" | "먹고가기 전용" | "20% 할인" | "이달의 더블주니어" | "NEW" | "세트포장" | "먹고가기"

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
  image: string
  requiresFlavor: boolean
  maxFlavors: number
  tag?: ProductTag | null
  subcategory?: string | null
}

export type FlavorCategory = {
  id: string
  name: string
}

export type Flavor = {
  id: string
  name: string
  image: string
  color: string
  categoryId: string
  description: string
  badge?: "이달의 맛" | "1위" | "2위" | "3위" | "5위" | "NEW" | "과일 섬유질 포함" | null
}

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

// ─── Helper to generate product arrays ────────────────────
function generateProducts(
  categoryId: string,
  items: Array<{
    name: string; desc: string; size: string; weight: string;
    price: number; cal: string; serving: string; image: string;
    flavor: boolean; maxF: number; tag?: ProductTag | null; sub?: string | null;
  }>
): Product[] {
  return items.map((item, i) => ({
    id: `${categoryId}-${i + 1}`,
    categoryId,
    name: item.name,
    description: item.desc,
    size: item.size,
    weight: item.weight,
    price: item.price,
    calories: item.cal,
    totalServing: item.serving,
    image: item.image,
    requiresFlavor: item.flavor,
    maxFlavors: item.maxF,
    tag: item.tag ?? null,
    subcategory: item.sub ?? null,
  }))
}

// ─── 이벤트 (30) ──────────────────────────────────────────
const eventProducts = generateProducts("event", [
  { name: "베리굿 스페셜", desc: "딸기 아이스크림", size: "스페셜 에디션", weight: "500g", price: 15900, cal: "300~500 kcal", serving: "500g", image: "/products/family.jpg", flavor: true, maxF: 3 },
  { name: "윈터 스페셜", desc: "초코 아이스크림", size: "스페셜 에디션", weight: "500g", price: 15900, cal: "350~550 kcal", serving: "500g", image: "/products/pint.jpg", flavor: true, maxF: 3 },
  { name: "봄맞이 세트", desc: "봄 한정 에디션", size: "레귤러", weight: "450g", price: 13500, cal: "280~450 kcal", serving: "450g", image: "/products/quarter.jpg", flavor: true, maxF: 3 },
  { name: "발렌타인 세트", desc: "초콜릿 스페셜", size: "스페셜", weight: "500g", price: 16900, cal: "320~520 kcal", serving: "500g", image: "/products/half-gallon.jpg", flavor: true, maxF: 4 },
  { name: "크리스마스 팩", desc: "시즌 한정", size: "패밀리", weight: "960g", price: 28000, cal: "400~700 kcal", serving: "960g", image: "/products/family.jpg", flavor: true, maxF: 5 },
  { name: "어린이날 세트", desc: "키즈 에디션", size: "레귤러", weight: "400g", price: 12500, cal: "250~400 kcal", serving: "400g", image: "/products/pack-4.jpg", flavor: true, maxF: 4 },
  { name: "핼러윈 팩", desc: "호박 에디션", size: "스페셜", weight: "500g", price: 15500, cal: "300~500 kcal", serving: "500g", image: "/products/pint.jpg", flavor: true, maxF: 3 },
  { name: "추석 세트", desc: "명절 에디션", size: "패밀리", weight: "960g", price: 27000, cal: "380~680 kcal", serving: "960g", image: "/products/half-gallon.jpg", flavor: true, maxF: 5 },
  { name: "설날 세트", desc: "명절 에디션", size: "패밀리", weight: "960g", price: 27500, cal: "380~680 kcal", serving: "960g", image: "/products/family.jpg", flavor: true, maxF: 5 },
  { name: "스프링 블라썸", desc: "벚꽃 에디션", size: "레귤러", weight: "320g", price: 11800, cal: "220~380 kcal", serving: "320g", image: "/products/pint.jpg", flavor: true, maxF: 3 },
  { name: "썸머 쿨링팩", desc: "여름 한정", size: "쿼터", weight: "620g", price: 19500, cal: "324~704 kcal", serving: "620g", image: "/products/quarter.jpg", flavor: true, maxF: 4 },
  { name: "오텀 스페셜", desc: "가을 한정", size: "레귤러", weight: "450g", price: 14200, cal: "280~460 kcal", serving: "450g", image: "/products/half-gallon.jpg", flavor: true, maxF: 3 },
  { name: "졸업 축하 세트", desc: "축하 에디션", size: "패밀리", weight: "960g", price: 26500, cal: "380~680 kcal", serving: "960g", image: "/products/family.jpg", flavor: true, maxF: 5 },
  { name: "생일 파티 팩", desc: "파티 에디션", size: "패밀리", weight: "960g", price: 29000, cal: "400~720 kcal", serving: "960g", image: "/products/pack-6.jpg", flavor: true, maxF: 6 },
  { name: "듀오 세트", desc: "2인 세트", size: "레귤러", weight: "400g", price: 12800, cal: "250~420 kcal", serving: "400g", image: "/products/quarter.jpg", flavor: true, maxF: 2 },
  { name: "트리플 세트", desc: "3인 세트", size: "레귤러", weight: "600g", price: 17800, cal: "350~580 kcal", serving: "600g", image: "/products/pack-4.jpg", flavor: true, maxF: 3 },
  { name: "패밀리 파티팩", desc: "가족 에디션", size: "패밀리", weight: "1200g", price: 32000, cal: "500~900 kcal", serving: "1200g", image: "/products/pack-8.jpg", flavor: true, maxF: 8 },
  { name: "러브 세트", desc: "커플 에디션", size: "레귤러", weight: "400g", price: 13200, cal: "260~440 kcal", serving: "400g", image: "/products/pint.jpg", flavor: true, maxF: 2 },
  { name: "프렌즈 팩", desc: "친구 세트", size: "쿼터", weight: "620g", price: 19000, cal: "324~704 kcal", serving: "620g", image: "/products/quarter.jpg", flavor: true, maxF: 4 },
  { name: "스타 세트", desc: "인기상품 모음", size: "레귤러", weight: "500g", price: 15500, cal: "300~500 kcal", serving: "500g", image: "/products/family.jpg", flavor: true, maxF: 3 },
  { name: "체리블라썸 팩", desc: "봄꽃 에디션", size: "레귤러", weight: "320g", price: 11500, cal: "220~380 kcal", serving: "320g", image: "/products/pint.jpg", flavor: true, maxF: 3 },
  { name: "미드나잇 팩", desc: "심야 에디션", size: "쿼터", weight: "620g", price: 18800, cal: "324~704 kcal", serving: "620g", image: "/products/quarter.jpg", flavor: true, maxF: 4 },
  { name: "선라이즈 팩", desc: "아침 에디션", size: "레귤러", weight: "400g", price: 12200, cal: "240~400 kcal", serving: "400g", image: "/products/half-gallon.jpg", flavor: true, maxF: 3 },
  { name: "레인보우 세트", desc: "무지개 에디션", size: "패밀리", weight: "960g", price: 27800, cal: "380~680 kcal", serving: "960g", image: "/products/pack-6.jpg", flavor: true, maxF: 6 },
  { name: "미니 파티팩", desc: "소규모 파티", size: "레귤러", weight: "300g", price: 10500, cal: "200~350 kcal", serving: "300g", image: "/products/pack-4.jpg", flavor: true, maxF: 3 },
  { name: "프리미엄 세트", desc: "고급 에디션", size: "쿼터", weight: "620g", price: 21000, cal: "350~700 kcal", serving: "620g", image: "/products/quarter.jpg", flavor: true, maxF: 4 },
  { name: "골든 세트", desc: "황금 에디션", size: "패밀리", weight: "960g", price: 30000, cal: "400~720 kcal", serving: "960g", image: "/products/family.jpg", flavor: true, maxF: 5 },
  { name: "실버 세트", desc: "실버 에디션", size: "레귤러", weight: "500g", price: 16500, cal: "300~500 kcal", serving: "500g", image: "/products/pint.jpg", flavor: true, maxF: 3 },
  { name: "다이아몬드 팩", desc: "최고급 에디션", size: "패밀리", weight: "1200g", price: 35000, cal: "500~900 kcal", serving: "1200g", image: "/products/half-gallon.jpg", flavor: true, maxF: 6 },
  { name: "시즌 파이널팩", desc: "마감 에디션", size: "쿼터", weight: "620g", price: 17500, cal: "324~704 kcal", serving: "620g", image: "/products/quarter.jpg", flavor: true, maxF: 4 },
])

// ─── 워크샵 스페셜 (28) ── Actual BR workshop menu ────────
const workshopProducts = generateProducts("workshop", [
  // Chef Made - 모찌 & 마카롱
  { name: "모찌 바람과\n함께 사라지다", desc: "Chef Made 모찌", size: "1개", weight: "60g", price: 3800, cal: "120~180 kcal", serving: "60g", image: "/products/mochi.jpg", flavor: false, maxF: 0, tag: "Chef Made" },
  { name: "마카롱\n피스타치오 아몬드", desc: "Chef Made 마카롱", size: "1개", weight: "50g", price: 4000, cal: "150~200 kcal", serving: "50g", image: "/products/macaron.jpg", flavor: false, maxF: 0, tag: "Chef Made" },
  { name: "마카롱\n베리베리 스트로베리", desc: "Chef Made 마카롱", size: "1개", weight: "50g", price: 4000, cal: "150~200 kcal", serving: "50g", image: "/products/macaron.jpg", flavor: false, maxF: 0, tag: "Chef Made" },
  { name: "마카롱\n초콜릿무스", desc: "Chef Made 마카롱", size: "1개", weight: "50g", price: 4000, cal: "150~200 kcal", serving: "50g", image: "/products/macaron.jpg", flavor: false, maxF: 0, tag: "Chef Made" },
  { name: "마카롱\n체리쥬빌레", desc: "Chef Made 마카롱", size: "1개", weight: "50g", price: 4000, cal: "150~200 kcal", serving: "50g", image: "/products/macaron.jpg", flavor: false, maxF: 0, tag: "Chef Made" },
  { name: "마카롱\n자모카 아몬드 휘지", desc: "Chef Made 마카롱", size: "1개", weight: "50g", price: 4000, cal: "150~200 kcal", serving: "50g", image: "/products/macaron.jpg", flavor: false, maxF: 0, tag: "Chef Made" },
  // Snack / Bakery
  { name: "넛츠피칸 아몬드", desc: "Chef Made 스낵", size: "1봉", weight: "120g", price: 5200, cal: "280~350 kcal", serving: "120g", image: "/products/nuts-pecan.jpg", flavor: false, maxF: 0, tag: "Chef Made" },
  { name: "초코머핀", desc: "진한 초코 머핀", size: "1개", weight: "100g", price: 3000, cal: "250~320 kcal", serving: "100g", image: "/products/choco-muffin.jpg", flavor: false, maxF: 0 },
  { name: "초코머핀 SET", desc: "초코머핀 세트 (20% 할인)", size: "세트", weight: "200g", price: 5900, cal: "500~640 kcal", serving: "200g", image: "/products/choco-muffin.jpg", flavor: false, maxF: 0, tag: "20% 할인" },
  // Popcorn
  { name: "초코 카라멜 팝콘", desc: "달콤한 초코 카라멜", size: "1봉", weight: "80g", price: 4200, cal: "300~400 kcal", serving: "80g", image: "/products/popcorn.jpg", flavor: false, maxF: 0 },
  { name: "시나몬 카라멜 팝콘", desc: "시나몬 향 카라멜", size: "1봉", weight: "80g", price: 4200, cal: "300~400 kcal", serving: "80g", image: "/products/popcorn.jpg", flavor: false, maxF: 0 },
  { name: "스윗 카라멜 팝콘", desc: "클래식 카라멜", size: "1봉", weight: "80g", price: 4200, cal: "300~400 kcal", serving: "80g", image: "/products/popcorn.jpg", flavor: false, maxF: 0 },
  // Affogato (위스키)
  { name: "위스키 아포가토\n바닐라", desc: "위스키 아포가토", size: "1잔", weight: "250ml", price: 9500, cal: "350~450 kcal", serving: "250ml", image: "/products/affogato.jpg", flavor: false, maxF: 0, tag: "먹고가기 전용" },
  { name: "위스키 아포가토\n크렘마롱", desc: "위스키 아포가토", size: "1잔", weight: "250ml", price: 9500, cal: "380~480 kcal", serving: "250ml", image: "/products/affogato.jpg", flavor: false, maxF: 0, tag: "먹고가기 전용" },
  { name: "위스키 아포가토\n브라우니쥬빌레", desc: "위스키 아포가토", size: "1잔", weight: "250ml", price: 9500, cal: "400~500 kcal", serving: "250ml", image: "/products/affogato.jpg", flavor: false, maxF: 0, tag: "먹고가기 전용" },
  // Gift Set
  { name: "카라멜 로스티드\n넛츠 선물세트", desc: "3EA 선물세트", size: "3EA", weight: "360g", price: 16600, cal: "840~1050 kcal", serving: "360g", image: "/products/gift-set.jpg", flavor: false, maxF: 0 },
  // Ice Cream Sets
  { name: "스트리조\n싱글레귤러(컵/콘)", desc: "싱글레귤러 컵 또는 콘", size: "싱글", weight: "120g", price: 3900, cal: "150~280 kcal", serving: "120g", image: "/products/cone-single.jpg", flavor: true, maxF: 1 },
  { name: "버라이어티팩 4색", desc: "싱글레귤러 4개", size: "4개", weight: "480g", price: 15600, cal: "600~1120 kcal", serving: "480g", image: "/products/pack-4.jpg", flavor: true, maxF: 4 },
  { name: "버라이어티팩 8색", desc: "싱글레귤러 8개", size: "8개", weight: "960g", price: 31200, cal: "1200~2240 kcal", serving: "960g", image: "/products/pack-8.jpg", flavor: true, maxF: 8 },
  // Affogato (일반)
  { name: "카페 아포가토", desc: "에스프레소 아포가토", size: "1잔", weight: "200ml", price: 6400, cal: "250~350 kcal", serving: "200ml", image: "/products/affogato.jpg", flavor: false, maxF: 0, tag: "먹고가기 전용" },
  { name: "쇼콜라 아포가토", desc: "초콜릿 아포가토", size: "1잔", weight: "200ml", price: 6400, cal: "280~380 kcal", serving: "200ml", image: "/products/affogato.jpg", flavor: false, maxF: 0, tag: "먹고가기 전용" },
  { name: "말차 아포가토", desc: "말차 아포가토", size: "1잔", weight: "200ml", price: 6400, cal: "260~360 kcal", serving: "200ml", image: "/products/affogato.jpg", flavor: false, maxF: 0, tag: "먹고가기 전용" },
  // Dessert / Plate
  { name: "두바이 스타일\n초콜릿쿠키", desc: "두바이st 디저트", size: "1개", weight: "150g", price: 6500, cal: "400~500 kcal", serving: "150g", image: "/products/dubai-cookie.jpg", flavor: false, maxF: 0 },
  { name: "인절미 플레이트", desc: "인절미 디저트 플레이트", size: "1세트", weight: "250g", price: 14500, cal: "450~600 kcal", serving: "250g", image: "/products/injeolmi-plate.jpg", flavor: false, maxF: 0, tag: "먹고가기 전용" },
  { name: "모찌 라이브 인절미", desc: "라이브 모찌", size: "1개", weight: "70g", price: 4800, cal: "140~200 kcal", serving: "70g", image: "/products/mochi.jpg", flavor: false, maxF: 0 },
  { name: "모찌 라이브 흑임자", desc: "라이브 모찌", size: "1개", weight: "70g", price: 4800, cal: "140~200 kcal", serving: "70g", image: "/products/mochi.jpg", flavor: false, maxF: 0 },
  { name: "모찌 라이브\n바람과 함께 사라지다", desc: "라이브 모찌", size: "1개", weight: "70g", price: 4800, cal: "140~200 kcal", serving: "70g", image: "/products/mochi.jpg", flavor: false, maxF: 0, tag: "Chef Made" },
])

// ─── 콘/컵 (30) ────────────────────────────────��──────────
const coneCupProducts = generateProducts("cone-cup", [
  { name: "맛보기", desc: "맛보기 스푼", size: "맛보기", weight: "-", price: 0, cal: "10~30 kcal", serving: "-", image: "/products/tasting-spoon.jpg", flavor: true, maxF: 1 },
  { name: "트리플주니어", desc: "주니어 3스쿱", size: "주니어", weight: "225g", price: 7200, cal: "300~500 kcal", serving: "225g", image: "/products/triple-junior.jpg", flavor: true, maxF: 3 },
  { name: "싱글레귤러", desc: "레귤러 1스쿱", size: "레귤러", weight: "115g", price: 3900, cal: "150~280 kcal", serving: "115g", image: "/products/cone-single.jpg", flavor: true, maxF: 1 },
  { name: "싱글킹", desc: "킹 1스쿱", size: "킹", weight: "145g", price: 4700, cal: "200~350 kcal", serving: "145g", image: "/products/single-king.jpg", flavor: true, maxF: 1 },
  { name: "이달의 더블주니어", desc: "이달의 더블주니어", size: "주니어", weight: "150g", price: 5100, cal: "200~350 kcal", serving: "150g", image: "/products/double-junior.jpg", flavor: true, maxF: 2, tag: "이달의 더블주니어" },
  { name: "더블레귤러", desc: "레귤러 2스쿱", size: "레귤러", weight: "230g", price: 7300, cal: "300~520 kcal", serving: "230g", image: "/products/double-regular.jpg", flavor: true, maxF: 2 },
])

// ─── 포장가능 아이스크림 (keep existing 12 + add 18 more = 30) ──
const packableProducts = generateProducts("packable-icecream", [
  { name: "파인트", desc: "3가지 맛", size: "3가지 맛 (320g)", weight: "320g", price: 9800, cal: "200~350 kcal", serving: "320g", image: "/products/pint.jpg", flavor: true, maxF: 3 },
  { name: "쿼터", desc: "4가지 맛", size: "4가지 맛 (620g)", weight: "620g", price: 18500, cal: "324~704 kcal", serving: "620g", image: "/products/quarter.jpg", flavor: true, maxF: 4 },
  { name: "패밀리", desc: "5가지 맛", size: "5가지 맛 (960g)", weight: "960g", price: 26000, cal: "324~704 kcal", serving: "960g", image: "/products/family.jpg", flavor: true, maxF: 5 },
  { name: "하프갤론", desc: "6가지 맛", size: "6가지 맛 (1200g)", weight: "1200g", price: 31500, cal: "450~900 kcal", serving: "1200g", image: "/products/half-gallon.jpg", flavor: true, maxF: 6 },
  { name: "아빠왔다팩", desc: "싱글레귤러 4개", size: "싱글레귤러 4개", weight: "4개", price: 15600, cal: "150~280 kcal", serving: "4개", image: "/products/pack-4.jpg", flavor: true, maxF: 4 },
  { name: "버라이어티팩", desc: "싱글레귤러 6개", size: "싱글레귤러 6개", weight: "6개", price: 23400, cal: "150~280 kcal", serving: "6개", image: "/products/pack-6.jpg", flavor: true, maxF: 6 },
  { name: "옹기종기팩", desc: "싱글레귤러 8개", size: "싱글레귤러 8개", weight: "8개", price: 31200, cal: "150~280 kcal", serving: "8개", image: "/products/pack-8.jpg", flavor: true, maxF: 8 },
  { name: "쿼터 초코", desc: "4가지 맛 초코", size: "4가지 맛 (620g)", weight: "620g", price: 18500, cal: "324~704 kcal", serving: "620g", image: "/products/quarter.jpg", flavor: true, maxF: 4 },
  { name: "쿼터 딸기", desc: "4가지 맛 딸기", size: "4가지 맛 (620g)", weight: "620g", price: 18500, cal: "324~704 kcal", serving: "620g", image: "/products/quarter.jpg", flavor: true, maxF: 4 },
  { name: "쿼터 민트", desc: "4가지 맛 민트", size: "4가지 맛 (620g)", weight: "620g", price: 18500, cal: "324~704 kcal", serving: "620g", image: "/products/quarter.jpg", flavor: true, maxF: 4 },
  { name: "쿼터 바닐라", desc: "4가지 맛 바닐라", size: "4가지 맛 (620g)", weight: "620g", price: 18500, cal: "324~704 kcal", serving: "620g", image: "/products/quarter.jpg", flavor: true, maxF: 4 },
  { name: "쿼터 망고", desc: "4가지 맛 망고", size: "4가지 맛 (620g)", weight: "620g", price: 18500, cal: "324~704 kcal", serving: "620g", image: "/products/quarter.jpg", flavor: true, maxF: 4 },
  { name: "파인트 초코", desc: "3가지 맛 초코", size: "3가지 맛 (320g)", weight: "320g", price: 9800, cal: "200~350 kcal", serving: "320g", image: "/products/pint.jpg", flavor: true, maxF: 3 },
  { name: "파인트 딸기", desc: "3가지 맛 딸기", size: "3가지 맛 (320g)", weight: "320g", price: 9800, cal: "200~350 kcal", serving: "320g", image: "/products/pint.jpg", flavor: true, maxF: 3 },
  { name: "파인트 민트", desc: "3가지 맛 민트", size: "3가지 맛 (320g)", weight: "320g", price: 9800, cal: "200~350 kcal", serving: "320g", image: "/products/pint.jpg", flavor: true, maxF: 3 },
  { name: "패밀리 초코", desc: "5가지 맛 초코", size: "5가지 맛 (960g)", weight: "960g", price: 26000, cal: "324~704 kcal", serving: "960g", image: "/products/family.jpg", flavor: true, maxF: 5 },
  { name: "패밀리 딸기", desc: "5가지 맛 딸기", size: "5가지 맛 (960g)", weight: "960g", price: 26000, cal: "324~704 kcal", serving: "960g", image: "/products/family.jpg", flavor: true, maxF: 5 },
  { name: "하프갤론 초코", desc: "6가지 맛 초코", size: "6가지 맛 (1200g)", weight: "1200g", price: 31500, cal: "450~900 kcal", serving: "1200g", image: "/products/half-gallon.jpg", flavor: true, maxF: 6 },
  { name: "하프갤론 딸기", desc: "6가지 맛 딸기", size: "6가지 맛 (1200g)", weight: "1200g", price: 31500, cal: "450~900 kcal", serving: "1200g", image: "/products/half-gallon.jpg", flavor: true, maxF: 6 },
  { name: "엄마왔다팩", desc: "싱글레귤러 4개", size: "싱글레귤러 4개", weight: "4개", price: 15600, cal: "150~280 kcal", serving: "4개", image: "/products/pack-4.jpg", flavor: true, maxF: 4 },
  { name: "스페셜 버라이어티", desc: "싱글레귤러 6개", size: "싱글레귤러 6개", weight: "6개", price: 24500, cal: "150~280 kcal", serving: "6개", image: "/products/pack-6.jpg", flavor: true, maxF: 6 },
  { name: "점보 옹기종기", desc: "싱글레귤러 10개", size: "싱글레귤러 10개", weight: "10개", price: 38000, cal: "150~280 kcal", serving: "10개", image: "/products/pack-8.jpg", flavor: true, maxF: 10 },
  { name: "미니 파인트", desc: "2가지 맛", size: "2가지 맛 (200g)", weight: "200g", price: 7200, cal: "130~230 kcal", serving: "200g", image: "/products/pint.jpg", flavor: true, maxF: 2 },
  { name: "더블 파인트", desc: "3가지 맛 x2", size: "3가지 맛 (640g)", weight: "640g", price: 18500, cal: "400~700 kcal", serving: "640g", image: "/products/pint.jpg", flavor: true, maxF: 3 },
  { name: "프리미엄 쿼터", desc: "프리미엄 4가지", size: "4가지 맛 (620g)", weight: "620g", price: 21000, cal: "350~750 kcal", serving: "620g", image: "/products/quarter.jpg", flavor: true, maxF: 4 },
  { name: "프리미엄 패밀리", desc: "프리미엄 5가지", size: "5가지 맛 (960g)", weight: "960g", price: 29000, cal: "350~750 kcal", serving: "960g", image: "/products/family.jpg", flavor: true, maxF: 5 },
  { name: "시즌 파인트", desc: "시즌 3가지", size: "3가지 맛 (320g)", weight: "320g", price: 10800, cal: "200~350 kcal", serving: "320g", image: "/products/pint.jpg", flavor: true, maxF: 3 },
  { name: "시즌 쿼터", desc: "시즌 4가지", size: "4가지 맛 (620g)", weight: "620g", price: 19500, cal: "324~704 kcal", serving: "620g", image: "/products/quarter.jpg", flavor: true, maxF: 4 },
  { name: "커플 파인트", desc: "2개 파인트 세트", size: "2개 세트", weight: "640g", price: 18000, cal: "400~700 kcal", serving: "640g", image: "/products/pint.jpg", flavor: true, maxF: 3 },
  { name: "트윈 쿼터", desc: "2개 쿼터 세트", size: "2개 세트", weight: "1240g", price: 34000, cal: "648~1408 kcal", serving: "1240g", image: "/products/quarter.jpg", flavor: true, maxF: 4 },
])

// ─── 아이스크림 케이크 (58) ── Actual BR ice cream cake menu ──
export const cakeSubcategories = [
  { id: "all", name: "전체" },
  { id: "small", name: "보울/에그/소형" },
  { id: "basic", name: "기본 홀케이크" },
  { id: "premium", name: "프리미엄/캐릭터" },
]

const cakeProducts = generateProducts("icecream-cake", [
  // ── 15,000원대 – 보울/에그/소형 케이크 라인 ──
  { name: "레드하트\n시트론 보울", desc: "보울 케이크", size: "보울", weight: "350g", price: 15000, cal: "600~800 kcal", serving: "350g", image: "/products/cake-bowl.jpg", flavor: false, maxF: 0, sub: "small" },
  { name: "해피 윈터\n화이트 씰", desc: "씰 케이크", size: "에그", weight: "500g", price: 22000, cal: "800~1100 kcal", serving: "500g", image: "/products/cake-seal.jpg", flavor: false, maxF: 0, sub: "small" },
  { name: "스노우맨\n블루 씰", desc: "씰 케이크", size: "에그", weight: "500g", price: 22000, cal: "800~1100 kcal", serving: "500g", image: "/products/cake-seal.jpg", flavor: false, maxF: 0, sub: "small" },
  { name: "스윗 드림핑\n핑크 씰", desc: "씰 케이크", size: "에그", weight: "500g", price: 22000, cal: "800~1100 kcal", serving: "500g", image: "/products/cake-seal.jpg", flavor: false, maxF: 0, sub: "small" },
  { name: "핑크 디노", desc: "디노 케이크", size: "캐릭터", weight: "600g", price: 29000, cal: "1000~1400 kcal", serving: "600g", image: "/products/cake-dino.jpg", flavor: false, maxF: 0, sub: "small" },
  { name: "오렌지 디노", desc: "디노 케이크", size: "캐릭터", weight: "600g", price: 29000, cal: "1000~1400 kcal", serving: "600g", image: "/products/cake-dino.jpg", flavor: false, maxF: 0, sub: "small" },
  { name: "바나나치오 바질", desc: "보울 케이크", size: "보울", weight: "350g", price: 15000, cal: "600~800 kcal", serving: "350g", image: "/products/cake-bowl.jpg", flavor: false, maxF: 0, sub: "small" },
  { name: "스윗하트\n크랩 에그", desc: "에그 케이크", size: "에그", weight: "400g", price: 15000, cal: "500~700 kcal", serving: "400g", image: "/products/cake-egg.jpg", flavor: false, maxF: 0, sub: "small" },
  { name: "초콜릿 더블 에그", desc: "에그 케이크", size: "에그", weight: "400g", price: 15000, cal: "550~750 kcal", serving: "400g", image: "/products/cake-egg.jpg", flavor: false, maxF: 0, sub: "small" },
  { name: "단지 쑥 유자", desc: "보울 케이크", size: "보울", weight: "350g", price: 15000, cal: "500~700 kcal", serving: "350g", image: "/products/cake-bowl.jpg", flavor: false, maxF: 0, sub: "small" },
  { name: "멜로우 쇼코니", desc: "소형 케이크", size: "소형", weight: "350g", price: 15000, cal: "500~700 kcal", serving: "350g", image: "/products/cake-bowl.jpg", flavor: false, maxF: 0, sub: "small" },
  { name: "치즈러버 쇼코니", desc: "소형 케이크", size: "소형", weight: "350g", price: 15000, cal: "500~700 kcal", serving: "350g", image: "/products/cake-bowl.jpg", flavor: false, maxF: 0, sub: "small" },
  { name: "쪼꼬볼 쇼코니", desc: "소형 케이크", size: "소형", weight: "350g", price: 15000, cal: "500~700 kcal", serving: "350g", image: "/products/cake-bowl.jpg", flavor: false, maxF: 0, sub: "small" },
  { name: "쪼꼬링 쇼코니", desc: "소형 케이크", size: "소형", weight: "350g", price: 15000, cal: "500~700 kcal", serving: "350g", image: "/products/cake-bowl.jpg", flavor: false, maxF: 0, sub: "small" },
  { name: "초코딥\n스노우볼 놀", desc: "소형 케이크", size: "소형", weight: "350g", price: 15000, cal: "550~750 kcal", serving: "350g", image: "/products/cake-bowl.jpg", flavor: false, maxF: 0, sub: "small" },
  { name: "허그미 러브 벨", desc: "소형 케이크", size: "소형", weight: "350g", price: 15000, cal: "500~700 kcal", serving: "350g", image: "/products/cake-bowl.jpg", flavor: false, maxF: 0, sub: "small" },
  { name: "써니사이드\n업 에그", desc: "에그 케이크", size: "에그", weight: "400g", price: 15000, cal: "500~700 kcal", serving: "400g", image: "/products/cake-egg.jpg", flavor: false, maxF: 0, sub: "small" },
  { name: "러블리 미녀 놀", desc: "소형 케이크", size: "소형", weight: "350g", price: 15000, cal: "500~700 kcal", serving: "350g", image: "/products/cake-bowl.jpg", flavor: false, maxF: 0, sub: "small", tag: "먹고가기" },
  { name: "리틀 기프트 보울", desc: "보울 케이크", size: "보울", weight: "350g", price: 15000, cal: "500~700 kcal", serving: "350g", image: "/products/cake-bowl.jpg", flavor: false, maxF: 0, sub: "small" },

  // ── 30,000원대 – 기본 홀케이크 라인 ──
  { name: "골든 프랄린\n바움쿠헨 케이크", desc: "홀케이크", size: "홀", weight: "800g", price: 32000, cal: "1800~2400 kcal", serving: "800g", image: "/products/cake-round.jpg", flavor: false, maxF: 0, sub: "basic" },
  { name: "골든 브릴레\n판타지", desc: "홀케이크", size: "홀", weight: "800g", price: 32000, cal: "1800~2400 kcal", serving: "800g", image: "/products/cake-round.jpg", flavor: false, maxF: 0, sub: "basic", tag: "먹고가기" },
  { name: "홀리데이\n초콜릿 판타지", desc: "홀케이크", size: "홀", weight: "800g", price: 32000, cal: "1900~2500 kcal", serving: "800g", image: "/products/cake-round.jpg", flavor: false, maxF: 0, sub: "basic" },
  { name: "피넛 라떼 브릭", desc: "홀케이크", size: "홀", weight: "750g", price: 28000, cal: "1600~2200 kcal", serving: "750g", image: "/products/cake-round.jpg", flavor: false, maxF: 0, sub: "basic" },
  { name: "스노우 초코아몬드\n바움쿠헨", desc: "홀케이크", size: "홀", weight: "800g", price: 31000, cal: "1800~2400 kcal", serving: "800g", image: "/products/cake-round.jpg", flavor: false, maxF: 0, sub: "basic" },
  { name: "스노우 초코베리\n바움쿠헨", desc: "홀케이크", size: "홀", weight: "800g", price: 31000, cal: "1800~2400 kcal", serving: "800g", image: "/products/cake-round.jpg", flavor: false, maxF: 0, sub: "basic" },
  { name: "진정한 크림치즈\n레드벨벳", desc: "홀케이크", size: "홀", weight: "750g", price: 28000, cal: "1600~2200 kcal", serving: "750g", image: "/products/cake-round.jpg", flavor: false, maxF: 0, sub: "basic" },
  { name: "더 듬뿍 딸기\n우유 케이크", desc: "홀케이크", size: "홀", weight: "900g", price: 35000, cal: "1800~2400 kcal", serving: "900g", image: "/products/cake-premium.jpg", flavor: false, maxF: 0, sub: "basic" },
  { name: "더 듬뿍 오렌지\n앤 자몽 케이크", desc: "홀케이크", size: "홀", weight: "850g", price: 34000, cal: "1700~2300 kcal", serving: "850g", image: "/products/cake-premium.jpg", flavor: false, maxF: 0, sub: "basic" },
  { name: "마이멜로디와\n더 듬뿍 딸기", desc: "캐릭터 홀케이크", size: "홀", weight: "850g", price: 34000, cal: "1800~2400 kcal", serving: "850g", image: "/products/cake-character.jpg", flavor: false, maxF: 0, sub: "basic" },
  { name: "한고동의\n스윗 파티", desc: "캐릭터 홀케이크", size: "홀", weight: "800g", price: 30000, cal: "1700~2300 kcal", serving: "800g", image: "/products/cake-character.jpg", flavor: false, maxF: 0, sub: "basic" },
  { name: "스윗 해피 트레인", desc: "홀케이크", size: "홀", weight: "850g", price: 34000, cal: "1800~2400 kcal", serving: "850g", image: "/products/cake-party.jpg", flavor: false, maxF: 0, sub: "basic" },

  // ── 38,000원~48,000원 – 프리미엄/캐릭터/테마 라인 ──
  { name: "굿럭 카피바라", desc: "프리미엄 케이크", size: "프리미엄", weight: "900g", price: 38000, cal: "2000~2600 kcal", serving: "900g", image: "/products/cake-character.jpg", flavor: false, maxF: 0, sub: "premium" },
  { name: "럭키 포니 춘식이", desc: "캐릭터 케이크", size: "캐릭터", weight: "800g", price: 30000, cal: "1700~2300 kcal", serving: "800g", image: "/products/cake-character.jpg", flavor: false, maxF: 0, sub: "premium" },
  { name: "짝짝짝 시계 보울", desc: "보울 케이크", size: "보울", weight: "350g", price: 15000, cal: "500~700 kcal", serving: "350g", image: "/products/cake-bowl.jpg", flavor: false, maxF: 0, sub: "premium" },
  { name: "로맨틱 야수 에그", desc: "에그 케이크", size: "에그", weight: "400g", price: 15000, cal: "500~700 kcal", serving: "400g", image: "/products/cake-egg.jpg", flavor: false, maxF: 0, sub: "premium" },
  { name: "빵띠 케이크\n4개입 세트", desc: "세트 케이크", size: "4개입", weight: "1200g", price: 59000, cal: "3200~4200 kcal", serving: "1200g", image: "/products/cake-party.jpg", flavor: false, maxF: 0, sub: "premium", tag: "세트포장" },
  { name: "화이트 스트로베리\n캡슐", desc: "프리미엄 케이크", size: "프리미엄", weight: "1000g", price: 46000, cal: "2400~3200 kcal", serving: "1000g", image: "/products/cake-premium.jpg", flavor: false, maxF: 0, sub: "premium" },
  { name: "초코 스트로베리\n가든", desc: "프리미엄 케이크", size: "프리미엄", weight: "1000g", price: 46000, cal: "2500~3300 kcal", serving: "1000g", image: "/products/cake-premium.jpg", flavor: false, maxF: 0, sub: "premium" },
  { name: "골든 쇼콜라 케이크", desc: "프리미엄 케이크", size: "프리미엄", weight: "850g", price: 34000, cal: "2000~2600 kcal", serving: "850g", image: "/products/cake-round.jpg", flavor: false, maxF: 0, sub: "premium" },
  { name: "화이트 스트로베리\n페스티벌", desc: "신제품", size: "홀", weight: "750g", price: 26000, cal: "1400~1900 kcal", serving: "750g", image: "/products/cake-premium.jpg", flavor: false, maxF: 0, sub: "premium", tag: "NEW" },
  { name: "초코 스트로베리\n페스티벌", desc: "신제품", size: "홀", weight: "750g", price: 26000, cal: "1500~2000 kcal", serving: "750g", image: "/products/cake-premium.jpg", flavor: false, maxF: 0, sub: "premium", tag: "NEW" },
  { name: "피스타치오\n스트로베리 페스티벌", desc: "신제품", size: "홀", weight: "750g", price: 26000, cal: "1500~2000 kcal", serving: "750g", image: "/products/cake-premium.jpg", flavor: false, maxF: 0, sub: "premium", tag: "NEW" },
  { name: "핑크 펀 인 하트", desc: "하트 프리미엄", size: "하트", weight: "900g", price: 36000, cal: "2000~2600 kcal", serving: "900g", image: "/products/cake-heart.jpg", flavor: false, maxF: 0, sub: "premium", tag: "NEW" },
  { name: "하트 앤 하트\n쇼콜라", desc: "하트 프리미엄", size: "하트", weight: "1000g", price: 44000, cal: "2400~3200 kcal", serving: "1000g", image: "/products/cake-heart.jpg", flavor: false, maxF: 0, sub: "premium", tag: "NEW" },
  { name: "초코 스트로베리\n바스켓", desc: "바스켓 케이크", size: "바스켓", weight: "400g", price: 15000, cal: "500~700 kcal", serving: "400g", image: "/products/cake-basket.jpg", flavor: false, maxF: 0, sub: "premium", tag: "NEW" },
  { name: "화이트 스트로베리\n바스켓", desc: "바스켓 케이크", size: "바스켓", weight: "400g", price: 15000, cal: "500~700 kcal", serving: "400g", image: "/products/cake-basket.jpg", flavor: false, maxF: 0, sub: "premium", tag: "NEW" },
  { name: "스트로베리 요거트\n프레지에", desc: "프리미엄 케이크", size: "프리미엄", weight: "1100g", price: 49000, cal: "2600~3400 kcal", serving: "1100g", image: "/products/cake-premium.jpg", flavor: false, maxF: 0, sub: "premium", tag: "NEW" },
  { name: "두바이 스타일\n앤 스트로베리", desc: "프리미엄 케이크", size: "프리미엄", weight: "950g", price: 42000, cal: "2200~2900 kcal", serving: "950g", image: "/products/cake-premium.jpg", flavor: false, maxF: 0, sub: "premium", tag: "NEW" },
  { name: "베리 베리 빅에그", desc: "빅에그 케이크", size: "빅에그", weight: "1000g", price: 43000, cal: "2300~3000 kcal", serving: "1000g", image: "/products/cake-egg.jpg", flavor: false, maxF: 0, sub: "premium" },
  { name: "물개박수\n그레이 씰 빅에그", desc: "빅에그 케이크", size: "빅에그", weight: "1000g", price: 44000, cal: "2300~3000 kcal", serving: "1000g", image: "/products/cake-seal.jpg", flavor: false, maxF: 0, sub: "premium", tag: "NEW" },
  { name: "코지 래빗 하우스", desc: "캐릭터 케이크", size: "캐릭터", weight: "850g", price: 34000, cal: "1800~2400 kcal", serving: "850g", image: "/products/cake-character.jpg", flavor: false, maxF: 0, sub: "premium" },
  { name: "야옹이 프렌즈\n샌드", desc: "캐릭터 케이크", size: "캐릭터", weight: "850g", price: 34000, cal: "1800~2400 kcal", serving: "850g", image: "/products/cake-character.jpg", flavor: false, maxF: 0, sub: "premium", tag: "먹고가기" },
  { name: "화이트 테디의\n하트 쿠션", desc: "캐릭터 케이크", size: "캐릭터", weight: "850g", price: 34000, cal: "1800~2400 kcal", serving: "850g", image: "/products/cake-character.jpg", flavor: false, maxF: 0, sub: "premium" },
  { name: "마이 핑크\n벌룬 퍼피", desc: "캐릭터 케이크", size: "캐릭터", weight: "800g", price: 32000, cal: "1700~2300 kcal", serving: "800g", image: "/products/cake-character.jpg", flavor: false, maxF: 0, sub: "premium" },
  { name: "포니 마카롱\n원더랜드", desc: "마카롱 케이크", size: "프리미엄", weight: "1000g", price: 43000, cal: "2400~3200 kcal", serving: "1000g", image: "/products/cake-macaron.jpg", flavor: false, maxF: 0, sub: "premium" },
  { name: "소원 가득 포니\n파밀리 에그", desc: "빅에그 케이크", size: "빅에그", weight: "1100g", price: 48000, cal: "2600~3400 kcal", serving: "1100g", image: "/products/cake-egg.jpg", flavor: false, maxF: 0, sub: "premium" },
  { name: "럭키 해피 비숑", desc: "캐릭터 케이크", size: "캐릭터", weight: "900g", price: 38000, cal: "2000~2600 kcal", serving: "900g", image: "/products/cake-character.jpg", flavor: false, maxF: 0, sub: "premium" },
])

// ─── 빙수 (30) ────────────────────────────────────────────
const bingsuProducts = generateProducts("bingsu", [
  { name: "딸기 빙수", desc: "딸기 빙수", size: "레귤러", weight: "500g", price: 12000, cal: "350~500 kcal", serving: "500g", image: "/products/bingsu.jpg", flavor: false, maxF: 0 },
  { name: "망고 빙수", desc: "망고 빙수", size: "레귤러", weight: "500g", price: 12500, cal: "360~520 kcal", serving: "500g", image: "/products/bingsu-mango.jpg", flavor: false, maxF: 0 },
  { name: "팥 빙수", desc: "전통 팥빙수", size: "레귤러", weight: "550g", price: 10500, cal: "320~460 kcal", serving: "550g", image: "/products/bingsu.jpg", flavor: false, maxF: 0 },
  { name: "초코 빙수", desc: "초코 빙수", size: "레귤러", weight: "500g", price: 12000, cal: "380~540 kcal", serving: "500g", image: "/products/bingsu.jpg", flavor: false, maxF: 0 },
  { name: "인절미 빙수", desc: "인절미 빙수", size: "레귤러", weight: "520g", price: 11500, cal: "340~480 kcal", serving: "520g", image: "/products/bingsu.jpg", flavor: false, maxF: 0 },
  { name: "콩가루 빙수", desc: "콩가루 빙수", size: "레귤러", weight: "500g", price: 11000, cal: "330~470 kcal", serving: "500g", image: "/products/bingsu.jpg", flavor: false, maxF: 0 },
  { name: "그린티 빙수", desc: "녹차 빙수", size: "레귤러", weight: "500g", price: 12000, cal: "320~450 kcal", serving: "500g", image: "/products/bingsu-mango.jpg", flavor: false, maxF: 0 },
  { name: "블루베리 빙수", desc: "블루베리 빙수", size: "레귤러", weight: "500g", price: 12500, cal: "340~480 kcal", serving: "500g", image: "/products/bingsu.jpg", flavor: false, maxF: 0 },
  { name: "피치 빙수", desc: "복숭아 빙수", size: "레귤러", weight: "500g", price: 12000, cal: "330~470 kcal", serving: "500g", image: "/products/bingsu-mango.jpg", flavor: false, maxF: 0 },
  { name: "수박 빙수", desc: "수박 빙수", size: "레귤러", weight: "550g", price: 13000, cal: "300~430 kcal", serving: "550g", image: "/products/bingsu.jpg", flavor: false, maxF: 0 },
  { name: "멜론 빙수", desc: "멜론 빙수", size: "레귤러", weight: "500g", price: 13500, cal: "340~480 kcal", serving: "500g", image: "/products/bingsu-mango.jpg", flavor: false, maxF: 0 },
  { name: "요거트 빙수", desc: "요거트 빙수", size: "레귤러", weight: "480g", price: 11500, cal: "300~430 kcal", serving: "480g", image: "/products/bingsu.jpg", flavor: false, maxF: 0 },
  { name: "연유 빙수", desc: "연유 빙수", size: "레귤러", weight: "500g", price: 11000, cal: "350~500 kcal", serving: "500g", image: "/products/bingsu.jpg", flavor: false, maxF: 0 },
  { name: "미니 딸기 빙수", desc: "미니 딸기", size: "미니", weight: "300g", price: 8500, cal: "200~300 kcal", serving: "300g", image: "/products/bingsu.jpg", flavor: false, maxF: 0 },
  { name: "미니 망고 빙수", desc: "미니 망고", size: "미니", weight: "300g", price: 8800, cal: "210~310 kcal", serving: "300g", image: "/products/bingsu-mango.jpg", flavor: false, maxF: 0 },
  { name: "미니 팥 빙수", desc: "미니 팥", size: "미니", weight: "300g", price: 7500, cal: "180~270 kcal", serving: "300g", image: "/products/bingsu.jpg", flavor: false, maxF: 0 },
  { name: "프리미엄 딸기빙수", desc: "프리미엄 딸기", size: "프리미엄", weight: "700g", price: 16000, cal: "450~650 kcal", serving: "700g", image: "/products/bingsu.jpg", flavor: false, maxF: 0 },
  { name: "프리미엄 망고빙수", desc: "프리미엄 망고", size: "프리미엄", weight: "700g", price: 16500, cal: "460~660 kcal", serving: "700g", image: "/products/bingsu-mango.jpg", flavor: false, maxF: 0 },
  { name: "오레오 빙수", desc: "오레오 빙수", size: "레귤러", weight: "500g", price: 12500, cal: "380~540 kcal", serving: "500g", image: "/products/bingsu.jpg", flavor: false, maxF: 0 },
  { name: "쿠키앤크림 빙수", desc: "쿠키 빙수", size: "레귤러", weight: "500g", price: 12000, cal: "370~530 kcal", serving: "500g", image: "/products/bingsu.jpg", flavor: false, maxF: 0 },
  { name: "카라멜 빙수", desc: "카라멜 빙수", size: "레귤러", weight: "500g", price: 12000, cal: "370~530 kcal", serving: "500g", image: "/products/bingsu-mango.jpg", flavor: false, maxF: 0 },
  { name: "흑임자 빙수", desc: "흑임자 빙수", size: "레귤러", weight: "520g", price: 11500, cal: "340~480 kcal", serving: "520g", image: "/products/bingsu.jpg", flavor: false, maxF: 0 },
  { name: "메가 딸기 빙수", desc: "메가 사이즈", size: "메가", weight: "800g", price: 18000, cal: "500~720 kcal", serving: "800g", image: "/products/bingsu.jpg", flavor: false, maxF: 0 },
  { name: "메가 초코 빙수", desc: "메가 사이즈", size: "메가", weight: "800g", price: 18000, cal: "540~760 kcal", serving: "800g", image: "/products/bingsu.jpg", flavor: false, maxF: 0 },
  { name: "코코넛 빙수", desc: "코코넛 빙수", size: "레귤러", weight: "500g", price: 12500, cal: "360~510 kcal", serving: "500g", image: "/products/bingsu-mango.jpg", flavor: false, maxF: 0 },
  { name: "팥 크림 빙수", desc: "팥크림 빙수", size: "레귤러", weight: "520g", price: 11800, cal: "350~490 kcal", serving: "520g", image: "/products/bingsu.jpg", flavor: false, maxF: 0 },
  { name: "그래놀라 빙수", desc: "그래놀라 빙수", size: "레귤러", weight: "500g", price: 12000, cal: "360~510 kcal", serving: "500g", image: "/products/bingsu.jpg", flavor: false, maxF: 0 },
  { name: "치즈 빙수", desc: "치즈 빙수", size: "레귤러", weight: "500g", price: 12500, cal: "380~540 kcal", serving: "500g", image: "/products/bingsu-mango.jpg", flavor: false, maxF: 0 },
  { name: "티라미수 빙수", desc: "티라미수 빙수", size: "레귤러", weight: "500g", price: 13000, cal: "390~550 kcal", serving: "500g", image: "/products/bingsu.jpg", flavor: false, maxF: 0 },
  { name: "스페셜 빙수", desc: "스페셜 에디션", size: "스페셜", weight: "600g", price: 15000, cal: "420~600 kcal", serving: "600g", image: "/products/bingsu.jpg", flavor: false, maxF: 0 },
])

// ─── 커피 (8) ── Actual BR coffee menu ────────────────────
const coffeeProducts = generateProducts("coffee", [
  { name: "위티 골든 브릴레\n아이스슈페너", desc: "아이스슈페너", size: "레귤러", weight: "350ml", price: 5500, cal: "180~260 kcal", serving: "350ml", image: "/products/einspanner.jpg", flavor: false, maxF: 0 },
  { name: "카페 레이어드 라떼", desc: "레이어드 라떼", size: "레귤러", weight: "350ml", price: 5400, cal: "150~220 kcal", serving: "350ml", image: "/products/layered-latte.jpg", flavor: false, maxF: 0 },
  { name: "아메리카노", desc: "아이스/핫", size: "레귤러", weight: "350ml", price: 4400, cal: "5~10 kcal", serving: "350ml", image: "/products/americano.jpg", flavor: false, maxF: 0 },
  { name: "카페라떼", desc: "아이스/핫", size: "레귤러", weight: "350ml", price: 5000, cal: "120~180 kcal", serving: "350ml", image: "/products/cafe-latte.jpg", flavor: false, maxF: 0 },
  { name: "바닐라라떼", desc: "아이스/핫", size: "레귤러", weight: "350ml", price: 5000, cal: "180~250 kcal", serving: "350ml", image: "/products/cafe-latte.jpg", flavor: false, maxF: 0 },
  { name: "연유라떼", desc: "아이스", size: "레귤러", weight: "350ml", price: 5000, cal: "210~300 kcal", serving: "350ml", image: "/products/condensed-latte.jpg", flavor: false, maxF: 0 },
  { name: "엄마는 외계인\n카페모카", desc: "카페모카", size: "레귤러", weight: "350ml", price: 5000, cal: "220~300 kcal", serving: "350ml", image: "/products/cafe-mocha.jpg", flavor: false, maxF: 0 },
  { name: "수카방 커피", desc: "수카방 커피", size: "레귤러", weight: "300ml", price: 3900, cal: "80~120 kcal", serving: "300ml", image: "/products/sukabang.jpg", flavor: false, maxF: 0 },
])

// ─── 음료 블라스트 (30) ────────────────��──────────────────
export const beverageSubcategories = [
  { id: "all", name: "전체" },
  { id: "signature", name: "시그니처/쉐이크" },
  { id: "tea", name: "Tea/Hot" },
  { id: "k-drink", name: "K-Drink" },
  { id: "classic-shake", name: "클래식 쉐이크" },
]

const beverageProducts = generateProducts("beverage", [
  // ── 시그니처 / 쉐이크 / 블라스트 ──
  { name: "레슬리 민트\n초콜릿칩 쉐이크", desc: "시그니처 쉐이크", size: "레귤러", weight: "400ml", price: 6200, cal: "320~400 kcal", serving: "400ml", image: "/products/shake-mint.jpg", flavor: false, maxF: 0, sub: "signature" },
  { name: "레슬리 엄마는\n외계인 쉐이크", desc: "시그니처 쉐이크", size: "레귤러", weight: "400ml", price: 6200, cal: "310~390 kcal", serving: "400ml", image: "/products/smoothie.jpg", flavor: false, maxF: 0, sub: "signature" },
  { name: "엄마는 외계인\n블라스트", desc: "블라스트", size: "레귤러", weight: "400ml", price: 6200, cal: "300~380 kcal", serving: "400ml", image: "/products/smoothie.jpg", flavor: false, maxF: 0, sub: "signature" },
  { name: "우주 라이크\n봉봉 블라스트", desc: "블라스트", size: "레귤러", weight: "400ml", price: 5800, cal: "280~350 kcal", serving: "400ml", image: "/products/smoothie.jpg", flavor: false, maxF: 0, sub: "signature" },
  { name: "카푸치노 블라스트\n오리지널", desc: "카푸치노 블라스트", size: "레귤러", weight: "400ml", price: 5800, cal: "260~340 kcal", serving: "400ml", image: "/products/cappuccino-blast.jpg", flavor: false, maxF: 0, sub: "signature" },
  { name: "카푸치노 블라스트\n모카", desc: "카푸치노 블라스트", size: "레귤러", weight: "400ml", price: 6100, cal: "290~370 kcal", serving: "400ml", image: "/products/cappuccino-blast.jpg", flavor: false, maxF: 0, sub: "signature" },
  { name: "설향딸기 블라스트", desc: "블라스트", size: "레귤러", weight: "400ml", price: 5000, cal: "220~300 kcal", serving: "400ml", image: "/products/strawberry-blast.jpg", flavor: false, maxF: 0, sub: "signature" },
  { name: "딸기 연유 블라스트", desc: "블라스트", size: "레귤러", weight: "400ml", price: 6800, cal: "280~360 kcal", serving: "400ml", image: "/products/strawberry-blast.jpg", flavor: false, maxF: 0, sub: "signature" },

  // ── Tea / Hot Beverage ──
  { name: "자몽 히비스커스티", desc: "허브티", size: "레귤러", weight: "350ml", price: 3500, cal: "40~80 kcal", serving: "350ml", image: "/products/hibiscus-tea.jpg", flavor: false, maxF: 0, sub: "tea" },
  { name: "레드향 캐모마일티", desc: "허브티", size: "레귤러", weight: "350ml", price: 3500, cal: "30~60 kcal", serving: "350ml", image: "/products/hibiscus-tea.jpg", flavor: false, maxF: 0, sub: "tea" },
  { name: "얼그레이", desc: "차", size: "레귤러", weight: "350ml", price: 4900, cal: "5~10 kcal", serving: "350ml", image: "/products/hibiscus-tea.jpg", flavor: false, maxF: 0, sub: "tea" },
  { name: "캐모마일", desc: "허브티", size: "레귤러", weight: "350ml", price: 4900, cal: "5~10 kcal", serving: "350ml", image: "/products/hibiscus-tea.jpg", flavor: false, maxF: 0, sub: "tea" },
  { name: "위스키\n아이리쉬 커피", desc: "위스키 커피", size: "레귤러", weight: "250ml", price: 9500, cal: "200~300 kcal", serving: "250ml", image: "/products/irish-coffee.jpg", flavor: false, maxF: 0, sub: "tea", tag: "먹고가기 전용" },
  { name: "한라봉\n커즈마인 티", desc: "프루트티", size: "레귤러", weight: "350ml", price: 6200, cal: "80~130 kcal", serving: "350ml", image: "/products/hibiscus-tea.jpg", flavor: false, maxF: 0, sub: "tea" },
  { name: "피치 캐모마일\n아이스티", desc: "아이스티", size: "레귤러", weight: "400ml", price: 6200, cal: "60~100 kcal", serving: "400ml", image: "/products/hibiscus-tea.jpg", flavor: false, maxF: 0, sub: "tea" },

  // ── K-Drink / Specialty Drink ──
  { name: "식혜 K-Drink", desc: "전통 음료", size: "레귤러", weight: "350ml", price: 6200, cal: "120~180 kcal", serving: "350ml", image: "/products/sikhye.jpg", flavor: false, maxF: 0, sub: "k-drink" },
  { name: "수정과 K-Drink", desc: "전통 음료", size: "레귤러", weight: "350ml", price: 6200, cal: "100~160 kcal", serving: "350ml", image: "/products/sikhye.jpg", flavor: false, maxF: 0, sub: "k-drink" },
  { name: "미숫가루 라떼", desc: "곡물 라떼", size: "레귤러", weight: "350ml", price: 3800, cal: "180~260 kcal", serving: "350ml", image: "/products/misugaru.jpg", flavor: false, maxF: 0, sub: "k-drink", tag: "NEW" },
  { name: "우리 인절미\n곡물쉐이크", desc: "곡물 쉐이크", size: "레귤러", weight: "400ml", price: 6900, cal: "300~400 kcal", serving: "400ml", image: "/products/misugaru.jpg", flavor: false, maxF: 0, sub: "k-drink" },
  { name: "두바이 스타일\n초코라떼", desc: "스페셜 라떼", size: "레귤러", weight: "350ml", price: 5800, cal: "250~340 kcal", serving: "350ml", image: "/products/dubai-choco.jpg", flavor: false, maxF: 0, sub: "k-drink" },

  // ── Classic Shake Line – NEW ──
  { name: "딸기&바나나\n더블쉐이크", desc: "클래식 쉐이크", size: "레귤러", weight: "400ml", price: 6900, cal: "320~420 kcal", serving: "400ml", image: "/products/double-shake.jpg", flavor: false, maxF: 0, sub: "classic-shake", tag: "NEW" },
  { name: "초콜릿&바나나\n더블쉐이크", desc: "클래식 쉐이크", size: "레귤러", weight: "400ml", price: 6900, cal: "340~440 kcal", serving: "400ml", image: "/products/double-shake.jpg", flavor: false, maxF: 0, sub: "classic-shake", tag: "NEW" },
  { name: "클래식 초콜릿 쉐이크", desc: "클래식 쉐이크", size: "레귤러", weight: "400ml", price: 6100, cal: "300~390 kcal", serving: "400ml", image: "/products/smoothie.jpg", flavor: false, maxF: 0, sub: "classic-shake", tag: "NEW" },
  { name: "클래식 딸기 쉐이크", desc: "클래식 쉐이크", size: "레귤러", weight: "400ml", price: 6100, cal: "280~360 kcal", serving: "400ml", image: "/products/strawberry-blast.jpg", flavor: false, maxF: 0, sub: "classic-shake", tag: "NEW" },
  { name: "클래식 바나나 쉐이크", desc: "클래식 쉐이크", size: "레귤러", weight: "400ml", price: 6100, cal: "290~370 kcal", serving: "400ml", image: "/products/smoothie.jpg", flavor: false, maxF: 0, sub: "classic-shake", tag: "NEW" },
  { name: "클래식 바닐라 쉐이크", desc: "클래식 쉐이크", size: "레귤러", weight: "400ml", price: 6100, cal: "270~350 kcal", serving: "400ml", image: "/products/smoothie.jpg", flavor: false, maxF: 0, sub: "classic-shake", tag: "NEW" },
])

// ─── 젤라또 쉐프디저트 (30) ──────────────────────────────
const gelatoProducts = generateProducts("gelato", [
  { name: "피스타치오 젤라또", desc: "프리미엄", size: "싱글", weight: "120g", price: 5500, cal: "180~280 kcal", serving: "120g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "다크초코 젤라또", desc: "프리미엄", size: "싱글", weight: "120g", price: 5500, cal: "200~300 kcal", serving: "120g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "바닐라빈 젤라또", desc: "프리미엄", size: "싱글", weight: "120g", price: 5200, cal: "170~260 kcal", serving: "120g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "딸기 젤라또", desc: "프리미엄", size: "싱글", weight: "120g", price: 5500, cal: "160~240 kcal", serving: "120g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "망고 젤라또", desc: "프리미엄", size: "싱글", weight: "120g", price: 5500, cal: "160~240 kcal", serving: "120g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "헤이즐넛 젤라또", desc: "프리미엄", size: "싱글", weight: "120g", price: 5800, cal: "190~290 kcal", serving: "120g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "레몬 소르베", desc: "소르베", size: "싱글", weight: "120g", price: 5000, cal: "100~160 kcal", serving: "120g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "라즈베리 소르베", desc: "소르베", size: "싱글", weight: "120g", price: 5200, cal: "110~170 kcal", serving: "120g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "아마레나 젤라또", desc: "이탈리안", size: "싱글", weight: "120g", price: 6000, cal: "180~280 kcal", serving: "120g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "티라미수 젤라또", desc: "이탈리안", size: "싱글", weight: "120g", price: 5800, cal: "200~300 kcal", serving: "120g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "크림브륄레", desc: "쉐프 디저트", size: "레귤러", weight: "150g", price: 7500, cal: "250~350 kcal", serving: "150g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "판나코타", desc: "쉐프 디저트", size: "레귤러", weight: "150g", price: 7200, cal: "220~310 kcal", serving: "150g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "초코 퐁당", desc: "쉐프 디저트", size: "레귤러", weight: "180g", price: 8500, cal: "300~420 kcal", serving: "180g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "아포가토 디저트", desc: "쉐프 디저트", size: "레귤러", weight: "200g", price: 8000, cal: "250~350 kcal", serving: "200g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "젤라또 트리오", desc: "3가지 젤라또", size: "트리오", weight: "360g", price: 14500, cal: "480~720 kcal", serving: "360g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "카라멜 젤라또", desc: "프리미엄", size: "싱글", weight: "120g", price: 5500, cal: "190~290 kcal", serving: "120g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "코코넛 젤라또", desc: "프리미엄", size: "싱글", weight: "120g", price: 5500, cal: "180~270 kcal", serving: "120g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "말차 젤라또", desc: "프리미엄", size: "싱글", weight: "120g", price: 5500, cal: "170~260 kcal", serving: "120g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "커피 젤라또", desc: "프리미엄", size: "싱글", weight: "120g", price: 5500, cal: "170~260 kcal", serving: "120g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "블루베리 치즈케이크", desc: "쉐프 디저트", size: "레귤러", weight: "180g", price: 8200, cal: "280~380 kcal", serving: "180g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "더블 젤라또", desc: "더블", size: "더블", weight: "240g", price: 9500, cal: "340~520 kcal", serving: "240g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "젤라또 와플", desc: "와플+젤라또", size: "레귤러", weight: "250g", price: 9800, cal: "380~520 kcal", serving: "250g", image: "/products/waffle.jpg", flavor: false, maxF: 0 },
  { name: "젤라또 크레페", desc: "크레페+젤라또", size: "레귤러", weight: "200g", price: 8800, cal: "320~440 kcal", serving: "200g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "로즈 젤라또", desc: "프리미엄", size: "싱글", weight: "120g", price: 5800, cal: "160~240 kcal", serving: "120g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "솔티카라멜 젤라또", desc: "프리미엄", size: "싱글", weight: "120g", price: 5800, cal: "200~300 kcal", serving: "120g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "베리 소르베", desc: "소르베", size: "싱글", weight: "120g", price: 5200, cal: "100~160 kcal", serving: "120g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "패션프루트 소르베", desc: "소르베", size: "싱글", weight: "120g", price: 5200, cal: "100~160 kcal", serving: "120g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "리코타 젤라또", desc: "이탈리안", size: "싱글", weight: "120g", price: 6000, cal: "190~290 kcal", serving: "120g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "스트라치아텔라", desc: "이탈리안", size: "싱글", weight: "120g", price: 5800, cal: "180~280 kcal", serving: "120g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "젤라또 선물세트", desc: "6종 세트", size: "선물", weight: "720g", price: 28000, cal: "960~1440 kcal", serving: "720g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
])

// ─── 디저트 (30) ──────────────────────────────────────────
const dessertProducts = generateProducts("dessert", [
  { name: "아이스 마카롱 6개", desc: "마카롱 세트", size: "6개", weight: "180g", price: 12000, cal: "600~840 kcal", serving: "180g", image: "/products/macarons.jpg", flavor: false, maxF: 0 },
  { name: "아이스 마카롱 12개", desc: "마카롱 세트", size: "12개", weight: "360g", price: 22000, cal: "1200~1680 kcal", serving: "360g", image: "/products/macarons.jpg", flavor: false, maxF: 0 },
  { name: "아이스 모찌 4개", desc: "모찌 세트", size: "4개", weight: "160g", price: 8500, cal: "400~560 kcal", serving: "160g", image: "/products/mochi.jpg", flavor: false, maxF: 0 },
  { name: "아이스 모찌 8개", desc: "모찌 세트", size: "8개", weight: "320g", price: 15000, cal: "800~1120 kcal", serving: "320g", image: "/products/mochi.jpg", flavor: false, maxF: 0 },
  { name: "벨기에 와플", desc: "와플 세트", size: "1개", weight: "200g", price: 6800, cal: "350~480 kcal", serving: "200g", image: "/products/waffle.jpg", flavor: true, maxF: 2 },
  { name: "와플 아이스크림", desc: "와플+아이스크림", size: "1세트", weight: "300g", price: 8500, cal: "450~620 kcal", serving: "300g", image: "/products/waffle.jpg", flavor: true, maxF: 2 },
  { name: "크로플", desc: "크로플", size: "1개", weight: "180g", price: 5800, cal: "300~420 kcal", serving: "180g", image: "/products/waffle.jpg", flavor: false, maxF: 0 },
  { name: "크로플 세트", desc: "크로플+아이스크림", size: "1세트", weight: "280g", price: 8200, cal: "420~580 kcal", serving: "280g", image: "/products/waffle.jpg", flavor: true, maxF: 1 },
  { name: "초코 브라우니", desc: "브라우니", size: "1개", weight: "120g", price: 4500, cal: "280~380 kcal", serving: "120g", image: "/products/macarons.jpg", flavor: false, maxF: 0 },
  { name: "브라우니 선데이", desc: "브라우니+아이스크림", size: "1세트", weight: "250g", price: 7800, cal: "420~580 kcal", serving: "250g", image: "/products/sundae.jpg", flavor: true, maxF: 1 },
  { name: "마카롱 아이스크림", desc: "아이스크림 마카롱", size: "1개", weight: "60g", price: 3200, cal: "120~170 kcal", serving: "60g", image: "/products/macarons.jpg", flavor: false, maxF: 0 },
  { name: "초코 퐁듀 세트", desc: "퐁듀", size: "2인", weight: "400g", price: 15000, cal: "600~850 kcal", serving: "400g", image: "/products/sundae.jpg", flavor: true, maxF: 3 },
  { name: "팬케이크 세트", desc: "팬케이크+아이스크림", size: "1세트", weight: "300g", price: 8800, cal: "400~560 kcal", serving: "300g", image: "/products/waffle.jpg", flavor: true, maxF: 2 },
  { name: "아이스크림 쿠키", desc: "쿠키 샌드위치", size: "1개", weight: "100g", price: 3800, cal: "180~260 kcal", serving: "100g", image: "/products/macarons.jpg", flavor: true, maxF: 1 },
  { name: "쿠키 샌드위치 4개", desc: "쿠키 세트", size: "4개", weight: "400g", price: 13500, cal: "720~1040 kcal", serving: "400g", image: "/products/macarons.jpg", flavor: true, maxF: 2 },
  { name: "프렌치 토스트", desc: "토스트+아이스크림", size: "1세트", weight: "280g", price: 7500, cal: "380~520 kcal", serving: "280g", image: "/products/waffle.jpg", flavor: true, maxF: 1 },
  { name: "도넛 아이스크림", desc: "도넛", size: "1개", weight: "150g", price: 5200, cal: "280~400 kcal", serving: "150g", image: "/products/macarons.jpg", flavor: true, maxF: 1 },
  { name: "도넛 세트", desc: "도넛 3개", size: "3개", weight: "450g", price: 14000, cal: "840~1200 kcal", serving: "450g", image: "/products/macarons.jpg", flavor: true, maxF: 3 },
  { name: "아이스 슈", desc: "슈크림", size: "2개", weight: "120g", price: 4800, cal: "200~300 kcal", serving: "120g", image: "/products/macarons.jpg", flavor: false, maxF: 0 },
  { name: "에클레어", desc: "아이스 에클레어", size: "1개", weight: "100g", price: 4500, cal: "180~260 kcal", serving: "100g", image: "/products/macarons.jpg", flavor: false, maxF: 0 },
  { name: "밀크레이프", desc: "밀크레이프 케이크", size: "1조각", weight: "150g", price: 6500, cal: "300~420 kcal", serving: "150g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "치즈케이크 바", desc: "바 타입", size: "1개", weight: "120g", price: 5200, cal: "250~350 kcal", serving: "120g", image: "/products/macarons.jpg", flavor: false, maxF: 0 },
  { name: "파르페", desc: "아이스크림 파르페", size: "레귤러", weight: "300g", price: 8500, cal: "380~520 kcal", serving: "300g", image: "/products/sundae.jpg", flavor: true, maxF: 2 },
  { name: "아포가토 세트", desc: "에스프레소+젤라또", size: "1세트", weight: "200g", price: 7200, cal: "220~320 kcal", serving: "200g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "과일 타르트", desc: "과일 타르트", size: "1개", weight: "180g", price: 6800, cal: "280~390 kcal", serving: "180g", image: "/products/macarons.jpg", flavor: false, maxF: 0 },
  { name: "모찌 롤", desc: "롤 타입 모찌", size: "1개", weight: "150g", price: 5500, cal: "250~350 kcal", serving: "150g", image: "/products/mochi.jpg", flavor: false, maxF: 0 },
  { name: "베리 파블로바", desc: "파블로바", size: "1개", weight: "200g", price: 8800, cal: "300~420 kcal", serving: "200g", image: "/products/macarons.jpg", flavor: false, maxF: 0 },
  { name: "크로칸트", desc: "크로칸트 바", size: "1개", weight: "80g", price: 3500, cal: "180~260 kcal", serving: "80g", image: "/products/macarons.jpg", flavor: false, maxF: 0 },
  { name: "까눌레", desc: "아이스 까눌레", size: "2개", weight: "120g", price: 5200, cal: "220~320 kcal", serving: "120g", image: "/products/macarons.jpg", flavor: false, maxF: 0 },
  { name: "디저트 플래터", desc: "모둠 디저트", size: "4인", weight: "600g", price: 22000, cal: "900~1300 kcal", serving: "600g", image: "/products/macarons.jpg", flavor: true, maxF: 3 },
])

// ─── 프리팩 (30) ─────────────��────────────────────────────
const prepackProducts = generateProducts("prepack", [
  { name: "바 초콜릿", desc: "아이스크림 바", size: "1개", weight: "100g", price: 2500, cal: "180~260 kcal", serving: "100g", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "바 딸기", desc: "아이스크림 바", size: "1개", weight: "100g", price: 2500, cal: "170~240 kcal", serving: "100g", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "바 바닐라", desc: "아이스크림 바", size: "1개", weight: "100g", price: 2500, cal: "170~240 kcal", serving: "100g", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "바 민트초코", desc: "아이스크림 바", size: "1개", weight: "100g", price: 2800, cal: "180~260 kcal", serving: "100g", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "바 망고", desc: "아이스크림 바", size: "1개", weight: "100g", price: 2800, cal: "170~240 kcal", serving: "100g", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "미니컵 초코", desc: "미니컵", size: "1개", weight: "100ml", price: 2200, cal: "120~180 kcal", serving: "100ml", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "미니컵 딸기", desc: "미니컵", size: "1개", weight: "100ml", price: 2200, cal: "110~170 kcal", serving: "100ml", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "미니컵 바닐라", desc: "미니컵", size: "1개", weight: "100ml", price: 2200, cal: "110~170 kcal", serving: "100ml", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "미니컵 세트 4개", desc: "미니컵 세트", size: "4개", weight: "400ml", price: 7800, cal: "440~680 kcal", serving: "400ml", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "미니컵 세트 6개", desc: "미니컵 세트", size: "6개", weight: "600ml", price: 11000, cal: "660~1020 kcal", serving: "600ml", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "샌드위치 초코", desc: "아이스 샌드위치", size: "1개", weight: "120g", price: 3200, cal: "200~290 kcal", serving: "120g", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "샌드위치 바닐라", desc: "아이스 샌드위치", size: "1개", weight: "120g", price: 3200, cal: "190~280 kcal", serving: "120g", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "샌드위치 딸기", desc: "아이스 샌드위치", size: "1개", weight: "120g", price: 3200, cal: "190~280 kcal", serving: "120g", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "콘 바닐라", desc: "콘 아이스크림", size: "1개", weight: "130g", price: 2800, cal: "200~290 kcal", serving: "130g", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "콘 초코", desc: "콘 아이스크림", size: "1개", weight: "130g", price: 2800, cal: "210~300 kcal", serving: "130g", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "콘 딸기", desc: "콘 아이스크림", size: "1개", weight: "130g", price: 2800, cal: "200~290 kcal", serving: "130g", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "모나카", desc: "아이스크림 모나카", size: "1개", weight: "100g", price: 2500, cal: "170~240 kcal", serving: "100g", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "모나카 세트 4개", desc: "모나카 세트", size: "4개", weight: "400g", price: 8800, cal: "680~960 kcal", serving: "400g", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "빠삐코", desc: "튜브형", size: "1개", weight: "130ml", price: 1800, cal: "100~150 kcal", serving: "130ml", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "쮸쮸바", desc: "쮸쮸바", size: "1개", weight: "100ml", price: 1500, cal: "60~90 kcal", serving: "100ml", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "바 세트 6개", desc: "바 모음", size: "6개", weight: "600g", price: 13000, cal: "1020~1560 kcal", serving: "600g", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "바 세트 10개", desc: "바 모음", size: "10개", weight: "1000g", price: 20000, cal: "1700~2600 kcal", serving: "1000g", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "프리미엄 바 초코", desc: "프리미엄 바", size: "1개", weight: "120g", price: 3500, cal: "220~320 kcal", serving: "120g", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "프리미엄 바 딸기", desc: "프리미엄 바", size: "1개", weight: "120g", price: 3500, cal: "210~300 kcal", serving: "120g", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "프리미엄 바 그린티", desc: "프리미엄 바", size: "1개", weight: "120g", price: 3500, cal: "200~290 kcal", serving: "120g", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "튜브 딸기", desc: "튜브형", size: "1개", weight: "130ml", price: 1800, cal: "90~140 kcal", serving: "130ml", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "튜브 포도", desc: "튜브형", size: "1개", weight: "130ml", price: 1800, cal: "90~140 kcal", serving: "130ml", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "아이스 떡", desc: "떡 아이스크림", size: "4개", weight: "200g", price: 5500, cal: "300~440 kcal", serving: "200g", image: "/products/mochi.jpg", flavor: false, maxF: 0 },
  { name: "아이스 캔디", desc: "캔디 바", size: "1개", weight: "80ml", price: 1500, cal: "50~80 kcal", serving: "80ml", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
  { name: "종합 선물세트", desc: "프리팩 모음", size: "12개", weight: "1200g", price: 25000, cal: "2000~3000 kcal", serving: "1200g", image: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
])

// ─── 상품 파티용품 (30) ───────────────────────────────────
const partyProducts = generateProducts("party", [
  { name: "생일 초 세트", desc: "숫자 초", size: "1세트", weight: "50g", price: 3500, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "파티 모자 5개", desc: "파티 모자", size: "5개", weight: "100g", price: 5000, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "종이 접시 10개", desc: "파티 접시", size: "10개", weight: "200g", price: 4500, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "종이컵 10개", desc: "파티 컵", size: "10개", weight: "150g", price: 3500, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "냅킨 20장", desc: "파티 냅킨", size: "20장", weight: "100g", price: 2500, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "파티 풍선 10개", desc: "풍선 세트", size: "10개", weight: "50g", price: 5500, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "배너 세트", desc: "축하 배너", size: "1세트", weight: "150g", price: 8000, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "파티 세트 A", desc: "기본 파티 세트", size: "1세트", weight: "500g", price: 15000, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "파티 세트 B", desc: "프리미엄 파티", size: "1세트", weight: "800g", price: 25000, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "파티 세트 C", desc: "디럭스 파티", size: "1세트", weight: "1200g", price: 35000, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "아이스크림 스푼 50개", desc: "스푼 세트", size: "50개", weight: "200g", price: 3000, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "케이크 칼", desc: "케이크 나이프", size: "1개", weight: "100g", price: 2000, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "드라이아이스 추가", desc: "보냉용", size: "1봉", weight: "500g", price: 1500, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "보냉백 S", desc: "보냉백", size: "S", weight: "100g", price: 2000, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "보냉백 M", desc: "보냉백", size: "M", weight: "150g", price: 3000, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "보냉백 L", desc: "보냉백", size: "L", weight: "200g", price: 4000, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "테이블보 세트", desc: "파티 테이블보", size: "1장", weight: "300g", price: 5000, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "가랜드", desc: "장식 가랜드", size: "1세트", weight: "100g", price: 6500, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "콘페티 세트", desc: "파티 콘페티", size: "1봉", weight: "50g", price: 3500, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "포토존 세트", desc: "포토존 소품", size: "1세트", weight: "500g", price: 12000, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "선물 포장 BOX S", desc: "선물 박스", size: "S", weight: "100g", price: 2500, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "선물 포장 BOX M", desc: "선물 박스", size: "M", weight: "200g", price: 4000, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "선물 포장 BOX L", desc: "선물 박스", size: "L", weight: "300g", price: 5500, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "리본 세트", desc: "장식 리본", size: "3개", weight: "30g", price: 2000, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "축하 카드", desc: "메시지 카드", size: "1장", weight: "20g", price: 1500, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "스티커 세트", desc: "데코 스티커", size: "1시트", weight: "10g", price: 2000, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "케이크 토퍼", desc: "��이�� 장식", size: "1개", weight: "30g", price: 3500, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "파티 안경 세트", desc: "재미 안경", size: "5개", weight: "100g", price: 6000, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "파티 호루라기", desc: "호루라기", size: "5개", weight: "50g", price: 3000, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
  { name: "올인원 파티세트", desc: "완전 파티 세트", size: "1세트", weight: "2000g", price: 45000, cal: "-", serving: "-", image: "/products/party-set.jpg", flavor: false, maxF: 0 },
])

// ─── Combine all products ─────────────────────────────────
export const products: Product[] = [
  ...eventProducts,
  ...workshopProducts,
  ...coneCupProducts,
  ...packableProducts,
  ...cakeProducts,
  ...bingsuProducts,
  ...coffeeProducts,
  ...beverageProducts,
  ...gelatoProducts,
  ...dessertProducts,
  ...prepackProducts,
  ...partyProducts,
]

// ─── Flavor Categories ───────────────────────────────────
export const flavorCategories: FlavorCategory[] = [
  { id: "all", name: "전체" },
  { id: "recommended", name: "추천" },
  { id: "fruit", name: "과일" },
  { id: "chocolate", name: "초콜릿" },
  { id: "milk-cheese", name: "우유/치즈/과자" },
  { id: "coffee-caramel", name: "커피/카라멜/티" },
  { id: "vanilla-mint", name: "바닐라/민트" },
  { id: "grain-nut", name: "곡물/견과류" },
]

// ─── Flavors (100) ── Based on actual BR Korea in-store menu ─
export const flavors: Flavor[] = [
  // ── 추천 (12) ── Matches page 1 from kiosk photos exactly
  { id: "jjonkkuret", name: "진정한 쫀꾸렛", image: "/flavors/jjonkkuret.jpg", color: "hsl(30,40%,75%)", categoryId: "recommended", description: "쫀득한 초콜릿과 바삭한 크런치의 진정한 만남", badge: "이달의 맛" },
  { id: "alien-mom", name: "엄마는 외계인", image: "/flavors/alien-mom.jpg", color: "hsl(280,50%,75%)", categoryId: "recommended", description: "알록달록 솜사탕과 쿠키의 신비로운 우주 맛", badge: "1위" },
  { id: "almond-bonbon", name: "아몬드 봉봉", image: "/flavors/almond.jpg", color: "hsl(25,35%,72%)", categoryId: "recommended", description: "고소한 아몬드와 달콤한 봉봉의 만남", badge: "2위" },
  { id: "mint-choco-chip", name: "민트 초콜릿 칩", image: "/flavors/mint-choco.jpg", color: "hsl(160,50%,75%)", categoryId: "recommended", description: "시원한 민트와 달콤한 초코칩의 조화", badge: "3위" },
  { id: "rainbow-sherbet", name: "레인보우 샤베트", image: "/flavors/rainbow.jpg", color: "hsl(40,80%,80%)", categoryId: "recommended", description: "다채로운 과일 맛의 상큼한 샤베트 (과일 섬유질 포함)", badge: "과일 섬유질 포함" },
  { id: "ny-cheesecake", name: "뉴욕 치즈케이크", image: "/flavors/cheesecake.jpg", color: "hsl(45,50%,82%)", categoryId: "recommended", description: "진한 뉴욕 스타일 치즈케이크의 깊은 맛", badge: "5위" },
  { id: "jjonddeok-heukimja", name: "쫀떡 만난 흑임자", image: "/flavors/heukimja-jjonddeok.jpg", color: "hsl(0,0%,35%)", categoryId: "recommended", description: "고소한 흑임자와 쫄깃한 쫀떡의 전통 조화", badge: "NEW" },
  { id: "ice-hotteok", name: "아이스 호떡", image: "/flavors/ice-hotteok.jpg", color: "hsl(35,55%,60%)", categoryId: "recommended", description: "달콤한 호떡의 따뜻한 맛을 아이스크림으로", badge: "NEW" },
  { id: "bam-goguma", name: "밤이 옥수로 맛있구마", image: "/flavors/sweet-potato.jpg", color: "hsl(35,60%,55%)", categoryId: "recommended", description: "고구마, 밤, 옥수수의 고소한 가을 맛", badge: "NEW" },
  { id: "honey-mochi", name: "말랑 꿀떡 모찌", image: "/flavors/honey-mochi.jpg", color: "hsl(42,50%,78%)", categoryId: "recommended", description: "꿀떡 모찌의 말랑말랑 달콤한 맛", badge: "NEW" },
  { id: "cream-cheese-peach-tart", name: "크림치즈 피치 타르트", image: "/flavors/peach-tart.jpg", color: "hsl(20,60%,80%)", categoryId: "recommended", description: "크림치즈와 복숭아 타르트의 상큼한 조화", badge: null },
  { id: "berry-berry-strawberry", name: "베리베리 스트로베리", image: "/flavors/strawberry.jpg", color: "hsl(340,60%,78%)", categoryId: "recommended", description: "딸기의 상큼함을 가득 담은 베리 맛", badge: null },

  // ── Page 2 flavors from photos (also categorized) ──
  { id: "love-strawberry", name: "사랑에 빠진 딸기", image: "/flavors/love-strawberry.jpg", color: "hsl(345,60%,75%)", categoryId: "fruit", description: "딸기와 초콜릿이 치즈케이크에 반해버린 사랑의 맛", badge: null },
  { id: "wonderland-cotton", name: "이상한 나라의 솜사탕", image: "/flavors/cotton-candy.jpg", color: "hsl(300,50%,80%)", categoryId: "fruit", description: "동화 속 솜사탕처럼 달콤하고 몽환적인 맛", badge: null },
  { id: "pistachio-almond", name: "피스타치오 아몬드", image: "/flavors/pistachio.jpg", color: "hsl(90,30%,65%)", categoryId: "grain-nut", description: "고소한 피스타치오와 아몬드의 풍미", badge: null },
  { id: "31-yogurt", name: "31 요거트", image: "/flavors/yogurt.jpg", color: "hsl(50,20%,92%)", categoryId: "milk-cheese", description: "상큼하고 부드러운 31 요거트", badge: null },
  { id: "green-tea", name: "그린티", image: "/flavors/green-tea.jpg", color: "hsl(120,40%,70%)", categoryId: "vanilla-mint", description: "진한 녹차의 깊은 풍미", badge: null },
  { id: "choco-mousse", name: "초콜릿 무스", image: "/flavors/choco-mousse.jpg", color: "hsl(15,40%,25%)", categoryId: "chocolate", description: "부드럽고 진한 초콜릿 무스의 맛", badge: null },
  { id: "vanilla", name: "바닐라", image: "/flavors/vanilla.jpg", color: "hsl(50,60%,90%)", categoryId: "vanilla-mint", description: "클래식 바닐라의 부드러운 맛", badge: null },
  { id: "cherry-jubilee", name: "체리쥬빌레", image: "/flavors/cherry-jubilee.jpg", color: "hsl(340,50%,70%)", categoryId: "fruit", description: "달콤한 체리의 풍성한 맛", badge: null },
  { id: "oreo-cookies-cream", name: "오레오 쿠키 앤 크림", image: "/flavors/oreo.jpg", color: "hsl(0,0%,50%)", categoryId: "milk-cheese", description: "바삭한 오레오 쿠키와 부드러운 크림의 조화", badge: null },
  { id: "jamoca-almond-fudge", name: "자모카 아몬드 휘지", image: "/flavors/jamoca-fudge.jpg", color: "hsl(20,40%,40%)", categoryId: "coffee-caramel", description: "커피 아이스크림에 아몬드와 초콜릿 퍼지의 조화", badge: null },
  { id: "wind-away", name: "바람과 함께 사라지다", image: "/flavors/swirl.jpg", color: "hsl(270,50%,80%)", categoryId: "fruit", description: "부드럽게 사라지는 솜사탕의 달콤함", badge: null },
  { id: "chocolate", name: "초콜릿", image: "/flavors/chocolate.jpg", color: "hsl(20,50%,40%)", categoryId: "chocolate", description: "진하고 부드러운 클래식 초콜릿의 맛", badge: null },

  // ── 추가 과일 flavors ──
  { id: "mango-tango", name: "망고 탱고", image: "/flavors/mango.jpg", color: "hsl(35,80%,75%)", categoryId: "fruit", description: "열대 망고의 상큼한 맛", badge: null },
  { id: "peach-yogurt", name: "피치 요거트", image: "/flavors/peach-tart.jpg", color: "hsl(20,70%,82%)", categoryId: "fruit", description: "복숭아와 요거트의 상큼한 조화", badge: null },
  { id: "grape-sorbet", name: "포도 소르베", image: "/flavors/swirl.jpg", color: "hsl(280,50%,55%)", categoryId: "fruit", description: "달콤한 포도의 시원한 소르베", badge: null },
  { id: "lemon-sorbet", name: "레몬 소르베", image: "/flavors/vanilla.jpg", color: "hsl(55,80%,80%)", categoryId: "fruit", description: "새콤달콤한 레몬의 청량함", badge: null },
  { id: "blueberry-cheesecake", name: "블루베리 치즈케이크", image: "/flavors/swirl.jpg", color: "hsl(240,40%,60%)", categoryId: "fruit", description: "블루베리와 치즈케이크의 진한 맛", badge: null },
  { id: "passion-fruit", name: "패션후르츠", image: "/flavors/mango.jpg", color: "hsl(45,80%,70%)", categoryId: "fruit", description: "이국적인 패션후르츠의 상큼함", badge: null },
  { id: "watermelon-sorbet", name: "수박 소르베", image: "/flavors/strawberry.jpg", color: "hsl(0,60%,65%)", categoryId: "fruit", description: "시원한 수박의 여름 소르베", badge: null },
  { id: "kiwi-lime", name: "키위 라임", image: "/flavors/green-tea.jpg", color: "hsl(100,50%,60%)", categoryId: "fruit", description: "키위와 라임의 상큼한 맛", badge: null },
  { id: "melon-cream", name: "메론 크림", image: "/flavors/green-tea.jpg", color: "hsl(130,40%,75%)", categoryId: "fruit", description: "달콤한 메론과 부드러운 크림", badge: null },

  // ── 추가 초콜릿 flavors ──
  { id: "dark-chocolate", name: "다크 초콜릿", image: "/flavors/chocolate.jpg", color: "hsl(15,40%,30%)", categoryId: "chocolate", description: "깊고 진한 다크 초콜릿의 풍미", badge: null },
  { id: "choco-brownie", name: "초코 브라우니", image: "/flavors/chocolate.jpg", color: "hsl(20,45%,38%)", categoryId: "chocolate", description: "촉촉한 브라우니와 초콜릿의 만남", badge: null },
  { id: "white-choco", name: "화이트 초콜릿", image: "/flavors/vanilla.jpg", color: "hsl(40,30%,88%)", categoryId: "chocolate", description: "달콤한 화이트 초콜릿의 부드러움", badge: null },
  { id: "choco-mint-fudge", name: "초코 민트 퍼지", image: "/flavors/mint-choco.jpg", color: "hsl(150,35%,55%)", categoryId: "chocolate", description: "민트와 초콜릿 퍼지의 시원한 만남", badge: null },
  { id: "rocky-road", name: "로키 로드", image: "/flavors/chocolate.jpg", color: "hsl(15,30%,40%)", categoryId: "chocolate", description: "초콜릿, 마시멜로, 견과류의 조합", badge: null },
  { id: "choco-banana", name: "초코 바나나", image: "/flavors/caramel.jpg", color: "hsl(45,50%,55%)", categoryId: "chocolate", description: "바나나와 초콜릿의 클래식 조합", badge: null },
  { id: "triple-choco", name: "트리플 초콜릿", image: "/flavors/chocolate.jpg", color: "hsl(12,40%,32%)", categoryId: "chocolate", description: "세 가지 초콜릿의 진한 맛", badge: null },
  { id: "choco-strawberry", name: "초코 스트로베리", image: "/flavors/berry.jpg", color: "hsl(340,50%,60%)", categoryId: "chocolate", description: "딸기와 초콜릿의 달콤한 조합", badge: null },
  { id: "choco-caramel", name: "초코 ���라멜", image: "/flavors/caramel.jpg", color: "hsl(25,55%,45%)", categoryId: "chocolate", description: "카라멜과 초콜릿의 달콤 쌉쌀한 맛", badge: null },
  { id: "hazelnut-choco", name: "헤이즐넛 초콜릿", image: "/flavors/almond.jpg", color: "hsl(25,40%,50%)", categoryId: "chocolate", description: "헤이즐넛과 초콜릿의 고소한 맛", badge: null },
  { id: "choco-cookie-dough", name: "초코 쿠키도우", image: "/flavors/cookies-cream.jpg", color: "hsl(20,35%,55%)", categoryId: "chocolate", description: "쿠키 도우와 초콜릿의 달콤한 만남", badge: null },

  // ── 추가 우유/치즈/과자 flavors ──
  { id: "cookie-dough", name: "쿠키도우", image: "/flavors/cookies-cream.jpg", color: "hsl(30,40%,70%)", categoryId: "milk-cheese", description: "달콤한 쿠키 반죽의 맛", badge: null },
  { id: "cream-cheese", name: "크림치즈", image: "/flavors/cheesecake.jpg", color: "hsl(45,40%,90%)", categoryId: "milk-cheese", description: "부드러운 크림치즈의 풍미", badge: null },
  { id: "butter-cookie", name: "버터쿠키", image: "/flavors/caramel.jpg", color: "hsl(40,50%,75%)", categoryId: "milk-cheese", description: "고소한 버터쿠키의 맛", badge: null },
  { id: "milk-tea-flavor", name: "밀크티", image: "/flavors/caramel.jpg", color: "hsl(25,30%,70%)", categoryId: "milk-cheese", description: "부드러운 밀크티의 향긋함", badge: null },
  { id: "condensed-milk", name: "연유", image: "/flavors/vanilla.jpg", color: "hsl(45,50%,85%)", categoryId: "milk-cheese", description: "달콤한 연유의 진한 맛", badge: null },
  { id: "corn-cereal", name: "콘 시리얼", image: "/flavors/caramel.jpg", color: "hsl(45,60%,72%)", categoryId: "milk-cheese", description: "바삭한 콘 시리얼의 고소한 맛", badge: null },
  { id: "tiramisu-cheese", name: "티라미수 치즈", image: "/flavors/coffee.jpg", color: "hsl(25,35%,60%)", categoryId: "milk-cheese", description: "티라미수와 치즈의 진한 풍미", badge: null },
  { id: "waffle-cone-crunch", name: "와플콘 크런치", image: "/flavors/almond.jpg", color: "hsl(35,45%,65%)", categoryId: "milk-cheese", description: "바삭한 와플콘의 달콤한 맛", badge: null },
  { id: "shooting-star", name: "슈팅스타", image: "/flavors/rainbow.jpg", color: "hsl(220,60%,80%)", categoryId: "milk-cheese", description: "반짝이는 캔디 조각의 달콤한 맛", badge: null },

  // ── 추가 커피/카라멜/티 flavors ──
  { id: "espresso-crunch", name: "에스프레소 크런치", image: "/flavors/coffee.jpg", color: "hsl(25,40%,35%)", categoryId: "coffee-caramel", description: "진한 에스프레소와 크런치의 조화", badge: null },
  { id: "salted-caramel", name: "솔티드 카라멜", image: "/flavors/caramel.jpg", color: "hsl(30,55%,55%)", categoryId: "coffee-caramel", description: "달콤 짭조름한 솔티드 카라멜", badge: null },
  { id: "cafe-mocha", name: "카페 모카", image: "/flavors/coffee.jpg", color: "hsl(20,40%,40%)", categoryId: "coffee-caramel", description: "커피와 초콜릿의 진한 모카", badge: null },
  { id: "earl-grey", name: "얼그레이", image: "/flavors/caramel.jpg", color: "hsl(30,25%,60%)", categoryId: "coffee-caramel", description: "향긋한 얼그레이 티의 풍미", badge: null },
  { id: "caramel-macchiato", name: "카라멜 마끼아또", image: "/flavors/caramel.jpg", color: "hsl(28,50%,50%)", categoryId: "coffee-caramel", description: "달콤한 카라멜과 커피의 만남", badge: null },
  { id: "cold-brew", name: "콜드브루", image: "/flavors/coffee.jpg", color: "hsl(20,30%,30%)", categoryId: "coffee-caramel", description: "차갑게 추출한 진한 커피의 맛", badge: null },
  { id: "butterscotch", name: "버터스카치", image: "/flavors/caramel.jpg", color: "hsl(35,55%,60%)", categoryId: "coffee-caramel", description: "달콤한 버터스카치의 풍미", badge: null },
  { id: "chai-latte", name: "차이 라떼", image: "/flavors/caramel.jpg", color: "hsl(25,35%,55%)", categoryId: "coffee-caramel", description: "향신료와 밀크의 따뜻한 맛", badge: null },
  { id: "matcha-latte", name: "말차 라떼", image: "/flavors/green-tea.jpg", color: "hsl(110,35%,60%)", categoryId: "coffee-caramel", description: "진한 말차와 부드러운 라떼", badge: null },
  { id: "toffee-nut", name: "토피넛", image: "/flavors/almond.jpg", color: "hsl(30,45%,50%)", categoryId: "coffee-caramel", description: "고소한 토피넛의 달콤한 맛", badge: null },
  { id: "dulce-de-leche", name: "둘세 데 레체", image: "/flavors/caramel.jpg", color: "hsl(28,50%,48%)", categoryId: "coffee-caramel", description: "진한 카라멜 우유의 달콤함", badge: null },

  // ── 추가 바닐라/민트 flavors ──
  { id: "french-vanilla", name: "프렌치 바닐라", image: "/flavors/vanilla.jpg", color: "hsl(45,55%,85%)", categoryId: "vanilla-mint", description: "프리미엄 프렌치 바닐라의 풍미", badge: null },
  { id: "vanilla-caramel", name: "바닐라 카라멜", image: "/flavors/caramel.jpg", color: "hsl(40,55%,78%)", categoryId: "vanilla-mint", description: "바닐라와 카라멜의 달콤한 조화", badge: null },
  { id: "mint-chocolate", name: "민트 초콜릿", image: "/flavors/mint-choco.jpg", color: "hsl(160,50%,70%)", categoryId: "vanilla-mint", description: "시원한 민트와 진한 초콜릿", badge: null },
  { id: "peppermint", name: "페퍼민트", image: "/flavors/mint-choco.jpg", color: "hsl(170,55%,78%)", categoryId: "vanilla-mint", description: "시원하고 상쾌한 페퍼민트", badge: null },
  { id: "vanilla-bean", name: "바닐라 빈", image: "/flavors/vanilla.jpg", color: "hsl(48,55%,88%)", categoryId: "vanilla-mint", description: "바닐라 빈의 진한 풍미", badge: null },
  { id: "mint-oreo", name: "민트 오레오", image: "/flavors/mint-choco.jpg", color: "hsl(155,45%,65%)", categoryId: "vanilla-mint", description: "민트와 오레오의 시원한 조합", badge: null },
  { id: "spearmint", name: "스피어민트", image: "/flavors/mint-choco.jpg", color: "hsl(145,50%,72%)", categoryId: "vanilla-mint", description: "부드러운 스피어민트의 상쾌함", badge: null },
  { id: "vanilla-choco-swirl", name: "바닐라 초코 스월", image: "/flavors/swirl.jpg", color: "hsl(40,40%,75%)", categoryId: "vanilla-mint", description: "바닐라와 초콜릿의 마블링", badge: null },
  { id: "honey-vanilla", name: "허니 바닐라", image: "/flavors/vanilla.jpg", color: "hsl(42,60%,82%)", categoryId: "vanilla-mint", description: "꿀과 바닐라의 달콤한 조화", badge: null },
  { id: "cool-lime-mint", name: "쿨 라임 민트", image: "/flavors/mint-choco.jpg", color: "hsl(140,55%,70%)", categoryId: "vanilla-mint", description: "라임과 민트의 청량한 맛", badge: null },

  // ── 추가 곡물/견과류 flavors ──
  { id: "almond-fudge", name: "아몬드 퍼지", image: "/flavors/almond.jpg", color: "hsl(25,40%,55%)", categoryId: "grain-nut", description: "고소한 아몬드와 달콤한 퍼지", badge: null },
  { id: "peanut-butter", name: "피넛버터", image: "/flavors/almond.jpg", color: "hsl(30,50%,55%)", categoryId: "grain-nut", description: "고소한 피넛버터의 진한 맛", badge: null },
  { id: "walnut-brownie", name: "호두 브라우니", image: "/flavors/chocolate.jpg", color: "hsl(20,35%,45%)", categoryId: "grain-nut", description: "호두와 브라우니의 풍성한 맛", badge: null },
  { id: "cashew-praline", name: "캐슈넛 프랄린", image: "/flavors/caramel.jpg", color: "hsl(30,45%,58%)", categoryId: "grain-nut", description: "캐슈넛과 프랄린의 고소한 달콤함", badge: null },
  { id: "rice-cake", name: "인절미", image: "/flavors/cheesecake.jpg", color: "hsl(40,35%,75%)", categoryId: "grain-nut", description: "고소한 인절미의 전통 맛", badge: null },
  { id: "black-sesame", name: "흑임자", image: "/flavors/heukimja-jjonddeok.jpg", color: "hsl(0,0%,30%)", categoryId: "grain-nut", description: "고소한 흑임자의 깊은 맛", badge: null },
  { id: "sweet-potato-classic", name: "고구마", image: "/flavors/sweet-potato.jpg", color: "hsl(35,60%,55%)", categoryId: "grain-nut", description: "달콤한 고구마의 구수한 맛", badge: null },
  { id: "red-bean", name: "팥", image: "/flavors/berry.jpg", color: "hsl(350,30%,40%)", categoryId: "grain-nut", description: "달콤한 팥의 전통 맛", badge: null },
  { id: "macadamia-nut", name: "마카다미아 넛", image: "/flavors/almond.jpg", color: "hsl(35,35%,68%)", categoryId: "grain-nut", description: "부드러운 마카다미아의 고소함", badge: null },
  { id: "hazelnut-praline", name: "헤이즐넛 프랄린", image: "/flavors/almond.jpg", color: "hsl(28,42%,52%)", categoryId: "grain-nut", description: "헤이즐넛과 프랄린의 조화", badge: null },
  { id: "misutgaru", name: "미숫가루", image: "/flavors/cheesecake.jpg", color: "hsl(40,30%,70%)", categoryId: "grain-nut", description: "고소한 미숫가루의 전통 맛", badge: null },
  { id: "coconut", name: "코코넛", image: "/flavors/vanilla.jpg", color: "hsl(50,30%,90%)", categoryId: "grain-nut", description: "열대 코코넛의 달콤한 맛", badge: null },
]

export function getFlavorsByCategory(categoryId: string): Flavor[] {
  if (categoryId === "all") return flavors
  return flavors.filter((f) => f.categoryId === categoryId)
}

// ─── Option Groups ────────────────────────────────────────
export const optionGroups: OptionGroup[] = [
  {
    id: "spoon",
    name: "스푼",
    type: "single",
    options: [
      { id: "no-spoon", name: "필요 없음", priceAdd: 0, hasQuantity: false },
      { id: "spoon-normal", name: "스푼", priceAdd: 0, hasQuantity: true, defaultQty: 1, unit: "개" },
      { id: "spoon-extra", name: "스푼추가", priceAdd: 50, hasQuantity: true, defaultQty: 1, unit: "개" },
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
