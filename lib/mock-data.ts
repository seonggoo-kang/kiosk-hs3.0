// ─── Types ────────────────────────────────────────────────
export type Category = { id: string; name: string }

export type ProductTag = "Chef Made" | "먹고가기 전용" | "20% 할인" | "이달의 더블주니어" | "NEW" | "세트포장" | "먹고가기" | "가져가기 전용"

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
  requiredOptions: RequiredOptionDef[]
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

// ─── Required Option Groups (scalable per-product options) ─
export type RequiredOptionDef = {
  groupId: string
  label: string
}

export type RequiredOptionGroup = {
  id: string
  name: string
  options: { id: string; name: string; priceAdd: number }[]
}

export const requiredOptionGroups: RequiredOptionGroup[] = [
  {
    id: "serving-type",
    name: "콘/컵 선택",
    options: [
      { id: "cone", name: "콘", priceAdd: 0 },
      { id: "cup", name: "컵", priceAdd: 0 },
      { id: "dish", name: "디쉬", priceAdd: 0 },
    ],
  },
  {
    id: "temperature",
    name: "온도 선택",
    options: [
      { id: "ice", name: "아이스", priceAdd: 0 },
      { id: "hot", name: "핫", priceAdd: 0 },
    ],
  },
]

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
  { id: "ai-pick", name: "추천 메뉴" },
  { id: "bingsu", name: "빙수" },
  { id: "workshop", name: "스폐셜\n디저트" },
  { id: "cone-cup", name: "콘/컵" },
  { id: "packable-icecream", name: "포장가능\n아이스크림" },
  { id: "icecream-cake", name: "아이스크림\n케이크" },
  { id: "coffee", name: "커피" },
  { id: "beverage", name: "음료\n블라스트" },
  { id: "gelato", name: "젤라또" },
  { id: "dessert", name: "디저트" },
  { id: "prepack", name: "레디팩\n블록팩" },
  { id: "party", name: "파티상품" },
]

// ─── Helper to generate product arrays ────────────────────
function generateProducts(
  categoryId: string,
  items: Array<{
    name: string; desc: string; size: string; weight: string;
    price: number; cal: string; serving: string; image: string;
    flavor: boolean; maxF: number; tag?: ProductTag | null; sub?: string | null;
    reqOpts?: RequiredOptionDef[];
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
    requiredOptions: item.reqOpts ?? [],
  }))
}

// ─── 빙수 (8) ──────────────────────────────────────────
const bingsuProducts = generateProducts("bingsu", [
  { name: "더듬뿍 설향딸기 빙수", desc: "딸기 빙수", size: "1인분", weight: "500g", price: 13900, cal: "400~600 kcal", serving: "500g", image: "/products/빙수/더듬뿍설향딸기빙수_0.png", flavor: false, maxF: 0 },
  { name: "더듬뿍 설향딸기\n컵빙수", desc: "딸기 컵빙수", size: "1인분", weight: "350g", price: 8900, cal: "280~420 kcal", serving: "350g", image: "/products/빙수/더듬뿍설향딸기컵빙수_0.png", flavor: false, maxF: 0 },
  { name: "더듬뿍 칸탈로프\n멜론 빙수", desc: "멜론 빙수", size: "1인분", weight: "500g", price: 13900, cal: "380~580 kcal", serving: "500g", image: "/products/빙수/더듬뿍칸탈로프멜론빙수_0.png", flavor: false, maxF: 0 },
  { name: "더듬뿍 칸탈로프\n멜론 컵빙수", desc: "멜론 컵빙수", size: "1인분", weight: "350g", price: 8900, cal: "260~400 kcal", serving: "350g", image: "/products/빙수/더듬뿍칸탈로프멜론컵빙수_0.png", flavor: false, maxF: 0 },
  { name: "더듬뿍 팥빙수", desc: "팥빙수", size: "1인분", weight: "500g", price: 11900, cal: "350~550 kcal", serving: "500g", image: "/products/빙수/더듬뿍팥빙수_0.png", flavor: false, maxF: 0 },
  { name: "더듬뿍 팥 컵빙수", desc: "팥 컵빙수", size: "1인분", weight: "350g", price: 7900, cal: "250~400 kcal", serving: "350g", image: "/products/빙수/더듬뿍팥컵빙수_0.png", flavor: false, maxF: 0 },
  { name: "솔티크림 망고 빙수", desc: "망고 빙수", size: "1인분", weight: "500g", price: 13900, cal: "400~600 kcal", serving: "500g", image: "/products/빙수/솔티크림망고빙수_0.png", flavor: false, maxF: 0 },
  { name: "쌀튀밥 팥빙수", desc: "쌀튀밥 팥빙수", size: "1인분", weight: "500g", price: 12900, cal: "380~580 kcal", serving: "500g", image: "/products/빙수/쌀튀밥팥빙수_0.png", flavor: false, maxF: 0 },
])

// ─── 스폐셜 디저트 (41) ── Actual BR special dessert menu ────────
const workshopProducts = generateProducts("workshop", [
  // Chef Made - 모찌 & 마카롱
  { name: "도곡 모찌\n바람과 함께 사라지다", desc: "Chef Made 모찌", size: "1개", weight: "60g", price: 3800, cal: "120~180 kcal", serving: "60g", image: "/products/스폐셜 디저트/도곡모찌바람과함께사라지다_0.png", flavor: false, maxF: 0, tag: "Chef Made" },
  { name: "도곡 모찌\n엄마는 외계인", desc: "Chef Made 모찌", size: "1개", weight: "60g", price: 3800, cal: "120~180 kcal", serving: "60g", image: "/products/스폐셜 디저트/도곡모찌엄마는외계인_0.png", flavor: false, maxF: 0, tag: "Chef Made" },
  { name: "도곡 모찌 선물세트", desc: "Chef Made 모찌 세트", size: "1세트", weight: "360g", price: 19800, cal: "720~1080 kcal", serving: "360g", image: "/products/스폐셜 디저트/도곡모찌선물세트_0.png", flavor: false, maxF: 0, tag: "Chef Made" },
  { name: "마카롱\n피스타치오 아몬드", desc: "Chef Made 마카롱", size: "1개", weight: "50g", price: 4000, cal: "150~200 kcal", serving: "50g", image: "/products/스폐셜 디저트/도곡마카롱피스타치오아몬드_0.png", flavor: false, maxF: 0, tag: "Chef Made" },
  { name: "마카롱\n베리베리 스트로베리", desc: "Chef Made 마카롱", size: "1개", weight: "50g", price: 4000, cal: "150~200 kcal", serving: "50g", image: "/products/스폐셜 디저트/도곡마카롱베리베리스트로베리_0.png", flavor: false, maxF: 0, tag: "Chef Made" },
  { name: "마카롱\n초콜릿 무스", desc: "Chef Made 마카롱", size: "1개", weight: "50g", price: 4000, cal: "150~200 kcal", serving: "50g", image: "/products/스폐셜 디저트/도곡마카롱초콜릿무스_0.png", flavor: false, maxF: 0, tag: "Chef Made" },
  { name: "마카롱\n체리 쥬빌레", desc: "Chef Made 마카롱", size: "1개", weight: "50g", price: 4000, cal: "150~200 kcal", serving: "50g", image: "/products/스폐셜 디저트/도곡마카롱체리쥬빌레_0.png", flavor: false, maxF: 0, tag: "Chef Made" },
  { name: "마카롱\n자모카 아몬드 훠지", desc: "Chef Made 마카롱", size: "1개", weight: "50g", price: 4000, cal: "150~200 kcal", serving: "50g", image: "/products/스폐셜 디저트/도곡마카롱자모카아몬드훠지_0.png", flavor: false, maxF: 0, tag: "Chef Made" },
  { name: "도곡 마카롱 선물세트", desc: "Chef Made 마카롱 세트", size: "1세트", weight: "300g", price: 22000, cal: "900~1200 kcal", serving: "300g", image: "/products/스폐셜 디저트/도곡마카롱선물세트_0.png", flavor: false, maxF: 0, tag: "Chef Made" },
  // Snack / Bakery
  { name: "머핀", desc: "머핀", size: "1개", weight: "100g", price: 3000, cal: "250~320 kcal", serving: "100g", image: "/products/스폐셜 디저트/(워크샵)머핀_0.png", flavor: false, maxF: 0 },
  { name: "머핀 커피 세트", desc: "머핀 + 커피 세트", size: "세트", weight: "200g", price: 5900, cal: "500~640 kcal", serving: "200g", image: "/products/스폐셜 디저트/머핀커피SET_0.png", flavor: false, maxF: 0, tag: "20% 할인" },
  // Popcorn
  { name: "초코 카라멜 팝콘", desc: "달콤한 초코 카라멜", size: "1봉", weight: "80g", price: 4200, cal: "300~400 kcal", serving: "80g", image: "/products/스폐셜 디저트/초코카라멜팝콘_0.png", flavor: false, maxF: 0 },
  { name: "시나몬 카라멜 팝콘", desc: "시나몬 향 카라멜", size: "1봉", weight: "80g", price: 4200, cal: "300~400 kcal", serving: "80g", image: "/products/스폐셜 디저트/시나몬카라멜팝콘_0.png", flavor: false, maxF: 0 },
  { name: "스윗 카라멜 팝콘", desc: "클래식 카라멜", size: "1봉", weight: "80g", price: 4200, cal: "300~400 kcal", serving: "80g", image: "/products/스폐셜 디저트/스윗카라멜팝콘_0.png", flavor: false, maxF: 0 },
  // Affogato (위스키)
  { name: "위스키 아포가토\n바닐라", desc: "위스키 아포가토", size: "1잔", weight: "250ml", price: 9500, cal: "350~450 kcal", serving: "250ml", image: "/products/스폐셜 디저트/위스키아포가토바닐라_0.png", flavor: false, maxF: 0, tag: "먹고가기 전용" },
  { name: "위스키 아포가토\n크렘드 마롱", desc: "위스키 아포가토", size: "1잔", weight: "250ml", price: 9500, cal: "380~480 kcal", serving: "250ml", image: "/products/스폐셜 디저트/위스키아포가토크렘드마롱_0.png", flavor: false, maxF: 0, tag: "먹고가기 전용" },
  { name: "위스키 아포가토\n브라우니 쥬빌레", desc: "위스키 아포가토", size: "1잔", weight: "250ml", price: 9500, cal: "400~500 kcal", serving: "250ml", image: "/products/스폐셜 디저트/위스키아포가토브라우니쥬빌레_0.png", flavor: false, maxF: 0, tag: "먹고가기 전용" },
  { name: "위스키 샘플러 싱글", desc: "위스키 샘플러", size: "1잔", weight: "150ml", price: 7500, cal: "200~300 kcal", serving: "150ml", image: "/products/스폐셜 디저트/위스키샘플러싱글_0.png", flavor: false, maxF: 0, tag: "먹고가기 전용" },
  // Gift Set / Nuts
  { name: "카라멜 로스티드넛츠\n선물세트", desc: "선물세트", size: "1세트", weight: "360g", price: 16600, cal: "840~1050 kcal", serving: "360g", image: "/products/스폐셜 디저트/카라멜로스티드넛츠선물세트_0.png", flavor: false, maxF: 0 },
  { name: "카라멜 로스티드넛츠\n피칸 마카다미아", desc: "넛츠", size: "1봉", weight: "120g", price: 5200, cal: "280~350 kcal", serving: "120g", image: "/products/스폐셜 디저트/카라멜로스티드넛츠피칸마카다미아_0.png", flavor: false, maxF: 0, tag: "Chef Made" },
  { name: "카라멜 로스티드넛츠\n피칸 아몬드", desc: "넛츠", size: "1봉", weight: "120g", price: 5200, cal: "280~350 kcal", serving: "120g", image: "/products/스폐셜 디저트/카라멜로스티드넛츠피칸아몬드_0.png", flavor: false, maxF: 0, tag: "Chef Made" },
  // Ice Cream Sets
  { name: "버라이어티팩", desc: "싱글레귤러 팩", size: "팩", weight: "480g", price: 15600, cal: "600~1120 kcal", serving: "480g", image: "/products/스폐셜 디저트/워크샵버라이어티팩_0.png", flavor: true, maxF: 4 },
  { name: "아빠왔다팩", desc: "싱글레귤러 팩", size: "팩", weight: "480g", price: 15600, cal: "600~1120 kcal", serving: "480g", image: "/products/스폐셜 디저트/워크샵아빠왔다팩_0.png", flavor: true, maxF: 4 },
  { name: "옹기종기팩", desc: "싱글레귤러 팩", size: "팩", weight: "960g", price: 31200, cal: "1200~2240 kcal", serving: "960g", image: "/products/스폐셜 디저트/워크샵옹기종기팩_0.png", flavor: true, maxF: 8 },
  { name: "에디션 샘플러", desc: "에디션 샘플러", size: "1세트", weight: "300g", price: 14500, cal: "450~700 kcal", serving: "300g", image: "/products/스폐셜 디저트/워크샵에디션샘플러_0.png", flavor: false, maxF: 0 },
  { name: "레슬리 샘플러", desc: "레슬리 샘플러", size: "1세트", weight: "300g", price: 14500, cal: "450~700 kcal", serving: "300g", image: "/products/스폐셜 디저트/레슬리샘플러_수정_0.png", flavor: false, maxF: 0 },
  // Affogato (일반)
  { name: "카페 아포가토", desc: "에스프레소 아포가토", size: "1잔", weight: "200ml", price: 6400, cal: "250~350 kcal", serving: "200ml", image: "/products/스폐셜 디저트/카페아포가토_0.png", flavor: false, maxF: 0, tag: "먹고가기 전용" },
  { name: "쇼콜라 아포가토", desc: "초콜릿 아포가토", size: "1잔", weight: "200ml", price: 6400, cal: "280~380 kcal", serving: "200ml", image: "/products/스폐셜 디저트/쇼콜라아포가토_0.png", flavor: false, maxF: 0, tag: "먹고가기 전용" },
  { name: "말차 아포가토", desc: "말차 아포가토", size: "1잔", weight: "200ml", price: 6400, cal: "260~360 kcal", serving: "200ml", image: "/products/스폐셜 디저트/말차아포가토_0.png", flavor: false, maxF: 0, tag: "먹고가기 전용" },
  // Dessert / Plate
  { name: "두바이 스타일\n초코쿠키", desc: "두바이st 디저트", size: "1개", weight: "150g", price: 6500, cal: "400~500 kcal", serving: "150g", image: "/products/스폐셜 디저트/두바이식초코쿠키(수정)_0.png", flavor: false, maxF: 0 },
  { name: "두바이 스타일\n초코모찌", desc: "두바이st 디저트", size: "1개", weight: "80g", price: 4800, cal: "200~300 kcal", serving: "80g", image: "/products/스폐셜 디저트/두바이스타일초코모찌_0.png", flavor: false, maxF: 0 },
  { name: "두바이 파르페", desc: "두바이st 디저트", size: "1개", weight: "250g", price: 9500, cal: "400~600 kcal", serving: "250g", image: "/products/스폐셜 디저트/두바이파르페_0.png", flavor: false, maxF: 0, tag: "먹고가기 전용" },
  { name: "두쫀모", desc: "두바이st 모찌", size: "1개", weight: "80g", price: 4800, cal: "200~300 kcal", serving: "80g", image: "/products/스폐셜 디저트/두쫀모_0.png", flavor: false, maxF: 0 },
  { name: "인절미 플레이트", desc: "인절미 디저트 플레이트", size: "1세트", weight: "250g", price: 14500, cal: "450~600 kcal", serving: "250g", image: "/products/스폐셜 디저트/인절미플레이트_0.png", flavor: false, maxF: 0, tag: "먹고가기 전용" },
  { name: "모찌 라이브 인절미", desc: "라이브 모찌", size: "1개", weight: "70g", price: 4800, cal: "140~200 kcal", serving: "70g", image: "/products/스폐셜 디저트/모찌라이브인절미_0.png", flavor: false, maxF: 0 },
  { name: "모찌 라이브 흑임자", desc: "라이브 모찌", size: "1개", weight: "70g", price: 4800, cal: "140~200 kcal", serving: "70g", image: "/products/스폐셜 디저트/모찌라이브흑임자_1.png", flavor: false, maxF: 0 },
  { name: "모찌 라이브 가을감", desc: "라이브 모찌", size: "1개", weight: "70g", price: 4800, cal: "140~200 kcal", serving: "70g", image: "/products/스폐셜 디저트/모찌라이브가을감_1.png", flavor: false, maxF: 0 },
  { name: "고구마 브륄레\n위드 아이스크림", desc: "브륄레 디저트", size: "1세트", weight: "200g", price: 8500, cal: "350~500 kcal", serving: "200g", image: "/products/스폐셜 디저트/고구마브륄레위드아이스크림_1.png", flavor: false, maxF: 0, tag: "먹고가기 전용" },
  { name: "군고구마 브륄레 (3ea)", desc: "브륄레", size: "3개입", weight: "240g", price: 9500, cal: "450~600 kcal", serving: "240g", image: "/products/스폐셜 디저트/군고구마브륄레(3ea)_0.png", flavor: false, maxF: 0 },
  { name: "군고구마 브륄레 (5ea)", desc: "브륄레", size: "5개입", weight: "400g", price: 14500, cal: "750~1000 kcal", serving: "400g", image: "/products/스폐셜 디저트/군고구마브륄레(5ea)_0.png", flavor: false, maxF: 0 },
  { name: "군고구마 브륄레", desc: "브륄레", size: "1개", weight: "80g", price: 3500, cal: "150~200 kcal", serving: "80g", image: "/products/스폐셜 디저트/군고구마브륄레(HS누끼)_0.png", flavor: false, maxF: 0 },
])

// ─── 콘/컵 (30) ──────────────────────────────────────────
const SERVING_TYPE: RequiredOptionDef = { groupId: "serving-type", label: "콘/컵 선택" }
const TEMPERATURE: RequiredOptionDef = { groupId: "temperature", label: "온도 선택" }

const coneCupProducts = generateProducts("cone-cup", [
  { name: "싱글 레귤러", desc: "레귤러 1스쿱", size: "레귤러", weight: "115g", price: 3900, cal: "150~280 kcal", serving: "115g", image: "/products/콘컵/워크샵싱글레귤러(수정1)_0.png", flavor: true, maxF: 1, reqOpts: [SERVING_TYPE] },
  { name: "싱글 킹", desc: "킹 1스쿱", size: "킹", weight: "145g", price: 4700, cal: "200~350 kcal", serving: "145g", image: "/products/콘컵/워크샵싱글킹(수정1)_0.png", flavor: true, maxF: 1, reqOpts: [SERVING_TYPE] },
  { name: "더블 주니어", desc: "주니어 2스쿱", size: "주니어", weight: "150g", price: 5100, cal: "200~350 kcal", serving: "150g", image: "/products/콘컵/워크샵더블주니어(수정1)_0.png", flavor: true, maxF: 2, tag: "이달의 더블주니어", reqOpts: [SERVING_TYPE] },
  { name: "더블 레귤러", desc: "레귤러 2스쿱", size: "레귤러", weight: "230g", price: 7300, cal: "300~520 kcal", serving: "230g", image: "/products/콘컵/워크샵더블레귤러(수정1)_0.png", flavor: true, maxF: 2, reqOpts: [SERVING_TYPE] },
])

// ─── 포장가능 아이스크림 (30) ─────────────────────────────
export const packableSubcategories = [
  { id: "all", name: "전체" },
  { id: "pint", name: "파인트" },
  { id: "quarter", name: "쿼터" },
  { id: "family", name: "패밀리" },
  { id: "half-gallon", name: "하프갤론" },
  { id: "pack", name: "팩" },
  { id: "set", name: "세트" },
]

const packableProducts = generateProducts("packable-icecream", [
  // ── 파인트 ──
  { name: "파인트", desc: "3가지 맛", size: "3가지 맛 (320g)", weight: "320g", price: 9800, cal: "200~350 kcal", serving: "320g", image: "/products/포장가능아이스크림/파인트_0.png", flavor: true, maxF: 3, sub: "pint" },
  // ── 쿼터 ──
  { name: "쿼터", desc: "4가지 맛", size: "4가지 맛 (620g)", weight: "620g", price: 18500, cal: "324~704 kcal", serving: "620g", image: "/products/포장가능아이스크림/워크샵쿼터_0.png", flavor: true, maxF: 4, sub: "quarter" },
  // ── 패밀리 ──
  { name: "패밀리", desc: "5가지 맛", size: "5가지 맛 (960g)", weight: "960g", price: 26000, cal: "324~704 kcal", serving: "960g", image: "/products/포장가능아이스크림/워크샵패밀리_0.png", flavor: true, maxF: 5, sub: "family" },
  // ── 하프갤론 ──
  { name: "하프갤론", desc: "6가지 맛", size: "6가지 맛 (1200g)", weight: "1200g", price: 31500, cal: "450~900 kcal", serving: "1200g", image: "/products/포장가능아이스크림/워크샵하프갤론_0.png", flavor: true, maxF: 6, sub: "half-gallon" },
  // ── 팩 ──
  { name: "아빠왔다팩", desc: "싱글레귤러 4개", size: "싱글레귤러 4개", weight: "4개", price: 15600, cal: "150~280 kcal", serving: "4개", image: "/products/포장가능아이스크림/워크샵아빠왔다팩_1.png", flavor: true, maxF: 4, sub: "pack" },
  { name: "버라이어티팩", desc: "싱글레귤러 6개", size: "싱글레귤러 6개", weight: "6개", price: 23400, cal: "150~280 kcal", serving: "6개", image: "/products/포장가능아이스크림/워크샵버라이어티팩_1.png", flavor: true, maxF: 6, sub: "pack" },
  { name: "옹기종기팩", desc: "싱글레귤러 8개", size: "싱글레귤러 8개", weight: "8개", price: 31200, cal: "150~280 kcal", serving: "8개", image: "/products/포장가능아이스크림/워크샵옹기종기팩_1.png", flavor: true, maxF: 8, sub: "pack" },
  // ── 세트 ──
  { name: "핸드팩 세트", desc: "핸드팩 세트", size: "1세트", weight: "640g", price: 18000, cal: "400~700 kcal", serving: "640g", image: "/products/포장가능아이스크림/워크샵핸드팩세트_0.png", flavor: true, maxF: 3, sub: "set" },
  // ── 기타 ──
  { name: "보냉백", desc: "보냉백", size: "1개", weight: "-", price: 2000, cal: "-", serving: "-", image: "/products/포장가능아이스크림/보냉백_0.PNG", flavor: false, maxF: 0, sub: "set" },
  { name: "종이 쇼핑백", desc: "종이쇼핑백", size: "1개", weight: "-", price: 500, cal: "-", serving: "-", image: "/products/포장가능아이스크림/종이쇼핑백_1.png", flavor: false, maxF: 0, sub: "set" },
  { name: "워크샵 파인트", desc: "워크샵 전용 파인트", size: "파인트", weight: "320g", price: 10800, cal: "200~350 kcal", serving: "320g", image: "/products/포장가능아이스크림/워크샵파인트_0.png", flavor: true, maxF: 3, sub: "pint" },
])

// ─── 아이스크림 케이크 (58) ── Actual BR ice cream cake menu ──
export const cakeSubcategories = [
  { id: "all", name: "전체" },
  { id: "small", name: "보울/에그/소형" },
  { id: "basic", name: "기본 홀케이크" },
  { id: "premium", name: "프리미엄/캐릭터" },
]

const cakeProducts = generateProducts("icecream-cake", [
  // ── 소형 케이크 라인 ──
  { name: "레드하트\n시트론 보블", desc: "보블 케이크", size: "보블", weight: "350g", price: 15000, cal: "600~800 kcal", serving: "350g", image: "/products/아이스크림케이크/레드하트시트론보블_0.png", flavor: false, maxF: 0, sub: "small" },
  { name: "해피윈터\n화이트씰", desc: "씰 케이크", size: "에그", weight: "500g", price: 22000, cal: "800~1100 kcal", serving: "500g", image: "/products/아이스크림케이크/해피윈터화이트씰_0.png", flavor: false, maxF: 0, sub: "small" },
  { name: "스윗 드리밍\n핑크씰", desc: "씰 케이크", size: "에그", weight: "500g", price: 22000, cal: "800~1100 kcal", serving: "500g", image: "/products/아이스크림케이크/스윗드리밍핑크씰_0.png", flavor: false, maxF: 0, sub: "small" },
  { name: "핑크 디노", desc: "디노 케이크", size: "캐릭터", weight: "600g", price: 29000, cal: "1000~1400 kcal", serving: "600g", image: "/products/아이스크림케이크/핑크디노_0.png", flavor: false, maxF: 0, sub: "small" },
  { name: "오렌지 디노", desc: "디노 케이크", size: "캐릭터", weight: "600g", price: 29000, cal: "1000~1400 kcal", serving: "600g", image: "/products/아이스크림케이크/오렌지디노_0.png", flavor: false, maxF: 0, sub: "small" },
  { name: "그린 디노", desc: "디노 케이크", size: "캐릭터", weight: "600g", price: 29000, cal: "1000~1400 kcal", serving: "600g", image: "/products/아이스크림케이크/그린디노_0.png", flavor: false, maxF: 0, sub: "small" },
  { name: "바나나치오 바젤", desc: "보블 케이크", size: "보블", weight: "350g", price: 15000, cal: "600~800 kcal", serving: "350g", image: "/products/아이스크림케이크/바나나치오바젤_0.png", flavor: false, maxF: 0, sub: "small" },
  { name: "스윗하트\n크랩 에그", desc: "에그 케이크", size: "에그", weight: "400g", price: 15000, cal: "500~700 kcal", serving: "400g", image: "/products/아이스크림케이크/스윗하트크랩에그_0.png", flavor: false, maxF: 0, sub: "small" },
  { name: "초콜릿 데블에그", desc: "에그 케이크", size: "에그", weight: "400g", price: 15000, cal: "550~750 kcal", serving: "400g", image: "/products/아이스크림케이크/초콜릿데블에그_0.png", flavor: false, maxF: 0, sub: "small" },
  { name: "단지쏙 유자", desc: "보블 케이크", size: "보블", weight: "350g", price: 15000, cal: "500~700 kcal", serving: "350g", image: "/products/아이스크림케이크/단지쏙유자_0.png", flavor: false, maxF: 0, sub: "small" },
  { name: "멜로우 쏘코니", desc: "소형 케이크", size: "소형", weight: "350g", price: 15000, cal: "500~700 kcal", serving: "350g", image: "/products/아이스크림케이크/멜로우쏘코니_0.png", flavor: false, maxF: 0, sub: "small" },
  { name: "치즈러버 쏘코니", desc: "소형 케이크", size: "소형", weight: "350g", price: 15000, cal: "500~700 kcal", serving: "350g", image: "/products/아이스크림케이크/치즈러버쏘코니_0.png", flavor: false, maxF: 0, sub: "small" },
  { name: "쪼꼬볼 쏘코니", desc: "소형 케이크", size: "소형", weight: "350g", price: 15000, cal: "500~700 kcal", serving: "350g", image: "/products/아이스크림케이크/쪼꼬볼쏘코니_0.png", flavor: false, maxF: 0, sub: "small" },
  { name: "쪼꼬링 쏘코니", desc: "소형 케이크", size: "소형", weight: "350g", price: 15000, cal: "500~700 kcal", serving: "350g", image: "/products/아이스크림케이크/쪼꼬링쏘코니_0.png", flavor: false, maxF: 0, sub: "small" },
  { name: "초코딥\n스노우볼 눌", desc: "소형 케이크", size: "소형", weight: "350g", price: 15000, cal: "550~750 kcal", serving: "350g", image: "/products/아이스크림케이크/초코딥스노우볼눌_0.png", flavor: false, maxF: 0, sub: "small" },
  { name: "허그미 러브벨", desc: "소형 케이크", size: "소형", weight: "350g", price: 15000, cal: "500~700 kcal", serving: "350g", image: "/products/아이스크림케이크/허그미러브벨_0.png", flavor: false, maxF: 0, sub: "small" },
  { name: "써니사이드업 에그", desc: "에그 케이크", size: "에그", weight: "400g", price: 15000, cal: "500~700 kcal", serving: "400g", image: "/products/아이스크림케이크/써니사이드업에그_0.png", flavor: false, maxF: 0, sub: "small" },
  { name: "러블리 미녀눌 케이크", desc: "소형 케이크", size: "소형", weight: "350g", price: 15000, cal: "500~700 kcal", serving: "350g", image: "/products/아이스크림케이크/러블리미녀눌케이크_0.png", flavor: false, maxF: 0, sub: "small" },
  { name: "리틀 기프트 보블", desc: "보블 케이크", size: "보블", weight: "350g", price: 15000, cal: "500~700 kcal", serving: "350g", image: "/products/아이스크림케이크/BR_HS-제품이미지-리틀기프트보블-204X160px_0.png", flavor: false, maxF: 0, sub: "small" },

  // ── 기본 홀케이크 라인 ──
  { name: "골든 브륄레\n판타지", desc: "홀케이크", size: "홀", weight: "800g", price: 32000, cal: "1800~2400 kcal", serving: "800g", image: "/products/아이스크림케이크/골든브륄레판타지_0.png", flavor: false, maxF: 0, sub: "basic" },
  { name: "골든 브륄레\n판타지 (신년)", desc: "홀케이크", size: "홀", weight: "800g", price: 32000, cal: "1800~2400 kcal", serving: "800g", image: "/products/아이스크림케이크/골든브륄레판타지(신년)_0.png", flavor: false, maxF: 0, sub: "basic" },
  { name: "홀리데이\n초콜릿 판타지", desc: "홀케이크", size: "홀", weight: "800g", price: 32000, cal: "1900~2500 kcal", serving: "800g", image: "/products/아이스크림케이크/홀리데이초콜릿판타지_0.png", flavor: false, maxF: 0, sub: "basic" },
  { name: "피넛라떼 브릭", desc: "홀케이크", size: "홀", weight: "750g", price: 28000, cal: "1600~2200 kcal", serving: "750g", image: "/products/아이스크림케이크/피넛라떼브릭_0.png", flavor: false, maxF: 0, sub: "basic" },
  { name: "스노우 초코베리\n바움쿠헨", desc: "홀케이크", size: "홀", weight: "800g", price: 31000, cal: "1800~2400 kcal", serving: "800g", image: "/products/아이스크림케이크/스노우초코베리바움쿠헨_0.png", flavor: false, maxF: 0, sub: "basic" },
  { name: "더듬뿍 딸기우유\n케이크", desc: "홀케이크", size: "홀", weight: "900g", price: 35000, cal: "1800~2400 kcal", serving: "900g", image: "/products/아이스크림케이크/더듬뿍딸기우유케이크_0.png", flavor: false, maxF: 0, sub: "basic" },
  { name: "더듬뿍 오렌지\n자몽 케이크", desc: "홀케이크", size: "홀", weight: "850g", price: 34000, cal: "1700~2300 kcal", serving: "850g", image: "/products/아이스크림케이크/더듬뿍오렌지자몽케이크_0.png", flavor: false, maxF: 0, sub: "basic" },
  { name: "마이멜로디와\n더듬뿍 딸기", desc: "캐릭터 홀케이크", size: "홀", weight: "850g", price: 34000, cal: "1800~2400 kcal", serving: "850g", image: "/products/아이스크림케이크/마이멜로디와더듬뿍딸기_0.png", flavor: false, maxF: 0, sub: "basic" },
  { name: "해피윈터\n트레인 (신년)", desc: "홀케이크", size: "홀", weight: "850g", price: 34000, cal: "1800~2400 kcal", serving: "850g", image: "/products/아이스크림케이크/해피윈터트레인(신년)_0.png", flavor: false, maxF: 0, sub: "basic" },
  { name: "황금빛 촛불\n눌 케이크", desc: "홀케이크", size: "홀", weight: "800g", price: 30000, cal: "1700~2300 kcal", serving: "800g", image: "/products/아이스크림케이크/황금빛촛불눌케이크_0.png", flavor: false, maxF: 0, sub: "basic" },

  // ── 프리미엄/캐릭터/테마 라인 ──
  { name: "굿럭 카피바라", desc: "프리미엄 케이크", size: "프리미엄", weight: "900g", price: 38000, cal: "2000~2600 kcal", serving: "900g", image: "/products/아이스크림케이크/굿럭카피바라_0.png", flavor: false, maxF: 0, sub: "premium" },
  { name: "럭키 포니\n춘식이 케이크", desc: "캐릭터 케이크", size: "캐릭터", weight: "800g", price: 30000, cal: "1700~2300 kcal", serving: "800g", image: "/products/아이스크림케이크/럭키포니춘식이케이크_0.png", flavor: false, maxF: 0, sub: "premium" },
  { name: "시계 보블 케이크", desc: "보블 케이크", size: "보블", weight: "350g", price: 15000, cal: "500~700 kcal", serving: "350g", image: "/products/아이스크림케이크/시계보블케이크_0.png", flavor: false, maxF: 0, sub: "premium" },
  { name: "로맨틱 야수\n에그 케이크", desc: "에그 케이크", size: "에그", weight: "400g", price: 15000, cal: "500~700 kcal", serving: "400g", image: "/products/아이스크림케이크/로맨틱야수에그케이크_0.png", flavor: false, maxF: 0, sub: "premium" },
  { name: "쁘띠케이크\n4개 세트", desc: "세트 케이크", size: "4개입", weight: "1200g", price: 59000, cal: "3200~4200 kcal", serving: "1200g", image: "/products/아이스크림케이크/쁘띠케이크4개세트_0.png", flavor: false, maxF: 0, sub: "premium", tag: "세트포장" },
  { name: "화이트 스트로베리\n캐슬", desc: "프리미엄 케이크", size: "프리미엄", weight: "1000g", price: 46000, cal: "2400~3200 kcal", serving: "1000g", image: "/products/아이스크림케이크/BR_HS-제품이미지-화이트스트로베리캐슬-204X160px_0.png", flavor: false, maxF: 0, sub: "premium" },
  { name: "초코 스트로베리\n가든", desc: "프리미엄 케이크", size: "프리미엄", weight: "1000g", price: 46000, cal: "2500~3300 kcal", serving: "1000g", image: "/products/아이스크림케이크/BR_HS-제품이미지-케이크-초코스트로베리가든-204X160px_0.png", flavor: false, maxF: 0, sub: "premium" },
  { name: "골든 쇼콜라 케이크", desc: "프리미엄 케이크", size: "프리미엄", weight: "850g", price: 34000, cal: "2000~2600 kcal", serving: "850g", image: "/products/아이스크림케이크/BR_HS-제품이미지-골든쇼콜라케이크-204X160px_0.png", flavor: false, maxF: 0, sub: "premium" },
  { name: "화이트 스트로베리\n페스티벌", desc: "신제품", size: "홀", weight: "750g", price: 26000, cal: "1400~1900 kcal", serving: "750g", image: "/products/아이스크림케이크/BR_HS-제품이미지-케이크-화이트스트로베리페스티벌-204X160px_0.png", flavor: false, maxF: 0, sub: "premium", tag: "NEW" },
  { name: "초코 스트로베리\n페스티벌", desc: "신제품", size: "홀", weight: "750g", price: 26000, cal: "1500~2000 kcal", serving: "750g", image: "/products/아이스크림케이크/BR_HS-제품이미지-케이크-초코스트로베리페스티벌-204X160px_0.png", flavor: false, maxF: 0, sub: "premium", tag: "NEW" },
  { name: "피스타치오\n스트로베리 페스티벌", desc: "신제품", size: "홀", weight: "750g", price: 26000, cal: "1500~2000 kcal", serving: "750g", image: "/products/아이스크림케이크/BR_HS-제품이미지-케이크-피스타치오스트로베리페스티벌-204X160px_0.png", flavor: false, maxF: 0, sub: "premium", tag: "NEW" },
  { name: "핑크펄 인하트", desc: "하트 프리미엄", size: "하트", weight: "900g", price: 36000, cal: "2000~2600 kcal", serving: "900g", image: "/products/아이스크림케이크/핑크펄인하트_0.png", flavor: false, maxF: 0, sub: "premium", tag: "NEW" },
  { name: "하트 앤 하트\n쇼콜라", desc: "하트 프리미엄", size: "하트", weight: "1000g", price: 44000, cal: "2400~3200 kcal", serving: "1000g", image: "/products/아이스크림케이크/하트앤하트쇼콜라_0.png", flavor: false, maxF: 0, sub: "premium", tag: "NEW" },
  { name: "초코 스트로베리\n바스켓", desc: "바스켓 케이크", size: "바스켓", weight: "400g", price: 15000, cal: "500~700 kcal", serving: "400g", image: "/products/아이스크림케이크/BR_HS-제품이미지-케이크-초코스트로베리바스켓-204X160px_0.png", flavor: false, maxF: 0, sub: "premium", tag: "NEW" },
  { name: "화이트 스트로베리\n바스켓", desc: "바스켓 케이크", size: "바스켓", weight: "400g", price: 15000, cal: "500~700 kcal", serving: "400g", image: "/products/아이스크림케이크/BR_HS-제품이미지-케이크-화이트스트로베리바스켓-204X160px_0.png", flavor: false, maxF: 0, sub: "premium", tag: "NEW" },
  { name: "스트로베리 요거트\n프레지에", desc: "프리미엄 케이크", size: "프리미엄", weight: "1100g", price: 49000, cal: "2600~3400 kcal", serving: "1100g", image: "/products/아이스크림케이크/스트로베리요거트프레지에_0.png", flavor: false, maxF: 0, sub: "premium", tag: "NEW" },
  { name: "두바이 스타일\n앤 스트로베리", desc: "프리미엄 케이크", size: "프리미엄", weight: "950g", price: 42000, cal: "2200~2900 kcal", serving: "950g", image: "/products/아이스크림케이크/두바이스타일앤스트로베리_0.png", flavor: false, maxF: 0, sub: "premium", tag: "NEW" },
  { name: "초콜릿 앤 카라멜\n몽블랑", desc: "프리미엄 케이크", size: "프리미엄", weight: "900g", price: 38000, cal: "2000~2600 kcal", serving: "900g", image: "/products/아이스크림케이크/초콜릿앤카라멜몽블랑_0.png", flavor: false, maxF: 0, sub: "premium" },
  { name: "베리베리 빅에그", desc: "빅에그 케이크", size: "빅에그", weight: "1000g", price: 43000, cal: "2300~3000 kcal", serving: "1000g", image: "/products/아이스크림케이크/베리베리빅에그(수정)_0.png", flavor: false, maxF: 0, sub: "premium" },
  { name: "물개박수\n그레이씰 빅에그", desc: "빅에그 케이크", size: "빅에그", weight: "1000g", price: 44000, cal: "2300~3000 kcal", serving: "1000g", image: "/products/아이스크림케이크/물개박수그레이씰빅에그_0.png", flavor: false, maxF: 0, sub: "premium", tag: "NEW" },
  { name: "코지 래빗하우스", desc: "캐릭터 케이크", size: "캐릭터", weight: "850g", price: 34000, cal: "1800~2400 kcal", serving: "850g", image: "/products/아이스크림케이크/HS_코지래빗하우스_204_160_0.png", flavor: false, maxF: 0, sub: "premium" },
  { name: "야옹이 프렌즈\n샌드", desc: "캐릭터 케이크", size: "캐릭터", weight: "850g", price: 34000, cal: "1800~2400 kcal", serving: "850g", image: "/products/아이스크림케이크/HS_야옹이프렌즈샌드_204_160_0.png", flavor: false, maxF: 0, sub: "premium" },
  { name: "화이트베어의\n하트쿠션", desc: "캐릭터 케이크", size: "캐릭터", weight: "850g", price: 34000, cal: "1800~2400 kcal", serving: "850g", image: "/products/아이스크림케이크/HS_화이트베어의하트쿠션_204_160_0.png", flavor: false, maxF: 0, sub: "premium" },
  { name: "마이 핑크벌룬\n퍼피", desc: "캐릭터 케이크", size: "캐릭터", weight: "800g", price: 32000, cal: "1700~2300 kcal", serving: "800g", image: "/products/아이스크림케이크/HS_마이핑크벌룬퍼피_204_160_0.png", flavor: false, maxF: 0, sub: "premium" },
  { name: "포니 마카롱\n원더랜드", desc: "마카롱 케이크", size: "프리미엄", weight: "1000g", price: 43000, cal: "2400~3200 kcal", serving: "1000g", image: "/products/아이스크림케이크/HS_포니마카롱원더랜드_204_160_0.png", flavor: false, maxF: 0, sub: "premium" },
  { name: "소원가득 포니\n패밀리에그", desc: "빅에그 케이크", size: "빅에그", weight: "1100g", price: 48000, cal: "2600~3400 kcal", serving: "1100g", image: "/products/아이스크림케이크/소원가득포니패밀리에그_0.png", flavor: false, maxF: 0, sub: "premium" },
  { name: "럭키 해피 비숑", desc: "캐릭터 케이크", size: "캐릭터", weight: "900g", price: 38000, cal: "2000~2600 kcal", serving: "900g", image: "/products/아이스크림케이크/럭키해피비숑_0.png", flavor: false, maxF: 0, sub: "premium" },
  { name: "레슬리 아몬드봉봉\n미니케이크", desc: "미니케이크", size: "미니", weight: "300g", price: 15000, cal: "500~700 kcal", serving: "300g", image: "/products/아이스크림케이크/레슬리_아몬드봉봉미니케이크_0.png", flavor: false, maxF: 0, sub: "small" },
  { name: "레슬리 엄마는 외계인\n미니케이크", desc: "미니케이크", size: "미니", weight: "300g", price: 15000, cal: "500~700 kcal", serving: "300g", image: "/products/아이스크림케이크/레슬리_엄마는외계인미니케이크_0.png", flavor: false, maxF: 0, sub: "small" },
  { name: "큐티 밤부팬더", desc: "캐릭터 케이크", size: "캐릭터", weight: "800g", price: 30000, cal: "1700~2300 kcal", serving: "800g", image: "/products/아이스크림케이크/BR_HS-제품이미지-케이크-큐티밤부팬더-204X160px_0.png", flavor: false, maxF: 0, sub: "premium" },
  { name: "스트로베리 초코\n바스켓", desc: "바스켓 케이크", size: "바스켓", weight: "400g", price: 15000, cal: "500~700 kcal", serving: "400g", image: "/products/아이스크림케이크/스트로베리초코바스켓_0.png", flavor: false, maxF: 0, sub: "premium" },
])

// ─── 커피 (8) ── Actual BR coffee menu ────────────────────
const coffeeProducts = generateProducts("coffee", [
  { name: "위티 골든 브릴레\n아이스슈페너", desc: "아이스슈페너", size: "레귤러", weight: "350ml", price: 5500, cal: "180~260 kcal", serving: "350ml", image: "/products/einspanner.jpg", flavor: false, maxF: 0 },
  { name: "카페 레이어드 라떼", desc: "레이어드 라떼", size: "레귤러", weight: "350ml", price: 5400, cal: "150~220 kcal", serving: "350ml", image: "/products/layered-latte.jpg", flavor: false, maxF: 0 },
  { name: "아메리카노", desc: "아이스/핫", size: "레귤러", weight: "350ml", price: 4400, cal: "5~10 kcal", serving: "350ml", image: "/products/americano.jpg", flavor: false, maxF: 0, reqOpts: [TEMPERATURE] },
  { name: "카페라떼", desc: "아이스/핫", size: "레귤러", weight: "350ml", price: 5000, cal: "120~180 kcal", serving: "350ml", image: "/products/cafe-latte.jpg", flavor: false, maxF: 0, reqOpts: [TEMPERATURE] },
  { name: "바닐라라떼", desc: "아이스/핫", size: "레귤러", weight: "350ml", price: 5000, cal: "180~250 kcal", serving: "350ml", image: "/products/cafe-latte.jpg", flavor: false, maxF: 0, reqOpts: [TEMPERATURE] },
  { name: "연유라떼", desc: "아이스", size: "레귤러", weight: "350ml", price: 5000, cal: "210~300 kcal", serving: "350ml", image: "/products/condensed-latte.jpg", flavor: false, maxF: 0 },
  { name: "엄마는 외계인\n카페모카", desc: "카페모카", size: "레귤러", weight: "350ml", price: 5000, cal: "220~300 kcal", serving: "350ml", image: "/products/cafe-mocha.jpg", flavor: false, maxF: 0 },
  { name: "수카방 커피", desc: "수카방 커피", size: "레귤러", weight: "300ml", price: 3900, cal: "80~120 kcal", serving: "300ml", image: "/products/sukabang.jpg", flavor: false, maxF: 0 },
])

// ─── 음료 블라스트 (30) ──────────────────────────────────
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

// ─── 젤라또 (6) ── Actual BR gelato menu ─────────────────
const gelatoProducts = generateProducts("gelato", [
  { name: "젤라또 컵", desc: "2가지맛", size: "컵 (2가지맛)", weight: "200g", price: 5500, cal: "220~340 kcal", serving: "200g", image: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
  { name: "젤라또 팩", desc: "500ml / 3가지맛", size: "500ml (3가지맛)", weight: "500ml", price: 19500, cal: "600~900 kcal", serving: "500ml", image: "/products/gelato-pack.jpg", flavor: false, maxF: 0, tag: "가져가기 전용" },
  { name: "믹스 베리 요거트", desc: "젤라또", size: "1컵", weight: "200g", price: 6300, cal: "180~280 kcal", serving: "200g", image: "/products/gelato-berry.jpg", flavor: false, maxF: 0 },
  { name: "피스타치오\n허니요거트", desc: "젤라또", size: "1컵", weight: "200g", price: 6300, cal: "200~300 kcal", serving: "200g", image: "/products/gelato-pistachio.jpg", flavor: false, maxF: 0 },
  { name: "카라멜 쿠키 바닐라", desc: "젤라또", size: "1컵", weight: "200g", price: 6300, cal: "220~320 kcal", serving: "200g", image: "/products/gelato-caramel.jpg", flavor: false, maxF: 0 },
  { name: "초콜릿 바나나", desc: "젤라또", size: "1컵", weight: "200g", price: 6300, cal: "210~310 kcal", serving: "200g", image: "/products/gelato-choco-banana.jpg", flavor: false, maxF: 0 },
])

// ─── 디저트 (31) ── Actual BR dessert menu ────────────────
export const dessertSubcategories = [
  { id: "all", name: "전체" },
  { id: "baum-monaka-mochi", name: "바움쿠헨/모나카/모찌" },
  { id: "cookie-bagel-sand", name: "쿠키/베이글/샌드" },
  { id: "set-menu", name: "세트 메뉴" },
  { id: "churros-cake", name: "츄러스/케이크" },
  { id: "choco-hangwa", name: "초콜릿바/한과/선물" },
  { id: "etc", name: "기타" },
]

const dessertProducts = generateProducts("dessert", [
  // ── 바움쿠헨 / 모나카 / 모찌 라인 ──
  { name: "아이스 바움쿠헨\n아몬드봉봉", desc: "바움쿠헨", size: "1개", weight: "120g", price: 4500, cal: "280~380 kcal", serving: "120g", image: "/products/baumkuchen.jpg", flavor: false, maxF: 0, sub: "baum-monaka-mochi" },
  { name: "아이스 모나카 우유", desc: "모나카", size: "1개", weight: "100g", price: 3800, cal: "180~260 kcal", serving: "100g", image: "/products/monaka.jpg", flavor: false, maxF: 0, sub: "baum-monaka-mochi" },
  { name: "아이스 모나카\n쫀떡 인절미", desc: "모나카", size: "1개", weight: "100g", price: 3800, cal: "200~280 kcal", serving: "100g", image: "/products/monaka.jpg", flavor: false, maxF: 0, sub: "baum-monaka-mochi" },
  { name: "아이스모찌 소금우유", desc: "모찌", size: "1개", weight: "60g", price: 3300, cal: "100~150 kcal", serving: "60g", image: "/products/mochi.jpg", flavor: false, maxF: 0, sub: "baum-monaka-mochi" },
  { name: "아이스 모찌\n스트로베리", desc: "모찌", size: "1개", weight: "60g", price: 3300, cal: "100~150 kcal", serving: "60g", image: "/products/mochi.jpg", flavor: false, maxF: 0, sub: "baum-monaka-mochi" },
  { name: "아이스 모찌\n아몬드봉봉", desc: "모찌", size: "1개", weight: "60g", price: 3300, cal: "110~160 kcal", serving: "60g", image: "/products/mochi.jpg", flavor: false, maxF: 0, sub: "baum-monaka-mochi" },
  { name: "아이스 모찌 그린티", desc: "모찌", size: "1개", weight: "60g", price: 3300, cal: "100~150 kcal", serving: "60g", image: "/products/mochi.jpg", flavor: false, maxF: 0, sub: "baum-monaka-mochi" },
  { name: "아이스 모찌\n초코바닐라", desc: "모찌", size: "1개", weight: "60g", price: 3300, cal: "110~160 kcal", serving: "60g", image: "/products/mochi.jpg", flavor: false, maxF: 0, sub: "baum-monaka-mochi" },
  { name: "아이스 모찌 크림치즈", desc: "모찌", size: "1개", weight: "60g", price: 3300, cal: "110~160 kcal", serving: "60g", image: "/products/mochi.jpg", flavor: false, maxF: 0, sub: "baum-monaka-mochi" },

  // ── 쿠키 / 베이글 / 샌드 ──
  { name: "솔티드 초콜릿칩\n쿠키", desc: "쿠키", size: "1개", weight: "90g", price: 3800, cal: "200~280 kcal", serving: "90g", image: "/products/choco-cookie.jpg", flavor: false, maxF: 0, sub: "cookie-bagel-sand" },
  { name: "다크 초콜릿 칩\n쿠키", desc: "쿠키", size: "1개", weight: "90g", price: 3800, cal: "210~290 kcal", serving: "90g", image: "/products/choco-cookie.jpg", flavor: false, maxF: 0, sub: "cookie-bagel-sand" },
  { name: "블루베리 베이글", desc: "베이글", size: "1개", weight: "110g", price: 3000, cal: "240~320 kcal", serving: "110g", image: "/products/bagel.jpg", flavor: false, maxF: 0, sub: "cookie-bagel-sand" },
  { name: "플레인 베이글", desc: "베이글", size: "1개", weight: "100g", price: 3000, cal: "220~300 kcal", serving: "100g", image: "/products/bagel.jpg", flavor: false, maxF: 0, sub: "cookie-bagel-sand" },
  { name: "버터 쿠키 샌드\n바닐라 카라멜", desc: "쿠키 샌드", size: "1개", weight: "100g", price: 4300, cal: "220~310 kcal", serving: "100g", image: "/products/cookie-sand.jpg", flavor: false, maxF: 0, sub: "cookie-bagel-sand" },
  { name: "버터 쿠키 샌드\n스트로베리", desc: "쿠키 샌드", size: "1개", weight: "100g", price: 4300, cal: "210~300 kcal", serving: "100g", image: "/products/cookie-sand.jpg", flavor: false, maxF: 0, sub: "cookie-bagel-sand" },

  // ── 세트 메뉴 – 20% 할인 ──
  { name: "스윗 시나몬\n츄러스 SET", desc: "세트 메뉴", size: "1세트", weight: "250g", price: 7100, cal: "380~520 kcal", serving: "250g", image: "/products/churros.jpg", flavor: false, maxF: 0, sub: "set-menu", tag: "20% 할인" },
  { name: "젤라또 하트\n츄러스 SET", desc: "세트 메뉴", size: "1세트", weight: "300g", price: 9500, cal: "480~650 kcal", serving: "300g", image: "/products/churros.jpg", flavor: false, maxF: 0, sub: "set-menu", tag: "20% 할인" },
  { name: "플레인 베이글 SET", desc: "세트 메뉴", size: "1세트", weight: "250g", price: 5900, cal: "350~480 kcal", serving: "250g", image: "/products/bagel.jpg", flavor: false, maxF: 0, sub: "set-menu", tag: "20% 할인" },
  { name: "블루베리 베이글 SET", desc: "세트 메뉴", size: "1세트", weight: "260g", price: 5900, cal: "370~500 kcal", serving: "260g", image: "/products/bagel.jpg", flavor: false, maxF: 0, sub: "set-menu", tag: "20% 할인" },

  // ── 츄러스 / 케이크 단품 ──
  { name: "스윗 시나몬 츄러스", desc: "츄러스", size: "1개", weight: "100g", price: 4500, cal: "250~350 kcal", serving: "100g", image: "/products/churros.jpg", flavor: false, maxF: 0, sub: "churros-cake" },
  { name: "젤라또 하트 츄러스", desc: "츄러스", size: "1개", weight: "150g", price: 7500, cal: "380~500 kcal", serving: "150g", image: "/products/churros.jpg", flavor: false, maxF: 0, sub: "churros-cake" },
  { name: "바스크 치즈 케이크", desc: "치즈케이크", size: "1개", weight: "150g", price: 7500, cal: "350~480 kcal", serving: "150g", image: "/products/basque-cheese.jpg", flavor: false, maxF: 0, sub: "churros-cake" },

  // ── 초콜릿 바 / 한과 / 선물세트 ──
  { name: "스윗 초콜릿 바\n(2개입)", desc: "초콜릿 바", size: "2개입", weight: "120g", price: 5800, cal: "280~380 kcal", serving: "120g", image: "/products/choco-bar.jpg", flavor: false, maxF: 0, sub: "choco-hangwa" },
  { name: "스윗 초콜릿바\n세트 (4개입)", desc: "초콜릿 바 세트", size: "4개입", weight: "240g", price: 11600, cal: "560~760 kcal", serving: "240g", image: "/products/choco-bar.jpg", flavor: false, maxF: 0, sub: "choco-hangwa", tag: "NEW" },
  { name: "찹쌀 한과 선물\n세트 (4개입)", desc: "한과 세트", size: "4개입", weight: "320g", price: 27200, cal: "600~800 kcal", serving: "320g", image: "/products/hangwa.jpg", flavor: false, maxF: 0, sub: "choco-hangwa", tag: "NEW" },
  { name: "아이스 찹쌀 한과\n조청", desc: "한과", size: "1개", weight: "80g", price: 6800, cal: "150~220 kcal", serving: "80g", image: "/products/hangwa.jpg", flavor: false, maxF: 0, sub: "choco-hangwa", tag: "NEW" },
  { name: "아이스 찹쌀 한과\n고구마", desc: "한과", size: "1개", weight: "80g", price: 6800, cal: "150~220 kcal", serving: "80g", image: "/products/hangwa.jpg", flavor: false, maxF: 0, sub: "choco-hangwa", tag: "NEW" },
  { name: "아이스 찹쌀 한과\n흑임자", desc: "한과", size: "1개", weight: "80g", price: 6800, cal: "150~220 kcal", serving: "80g", image: "/products/hangwa.jpg", flavor: false, maxF: 0, sub: "choco-hangwa", tag: "NEW" },
  { name: "아이스 찹쌀 한과\n쌀", desc: "한과", size: "1개", weight: "80g", price: 6800, cal: "140~210 kcal", serving: "80g", image: "/products/hangwa.jpg", flavor: false, maxF: 0, sub: "choco-hangwa", tag: "NEW" },

  // ── 기타 디저트 ──
  { name: "베리 크럼블 스푼업", desc: "스푼업", size: "1개", weight: "200g", price: 6300, cal: "280~380 kcal", serving: "200g", image: "/products/berry-crumble.jpg", flavor: false, maxF: 0, sub: "etc", tag: "NEW" },
])

// ─── 프리팩 (23) ── Actual BR prepack menu ────────────────
export const prepackSubcategories = [
  { id: "all", name: "전체" },
  { id: "readypack", name: "레디팩" },
  { id: "blockpack", name: "블록팩" },
  { id: "lessly-blockpack", name: "(Lessly) 블록팩" },
]

const prepackProducts = generateProducts("prepack", [
  // ── 레디팩 (대용량 컵형) – 10,800원 고정 ──
  { name: "레디팩 아몬드 봉봉", desc: "레디팩", size: "대용량", weight: "660ml", price: 10800, cal: "600~900 kcal", serving: "660ml", image: "/products/readypack.jpg", flavor: false, maxF: 0, sub: "readypack" },
  { name: "레디팩 오레오\n쿠키앤크림", desc: "레디팩", size: "대용량", weight: "660ml", price: 10800, cal: "650~950 kcal", serving: "660ml", image: "/products/readypack.jpg", flavor: false, maxF: 0, sub: "readypack" },
  { name: "레디팩 베리베리\n스트로베리", desc: "레디팩", size: "대용량", weight: "660ml", price: 10800, cal: "550~850 kcal", serving: "660ml", image: "/products/readypack.jpg", flavor: false, maxF: 0, sub: "readypack" },
  { name: "레디팩 초코나무숲", desc: "레디팩", size: "대용량", weight: "660ml", price: 10800, cal: "650~950 kcal", serving: "660ml", image: "/products/readypack.jpg", flavor: false, maxF: 0, sub: "readypack" },
  { name: "레디팩 엄마는 외계인", desc: "레디팩", size: "대용량", weight: "660ml", price: 10800, cal: "600~900 kcal", serving: "660ml", image: "/products/readypack.jpg", flavor: false, maxF: 0, sub: "readypack" },
  { name: "레디팩 31 요거트", desc: "레디팩", size: "대용량", weight: "660ml", price: 10800, cal: "500~800 kcal", serving: "660ml", image: "/products/readypack.jpg", flavor: false, maxF: 0, sub: "readypack" },
  { name: "레디팩 체리쥬빌레", desc: "레디팩", size: "대용량", weight: "660ml", price: 10800, cal: "550~850 kcal", serving: "660ml", image: "/products/readypack.jpg", flavor: false, maxF: 0, sub: "readypack" },
  { name: "레디팩 민트\n초콜릿 칩", desc: "레디팩", size: "대용량", weight: "660ml", price: 10800, cal: "600~900 kcal", serving: "660ml", image: "/products/readypack.jpg", flavor: false, maxF: 0, sub: "readypack" },
  { name: "레디팩 소금우유", desc: "레디팩", size: "대용량", weight: "660ml", price: 10800, cal: "500~800 kcal", serving: "660ml", image: "/products/readypack.jpg", flavor: false, maxF: 0, sub: "readypack" },
  { name: "레디팩 레인보우\n샤베트", desc: "레디팩", size: "대용량", weight: "660ml", price: 10800, cal: "450~700 kcal", serving: "660ml", image: "/products/readypack.jpg", flavor: false, maxF: 0, sub: "readypack" },

  // ── 블록팩 (소용량 컵형) – 4,000원 고정 ──
  { name: "블록팩 아몬드봉봉", desc: "블록팩", size: "소용량", weight: "200ml", price: 4000, cal: "180~280 kcal", serving: "200ml", image: "/products/blockpack.jpg", flavor: false, maxF: 0, sub: "blockpack" },
  { name: "블록팩 뉴욕치즈케이크", desc: "블록팩", size: "소용량", weight: "200ml", price: 4000, cal: "200~300 kcal", serving: "200ml", image: "/products/blockpack.jpg", flavor: false, maxF: 0, sub: "blockpack" },
  { name: "블록팩 민트초코봉봉", desc: "블록팩", size: "소용량", weight: "200ml", price: 4000, cal: "190~290 kcal", serving: "200ml", image: "/products/blockpack.jpg", flavor: false, maxF: 0, sub: "blockpack" },
  { name: "블록팩 슈팅스타", desc: "블록팩", size: "소용량", weight: "200ml", price: 4000, cal: "170~260 kcal", serving: "200ml", image: "/products/blockpack.jpg", flavor: false, maxF: 0, sub: "blockpack" },
  { name: "블록팩 체리쥬빌레", desc: "블록팩", size: "소용량", weight: "200ml", price: 4000, cal: "170~260 kcal", serving: "200ml", image: "/products/blockpack.jpg", flavor: false, maxF: 0, sub: "blockpack" },
  { name: "블록팩 이상한 나라의\n솜사탕", desc: "블록팩", size: "소용량", weight: "200ml", price: 4000, cal: "180~280 kcal", serving: "200ml", image: "/products/blockpack.jpg", flavor: false, maxF: 0, sub: "blockpack" },
  { name: "블록팩 쿠키앤크림", desc: "블록팩", size: "소용량", weight: "200ml", price: 4000, cal: "200~300 kcal", serving: "200ml", image: "/products/blockpack.jpg", flavor: false, maxF: 0, sub: "blockpack" },
  { name: "블록팩 바람과 함께\n사라지다", desc: "블���팩", size: "소용량", weight: "200ml", price: 4000, cal: "180~280 kcal", serving: "200ml", image: "/products/blockpack.jpg", flavor: false, maxF: 0, sub: "blockpack" },
  { name: "블록팩 엄마는 외계인", desc: "블록팩", size: "소용량", weight: "200ml", price: 4000, cal: "180~280 kcal", serving: "200ml", image: "/products/blockpack.jpg", flavor: false, maxF: 0, sub: "blockpack" },

  // ── (Lessly) 블록팩 – NEW 라인 ──
  { name: "(Lessly) 블록팩\n초코나무숲", desc: "Lessly 블록팩", size: "소용량", weight: "200ml", price: 4000, cal: "200~300 kcal", serving: "200ml", image: "/products/lessly-blockpack.jpg", flavor: false, maxF: 0, sub: "lessly-blockpack", tag: "NEW" },
  { name: "(Lessly) 블록팩\n민트 초콜릿 칩", desc: "Lessly 블록팩", size: "소용량", weight: "200ml", price: 4000, cal: "190~290 kcal", serving: "200ml", image: "/products/lessly-blockpack.jpg", flavor: false, maxF: 0, sub: "lessly-blockpack", tag: "NEW" },
  { name: "(Lessly) 블록팩\n아몬드봉봉", desc: "Lessly 블록팩", size: "소용량", weight: "200ml", price: 4000, cal: "180~280 kcal", serving: "200ml", image: "/products/lessly-blockpack.jpg", flavor: false, maxF: 0, sub: "lessly-blockpack", tag: "NEW" },
  { name: "(Lessly) 블록팩\n엄마는 외계인", desc: "Lessly 블록팩", size: "소용량", weight: "200ml", price: 4000, cal: "180~280 kcal", serving: "200ml", image: "/products/lessly-blockpack.jpg", flavor: false, maxF: 0, sub: "lessly-blockpack", tag: "NEW" },
])

// ─── 상품 (51) ── Actual BR merchandise ───────────────────
export const partySubcategories = [
  { id: "all", name: "전체" },
  { id: "tray", name: "트레이" },
  { id: "stationery", name: "클립펜/카드/숫자초" },
  { id: "tumbler-acc", name: "텀블러/모자/우산" },
  { id: "brand", name: "브랜드 굿즈" },
  { id: "scent", name: "향 제품" },
  { id: "party-deco", name: "파티/장식/기타" },
]

const partyProducts = generateProducts("party", [
  // ── 트레이 ──
  { name: "트레이 머스터드 / 소", desc: "트레이", size: "소", weight: "-", price: 40000, cal: "-", serving: "-", image: "/products/tray.jpg", flavor: false, maxF: 0, sub: "tray" },
  { name: "트레이 아마존블루 / 소", desc: "트레이", size: "소", weight: "-", price: 40000, cal: "-", serving: "-", image: "/products/tray.jpg", flavor: false, maxF: 0, sub: "tray" },
  { name: "트레이 키라임 / 소", desc: "트레이", size: "소", weight: "-", price: 40000, cal: "-", serving: "-", image: "/products/tray.jpg", flavor: false, maxF: 0, sub: "tray" },
  { name: "트레이 서우그린 / 소", desc: "트레이", size: "소", weight: "-", price: 40000, cal: "-", serving: "-", image: "/products/tray.jpg", flavor: false, maxF: 0, sub: "tray" },
  { name: "트레이 머스터드 / 중", desc: "트레이", size: "중", weight: "-", price: 45000, cal: "-", serving: "-", image: "/products/tray.jpg", flavor: false, maxF: 0, sub: "tray" },
  { name: "트레이 아마존블루 / 중", desc: "트레이", size: "중", weight: "-", price: 45000, cal: "-", serving: "-", image: "/products/tray.jpg", flavor: false, maxF: 0, sub: "tray" },
  { name: "트레이 키라임 / 중", desc: "트레이", size: "중", weight: "-", price: 45000, cal: "-", serving: "-", image: "/products/tray.jpg", flavor: false, maxF: 0, sub: "tray" },

  // ── 클립펜 ──
  { name: "클립펜 / 화이트", desc: "클립펜", size: "1개", weight: "-", price: 2500, cal: "-", serving: "-", image: "/products/clip-pen.jpg", flavor: false, maxF: 0, sub: "stationery" },
  { name: "클립펜 / 블루", desc: "클립펜", size: "1개", weight: "-", price: 2500, cal: "-", serving: "-", image: "/products/clip-pen.jpg", flavor: false, maxF: 0, sub: "stationery" },
  { name: "클립펜 / 옐로우", desc: "클립펜", size: "1개", weight: "-", price: 2500, cal: "-", serving: "-", image: "/products/clip-pen.jpg", flavor: false, maxF: 0, sub: "stationery" },
  { name: "클립펜 / 그린", desc: "클립펜", size: "1개", weight: "-", price: 2500, cal: "-", serving: "-", image: "/products/clip-pen.jpg", flavor: false, maxF: 0, sub: "stationery" },

  // ── 카드 ──
  { name: "카드 LoveYouForever", desc: "카드", size: "1장", weight: "-", price: 3000, cal: "-", serving: "-", image: "/products/greeting-card.jpg", flavor: false, maxF: 0, sub: "stationery" },
  { name: "카드 Congratulations!", desc: "카드", size: "1장", weight: "-", price: 3000, cal: "-", serving: "-", image: "/products/greeting-card.jpg", flavor: false, maxF: 0, sub: "stationery" },
  { name: "카드 HappyBirthday", desc: "카드", size: "1장", weight: "-", price: 3000, cal: "-", serving: "-", image: "/products/greeting-card.jpg", flavor: false, maxF: 0, sub: "stationery" },
  { name: "카드 Goodlucktoyou", desc: "카드", size: "1장", weight: "-", price: 3000, cal: "-", serving: "-", image: "/products/greeting-card.jpg", flavor: false, maxF: 0, sub: "stationery" },

  // ── 숫자초 – 800원 고정 ──
  { name: "0번 숫자초", desc: "숫자초", size: "1개", weight: "-", price: 800, cal: "-", serving: "-", image: "/products/number-candle.jpg", flavor: false, maxF: 0, sub: "stationery" },
  { name: "1번 숫자초", desc: "숫자초", size: "1개", weight: "-", price: 800, cal: "-", serving: "-", image: "/products/number-candle.jpg", flavor: false, maxF: 0, sub: "stationery" },
  { name: "2번 숫자초", desc: "숫자초", size: "1개", weight: "-", price: 800, cal: "-", serving: "-", image: "/products/number-candle.jpg", flavor: false, maxF: 0, sub: "stationery" },
  { name: "3번 숫자초", desc: "숫자초", size: "1개", weight: "-", price: 800, cal: "-", serving: "-", image: "/products/number-candle.jpg", flavor: false, maxF: 0, sub: "stationery" },
  { name: "4번 숫자초", desc: "숫자초", size: "1개", weight: "-", price: 800, cal: "-", serving: "-", image: "/products/number-candle.jpg", flavor: false, maxF: 0, sub: "stationery" },
  { name: "5번 숫자초", desc: "숫자초", size: "1개", weight: "-", price: 800, cal: "-", serving: "-", image: "/products/number-candle.jpg", flavor: false, maxF: 0, sub: "stationery" },
  { name: "6번 숫자초", desc: "숫자초", size: "1개", weight: "-", price: 800, cal: "-", serving: "-", image: "/products/number-candle.jpg", flavor: false, maxF: 0, sub: "stationery" },
  { name: "7번 숫자초", desc: "숫자초", size: "1개", weight: "-", price: 800, cal: "-", serving: "-", image: "/products/number-candle.jpg", flavor: false, maxF: 0, sub: "stationery" },
  { name: "8번 숫자초", desc: "숫자초", size: "1개", weight: "-", price: 800, cal: "-", serving: "-", image: "/products/number-candle.jpg", flavor: false, maxF: 0, sub: "stationery" },
  { name: "9번 숫자초", desc: "숫자초", size: "1개", weight: "-", price: 800, cal: "-", serving: "-", image: "/products/number-candle.jpg", flavor: false, maxF: 0, sub: "stationery" },

  // ── 텀블러 / 보틀 ──
  { name: "데이오프 텀블러\n그레이 / 500ml", desc: "텀블러", size: "500ml", weight: "-", price: 37500, cal: "-", serving: "-", image: "/products/tumbler.jpg", flavor: false, maxF: 0, sub: "tumbler-acc" },
  { name: "투고 텀블러\n화이트 / 360ml", desc: "텀블러", size: "360ml", weight: "-", price: 39900, cal: "-", serving: "-", image: "/products/tumbler.jpg", flavor: false, maxF: 0, sub: "tumbler-acc" },

  // ── 우산 ──
  { name: "BR 투명 우산", desc: "우산", size: "1개", weight: "-", price: 4900, cal: "-", serving: "-", image: "/products/umbrella.jpg", flavor: false, maxF: 0, sub: "tumbler-acc" },

  // ── 모자 ──
  { name: "47브랜드 모자 (핑크)", desc: "모자", size: "Free", weight: "-", price: 35000, cal: "-", serving: "-", image: "/products/cap.jpg", flavor: false, maxF: 0, sub: "tumbler-acc" },
  { name: "47브랜드 모자 (키즈)", desc: "모자", size: "키즈", weight: "-", price: 35000, cal: "-", serving: "-", image: "/products/cap.jpg", flavor: false, maxF: 0, sub: "tumbler-acc" },
  { name: "47브랜드 모자 (네이비)", desc: "모자", size: "Free", weight: "-", price: 35000, cal: "-", serving: "-", image: "/products/cap.jpg", flavor: false, maxF: 0, sub: "tumbler-acc" },

  // ── 브랜드 굿즈 ──
  { name: "BR 브랜드북", desc: "브랜드 굿즈", size: "1권", weight: "-", price: 31000, cal: "-", serving: "-", image: "/products/brand-goods.jpg", flavor: false, maxF: 0, sub: "brand" },
  { name: "BR 아이스크림 스쿱", desc: "브랜드 굿즈", size: "1개", weight: "-", price: 25000, cal: "-", serving: "-", image: "/products/brand-goods.jpg", flavor: false, maxF: 0, sub: "brand" },

  // ── 향 제품 (그립톡 / 방향제) ──
  { name: "복숭아 그립톡", desc: "그립톡", size: "1개", weight: "-", price: 12000, cal: "-", serving: "-", image: "/products/griptok.jpg", flavor: false, maxF: 0, sub: "scent" },
  { name: "레몬 그립톡", desc: "그립톡", size: "1개", weight: "-", price: 12000, cal: "-", serving: "-", image: "/products/griptok.jpg", flavor: false, maxF: 0, sub: "scent" },
  { name: "딸기 그립톡", desc: "그립톡", size: "1개", weight: "-", price: 12000, cal: "-", serving: "-", image: "/products/griptok.jpg", flavor: false, maxF: 0, sub: "scent" },
  { name: "망고 그립톡", desc: "그립톡", size: "1개", weight: "-", price: 12000, cal: "-", serving: "-", image: "/products/griptok.jpg", flavor: false, maxF: 0, sub: "scent" },
  { name: "페어향 실내 방향제", desc: "방향제", size: "1개", weight: "-", price: 21000, cal: "-", serving: "-", image: "/products/air-freshener.jpg", flavor: false, maxF: 0, sub: "scent" },
  { name: "애플향 실내 방향제", desc: "방향제", size: "1개", weight: "-", price: 21000, cal: "-", serving: "-", image: "/products/air-freshener.jpg", flavor: false, maxF: 0, sub: "scent" },
  { name: "피치향 실내 방향제", desc: "방향제", size: "1개", weight: "-", price: 21000, cal: "-", serving: "-", image: "/products/air-freshener.jpg", flavor: false, maxF: 0, sub: "scent" },

  // ── 파티 / 장식 ──
  { name: "아이콘 케이크토퍼\n(SET)", desc: "파티 장식", size: "1세트", weight: "-", price: 21000, cal: "-", serving: "-", image: "/products/cake-topper.jpg", flavor: false, maxF: 0, sub: "party-deco" },
  { name: "파티 타임\n후루츠 가랜드", desc: "파티 장식", size: "1세트", weight: "-", price: 26000, cal: "-", serving: "-", image: "/products/cake-topper.jpg", flavor: false, maxF: 0, sub: "party-deco" },
  { name: "오브제캔들 (트리)", desc: "캔들", size: "1개", weight: "-", price: 13000, cal: "-", serving: "-", image: "/products/cake-topper.jpg", flavor: false, maxF: 0, sub: "party-deco" },
  { name: "오브제캔들 (별)", desc: "캔들", size: "1개", weight: "-", price: 13000, cal: "-", serving: "-", image: "/products/cake-topper.jpg", flavor: false, maxF: 0, sub: "party-deco" },

  // ── 기타 소품 ──
  { name: "폭죽카드 (일러스트)", desc: "기타 소품", size: "1개", weight: "-", price: 8600, cal: "-", serving: "-", image: "/products/party-cracker.jpg", flavor: false, maxF: 0, sub: "party-deco" },
  { name: "폭죽카드 (패턴)", desc: "기타 소품", size: "1개", weight: "-", price: 8600, cal: "-", serving: "-", image: "/products/party-cracker.jpg", flavor: false, maxF: 0, sub: "party-deco" },
  { name: "썸머 후르츠\n지비츠 세트", desc: "기타 소품", size: "1세트", weight: "-", price: 44000, cal: "-", serving: "-", image: "/products/hair-clip.jpg", flavor: false, maxF: 0, sub: "party-deco" },
  { name: "체리 집게핀", desc: "기타 소품", size: "1개", weight: "-", price: 24500, cal: "-", serving: "-", image: "/products/hair-clip.jpg", flavor: false, maxF: 0, sub: "party-deco" },
  { name: "레몬 집게핀", desc: "기타 소품", size: "1개", weight: "-", price: 24500, cal: "-", serving: "-", image: "/products/hair-clip.jpg", flavor: false, maxF: 0, sub: "party-deco" },
  { name: "수박 집게핀", desc: "기타 소품", size: "1개", weight: "-", price: 24500, cal: "-", serving: "-", image: "/products/hair-clip.jpg", flavor: false, maxF: 0, sub: "party-deco" },
  { name: "오렌지 집게핀", desc: "기타 소품", size: "1개", weight: "-", price: 24500, cal: "-", serving: "-", image: "/products/hair-clip.jpg", flavor: false, maxF: 0, sub: "party-deco" },
])

// ─── Combine all products ─────────────────────────────────
export const products: Product[] = [
  ...eventProducts,
  ...workshopProducts,
  ...coneCupProducts,
  ...packableProducts,
  ...cakeProducts,
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
  // ── 추천 (12) ──
  { id: "jjonkkuret", name: "진정한 쫀꾸렛", image: "/flavors/진정한쫀꾸렛_0.png", color: "hsl(30,40%,75%)", categoryId: "recommended", description: "쫀득한 초콜릿과 바삭한 크런치의 진정한 만���", badge: "이달의 맛" },
  { id: "alien-mom", name: "엄마는 외계인", image: "/flavors/엄마는외계인_0.png", color: "hsl(280,50%,75%)", categoryId: "recommended", description: "알록달록 솜사탕과 쿠키의 신비로운 우주 맛", badge: "1위" },
  { id: "almond-bonbon", name: "아몬드봉봉", image: "/flavors/아몬드봉봉_수정_0.png", color: "hsl(25,35%,72%)", categoryId: "recommended", description: "고소한 아몬드와 달콤한 봉봉의 만남", badge: "2위" },
  { id: "mint-choco-chip", name: "민트 초콜릿칩", image: "/flavors/민트초콜릿칩_0.png", color: "hsl(160,50%,75%)", categoryId: "recommended", description: "시원한 민트와 달콤한 초코칩의 조화", badge: "3위" },
  { id: "rainbow-sherbet", name: "레인보우 샤베트", image: "/flavors/레인보우샤베트_0.png", color: "hsl(40,80%,80%)", categoryId: "recommended", description: "다채로운 과일 맛의 상큼한 샤베트", badge: "과일 섬유질 포함" },
  { id: "ny-cheesecake", name: "뉴욕 치즈케이크", image: "/flavors/뉴욕치즈케이크_0.png", color: "hsl(45,50%,82%)", categoryId: "recommended", description: "진한 뉴욕 스타일 치즈케이크의 깊은 맛", badge: "5위" },
  { id: "jjonddeok-heukimja", name: "쫀떡 만난 흑임자", image: "/flavors/쫀떡만난흑임자_0.png", color: "hsl(0,0%,35%)", categoryId: "recommended", description: "고소한 흑임자와 쫄깃한 쫀떡의 전통 조화", badge: "NEW" },
  { id: "ice-hotteok", name: "아이스 호떡", image: "/flavors/아이스호떡_1.png", color: "hsl(35,55%,60%)", categoryId: "recommended", description: "달콤한 호떡의 따뜻한 맛을 아이스크림으로", badge: "NEW" },
  { id: "bam-goguma", name: "밤이 옥수로 맛있구마", image: "/flavors/밤이 옥수로 맛있구마.png", color: "hsl(35,60%,55%)", categoryId: "recommended", description: "고구마, 밤, 옥수수의 고소한 가을 맛", badge: "NEW" },
  { id: "honey-mochi", name: "말랑 꿀떡 모찌", image: "/flavors/말랑꿀떡모찌_0.png", color: "hsl(42,50%,78%)", categoryId: "recommended", description: "꿀떡 모찌의 말랑말랑 달콤한 맛", badge: "NEW" },
  { id: "berry-berry-strawberry", name: "베리베리 스트로베리", image: "/flavors/베리베리스트로베리_0.png", color: "hsl(340,60%,78%)", categoryId: "recommended", description: "딸기의 상큼함을 가득 담은 베리 맛", badge: null },
  { id: "love-strawberry", name: "사랑에 빠진 딸기", image: "/flavors/사랑에빠진딸기_1.png", color: "hsl(345,60%,75%)", categoryId: "recommended", description: "딸기와 초콜릿이 치즈케이크에 반해버린 사랑의 맛", badge: null },

  // ── 과일 ──
  { id: "golden-apple-yogurt", name: "골든애플 요거트", image: "/flavors/골든애플 요거트.png", color: "hsl(45,70%,75%)", categoryId: "fruit", description: "달콤한 사과와 상큼한 요거트의 조화", badge: null },
  { id: "strawberry-gelato", name: "딸기 젤라또", image: "/flavors/딸기젤라또누끼_0.png", color: "hsl(345,65%,70%)", categoryId: "fruit", description: "신선한 딸기로 만든 이탈리안 젤라또", badge: null },
  { id: "merong-melon", name: "메롱 멜론", image: "/flavors/메롱멜론_1.png", color: "hsl(130,50%,70%)", categoryId: "fruit", description: "달콤한 멜론의 상큼한 맛", badge: null },
  { id: "berry-good", name: "베리굿", image: "/flavors/베리굿_0.png", color: "hsl(340,55%,65%)", categoryId: "fruit", description: "다양한 베리의 상큼한 조화", badge: null },
  { id: "wind-away", name: "바람과 함께 사라지다", image: "/flavors/바람과함께사라지다_0.png", color: "hsl(270,50%,80%)", categoryId: "fruit", description: "부드럽게 사라지는 솜사탕의 달콤함", badge: null },
  { id: "wonderland-cotton", name: "이상한 나라의 솜사탕", image: "/flavors/이상한나라의솜사탕_1.png", color: "hsl(300,50%,80%)", categoryId: "fruit", description: "동화 속 솜사탕처럼 달콤하고 몽환적인 맛", badge: null },
  { id: "orange-sherbet", name: "오렌지 샤베트", image: "/flavors/오렌지샤베트50802_1.png", color: "hsl(25,80%,70%)", categoryId: "fruit", description: "상큼한 오렌지의 시원한 샤베트", badge: null },
  { id: "strawberry-choco-chip", name: "스트로베리 초콜릿칩", image: "/flavors/스트로베리초콜릿칩.png", color: "hsl(345,55%,72%)", categoryId: "fruit", description: "딸기와 초콜릿칩의 달콤한 조합", badge: null },
  { id: "strawberry-cream", name: "스트로베리 앤 크림", image: "/flavors/스트로베리앤크림_1.png", color: "hsl(348,60%,78%)", categoryId: "fruit", description: "딸기와 크림의 클래식 조합", badge: null },
  { id: "apple-mint", name: "애플민트", image: "/flavors/애플민트.png", color: "hsl(140,45%,72%)", categoryId: "fruit", description: "사과와 민트의 상쾌한 조화", badge: null },
  { id: "peach-yogurt", name: "피치 요거트", image: "/flavors/피치요거트-100x86px_0.png", color: "hsl(20,70%,82%)", categoryId: "fruit", description: "복숭아와 요거트의 상큼한 조화", badge: null },
  { id: "pink-berry-matcha", name: "핑크베리 말차", image: "/flavors/핑크베리말차(수정)_0.png", color: "hsl(340,45%,72%)", categoryId: "fruit", description: "핑크베리와 말차의 조화로운 맛", badge: null },
  { id: "dogok-maesil", name: "도곡동 매실 이야기", image: "/flavors/도곡동매실이야기_0.png", color: "hsl(90,40%,65%)", categoryId: "fruit", description: "달콤새콤한 매실의 이야기", badge: null },
  { id: "dino-jelly", name: "디노젤리", image: "/flavors/디노젤리누끼_0.png", color: "hsl(120,50%,70%)", categoryId: "fruit", description: "말랑말랑 디노 젤리의 달콤한 맛", badge: null },

  // ── 초콜릿 ──
  { id: "chocolate", name: "초콜릿", image: "/flavors/초콜릿_1.png", color: "hsl(20,50%,40%)", categoryId: "chocolate", description: "진하고 부드러운 클래식 초콜릿의 맛", badge: null },
  { id: "choco-mousse", name: "초콜릿 무스", image: "/flavors/초콜릿무스_0.png", color: "hsl(15,40%,25%)", categoryId: "chocolate", description: "부드럽고 진한 초콜릿 무스의 맛", badge: null },
  { id: "choco-poki-hae", name: "초코포키해", image: "/flavors/초코포키해_0.png", color: "hsl(18,45%,42%)", categoryId: "chocolate", description: "초코와 포키의 달콤한 만남", badge: null },
  { id: "brownie-jubilee", name: "브라우니 쥬빌레", image: "/flavors/(W)브라우니쥬빌레_1.png", color: "hsl(15,35%,38%)", categoryId: "chocolate", description: "촉촉한 브라우니 쥬빌레의 깊은 맛", badge: null },
  { id: "chocolaccio-bonbon", name: "쇼콜라치오 봉봉", image: "/flavors/(W)쇼콜라치오봉봉_1.png", color: "hsl(20,40%,35%)", categoryId: "chocolate", description: "고급 쇼콜라치오 봉봉의 풍미", badge: null },
  { id: "cheese-brownie", name: "치즈가 브러우니", image: "/flavors/치즈가브러우니_0.png", color: "hsl(25,45%,45%)", categoryId: "chocolate", description: "치즈와 브러우니의 풍성한 만남", badge: null },
  { id: "truffle-icecream", name: "트러플 아이스크림", image: "/flavors/트러플아이스크림_0.png", color: "hsl(15,30%,35%)", categoryId: "chocolate", description: "고급 트러플의 진한 풍미", badge: null },

  // ── 우유/치즈/과자 ──
  { id: "oreo-cookies-cream", name: "오레오 쿠키 앤 크림", image: "/flavors/오레오쿠키앤크림(BR)_0.png", color: "hsl(0,0%,50%)", categoryId: "milk-cheese", description: "바삭한 오레오 쿠키와 부드러운 크림의 조화", badge: null },
  { id: "yogurt", name: "요거트", image: "/flavors/요거트_0.png", color: "hsl(50,20%,92%)", categoryId: "milk-cheese", description: "상큼하고 부드러운 요거트", badge: null },
  { id: "salt-milk", name: "소금 우유", image: "/flavors/소금우유_0.png", color: "hsl(45,30%,90%)", categoryId: "milk-cheese", description: "은은한 소금과 부드러운 우유의 조화", badge: null },
  { id: "banana-pudding-cake", name: "바나나 푸딩 케이크", image: "/flavors/바나나푸딩케이크_0.png", color: "hsl(48,65%,75%)", categoryId: "milk-cheese", description: "바나나 푸딩과 케이크의 달콤한 맛", badge: null },
  { id: "cream-cheese-tart", name: "크림 치즈 타르트", image: "/flavors/크림치즈타르트_0.png", color: "hsl(40,40%,85%)", categoryId: "milk-cheese", description: "부드러운 크림치즈 타르트의 풍미", badge: null },
  { id: "blue-vanilla-brulee", name: "블루 바닐라 브륄레", image: "/flavors/블루바닐라브륄레_0.png", color: "hsl(210,50%,78%)", categoryId: "milk-cheese", description: "블루 바닐라와 브륄레의 달콤한 조화", badge: null },
  { id: "shooting-star", name: "뉴 슈팅스타", image: "/flavors/뉴슈팅스타_1.png", color: "hsl(220,60%,80%)", categoryId: "milk-cheese", description: "반짝이는 캔디 조각의 달콤한 맛", badge: null },
  { id: "ice-melon-bread", name: "아이스 메론빵", image: "/flavors/아이스메론빵_0.png", color: "hsl(80,50%,72%)", categoryId: "milk-cheese", description: "메론빵의 달콤함을 아이스크림으로", badge: null },
  { id: "i-want-you", name: "아이원츄", image: "/flavors/아이원츄플레이버_0.png", color: "hsl(340,50%,75%)", categoryId: "milk-cheese", description: "달콤하고 사랑스러운 맛", badge: null },
  { id: "ice-jjoripong", name: "아이스 죠리퐁", image: "/flavors/아이스죠리퐁플레이버_0.png", color: "hsl(40,55%,70%)", categoryId: "milk-cheese", description: "죠리퐁의 바삭한 맛을 아이스크림으로", badge: null },
  { id: "wasabi", name: "와사비맛", image: "/flavors/와사비맛(수정1)_0.png", color: "hsl(100,40%,60%)", categoryId: "milk-cheese", description: "톡 쏘는 와사비의 독특한 맛", badge: null },
  { id: "polar-bear", name: "북극곰 폴라베어", image: "/flavors/북극곰폴라베어.png", color: "hsl(200,30%,88%)", categoryId: "milk-cheese", description: "북극곰처럼 시원한 맛", badge: null },

  // ── 커피/카라멜/티 ──
  { id: "jamoca-almond-fudge", name: "자모카 아몬드 훠지", image: "/flavors/자모카아몬드훠지50112_0.png", color: "hsl(20,40%,40%)", categoryId: "coffee-caramel", description: "커피 아이스크림에 아몬드와 초콜릿 퍼지의 조화", badge: null },
  { id: "mocha-tiramisu", name: "모카 티라미수", image: "/flavors/모카티라미수_0.png", color: "hsl(25,35%,42%)", categoryId: "coffee-caramel", description: "모카와 티라미수의 진한 풍미", badge: null },
  { id: "neoneun-cham-dalgona", name: "너는 참 달고나", image: "/flavors/너는참달고나_0.png", color: "hsl(35,55%,65%)", categoryId: "coffee-caramel", description: "달콤한 달고나의 풍미", badge: null },
  { id: "golden-praline-butter", name: "골든 프랄린 버터", image: "/flavors/골든프랄린버터_1.png", color: "hsl(38,50%,60%)", categoryId: "coffee-caramel", description: "골든 프랄린과 버터의 고소한 맛", badge: null },
  { id: "winter-bam", name: "윈터밤", image: "/flavors/윈터밤_1.png", color: "hsl(30,40%,50%)", categoryId: "coffee-caramel", description: "겨울 밤의 따뜻하고 고소한 맛", badge: null },
  { id: "creme-de-marron", name: "크렘드 마롱", image: "/flavors/크렘드마롱_0.png", color: "hsl(28,42%,52%)", categoryId: "coffee-caramel", description: "프렌치 마롱 크림의 달콤한 맛", badge: null },
  { id: "earl-grey-orange", name: "얼그레이 오렌지", image: "/flavors/(W)얼그레이오렌지_0.png", color: "hsl(30,50%,65%)", categoryId: "coffee-caramel", description: "얼그레이와 오렌지의 향긋한 조화", badge: null },
  { id: "green-tea-earl-grey", name: "그린티 얼그레이", image: "/flavors/(W)그린티얼그레이_0.png", color: "hsl(120,35%,65%)", categoryId: "coffee-caramel", description: "그린티와 얼그레이의 깊은 풍미", badge: null },
  { id: "green-tea-orange-jasmine", name: "그린티 오렌지 자스민", image: "/flavors/(W)그린티오렌지자스민_0.png", color: "hsl(110,40%,68%)", categoryId: "coffee-caramel", description: "그린티, 오렌지, 자스민의 향긋한 조화", badge: null },
  { id: "green-tea-caramel", name: "그린티 카라멜", image: "/flavors/(W)그린티카라멜_0.png", color: "hsl(115,35%,60%)", categoryId: "coffee-caramel", description: "그린티와 카라멜의 달콤한 조화", badge: null },

  // ── 바닐라/민트 ──
  { id: "green-tea", name: "그린티", image: "/flavors/그린티_0.png", color: "hsl(120,40%,70%)", categoryId: "vanilla-mint", description: "진한 녹차의 깊은 풍미", badge: null },
  { id: "vanilla", name: "바닐라", image: "/flavors/바닐라_0.png", color: "hsl(50,60%,90%)", categoryId: "vanilla-mint", description: "클래식 바닐라의 부드러운 맛", badge: null },
  { id: "green-tea-cookie-monster", name: "그린티 쿠키몬스터", image: "/flavors/그린티쿠키몬스터_0.png", color: "hsl(125,45%,65%)", categoryId: "vanilla-mint", description: "그린티와 쿠키의 즐거운 만남", badge: null },
  { id: "vanilla-gelato", name: "바닐라 젤라또", image: "/flavors/바닐라젤라또_0.png", color: "hsl(48,55%,88%)", categoryId: "vanilla-mint", description: "이탈리안 바닐라 젤라또의 부드러움", badge: null },
  { id: "lessly-mint-choco", name: "Lessly Edition 민트초코", image: "/flavors/LesslyEdition_민트초코_1.png", color: "hsl(160,50%,68%)", categoryId: "vanilla-mint", description: "레슬리 에디션 민트초코의 특별한 맛", badge: null },
  { id: "lessly-choforest", name: "레슬리 초숲", image: "/flavors/레슬리초숲HS_1.png", color: "hsl(130,40%,55%)", categoryId: "vanilla-mint", description: "레슬리 초콜릿 숲의 깊은 풍미", badge: null },

  // ── 곡물/견과류 ──
  { id: "pistachio-almond", name: "피스타치오 아몬드", image: "/flavors/피스타치오 아몬드.png", color: "hsl(90,30%,65%)", categoryId: "grain-nut", description: "고소한 피스타치오와 아몬드의 풍미", badge: null },
  { id: "pistachio-gelato", name: "피스타치오 젤라또", image: "/flavors/피스타치오젤라또_0.png", color: "hsl(85,35%,60%)", categoryId: "grain-nut", description: "이탈리안 피스타치오 젤라또의 고소함", badge: null },
  { id: "injeolmi", name: "인절미", image: "/flavors/BR_플레이버-인절미-182X158px_0.png", color: "hsl(40,35%,75%)", categoryId: "grain-nut", description: "고소한 인절미의 전통 맛", badge: null },
  { id: "hongsi", name: "홍시", image: "/flavors/BR_플레이버-홍시-182X158px_0.png", color: "hsl(15,70%,55%)", categoryId: "grain-nut", description: "달콤한 홍시의 자연스러운 맛", badge: null },
  { id: "goguma-gelato", name: "고구마 젤라또", image: "/flavors/고구마젤라또_0.png", color: "hsl(35,60%,55%)", categoryId: "grain-nut", description: "달콤한 고구마 젤라또의 구수한 맛", badge: null },
  { id: "dubai-alien-mom", name: "두바이에서 온 엄마는 외계인", image: "/flavors/두바이에서온엄마는외계인_수정_0.png", color: "hsl(45,55%,65%)", categoryId: "grain-nut", description: "두바이에서 온 특별한 엄마는 외계인", badge: null },
  { id: "cherry-jubilee", name: "체리 쥬빌레", image: "/flavors/체리쥬빌레(플레이버1)_0.png", color: "hsl(340,50%,70%)", categoryId: "fruit", description: "달콤한 체리의 풍성한 맛", badge: null },
  { id: "yogurt-gelato", name: "요거트 젤라또", image: "/flavors/요거트젤라또_0.png", color: "hsl(50,25%,90%)", categoryId: "milk-cheese", description: "상큼한 요거트 젤라또의 맛", badge: null },
  { id: "tiramisu-gelato", name: "티라미수 젤라또", image: "/flavors/티라미수젤라또_0.png", color: "hsl(25,35%,55%)", categoryId: "coffee-caramel", description: "이탈리안 티라미수 젤라또의 진한 맛", badge: null },
  { id: "lessly-almond-bonbon", name: "Lessly Edition 아몬드봉봉", image: "/flavors/LesslyEdition_아몬드봉봉_1.png", color: "hsl(28,38%,68%)", categoryId: "grain-nut", description: "레슬리 에디션 아몬드봉봉의 고소한 맛", badge: null },
  { id: "lessly-alien-mom", name: "Lessly Edition 엄마는 외계인", image: "/flavors/LesslyEdition_엄마는외계인_1.png", color: "hsl(280,45%,72%)", categoryId: "grain-nut", description: "레슬리 에디션 엄마는 외계인의 특별한 맛", badge: null },
  { id: "lessly-chocolate", name: "Lessly Edition 초콜릿", image: "/flavors/LesslyEdition_초콜릿_1.png", color: "hsl(20,45%,38%)", categoryId: "chocolate", description: "레슬리 에디션 초콜릿의 진한 맛", badge: null },
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
    title: "모바일 교환권 / ��폰 / 기프티콘",
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

// Ranked best-seller product names in order of expected purchase likelihood
// Mixing across all categories -- the order IS the ranking
const RANKED_BEST_SELLERS: string[] = [
  // #1-3: Ice cream scoops are the core business
  "싱글레귤러",
  "더블레귤러",
  "이달의 더블주니어",
  // #4-6: Workshop specials drive seasonal traffic
  "모찌 바람과\n함께 사라지다",
  "두바이 스타일\n초콜릿쿠키",
  "카페 아포가토",
  // #7-8: Beverages are high-margin impulse buys
  "망고 패션후르츠\n블라스트",
  "아메리카노",
  // #9-10: Packable ice cream for take-home
  "파인트",
  "쿼터",
  // #11-13: Cakes for celebrations
  "레드하트\n시트론 보울",
  "더 듬뿍 딸기\n우유 케이크",
  "화이트 스트로베리\n페스티벌",
  // #14-15: Coffee & beverage add-ons
  "카페라떼",
  "피치요거트\n블라스트",
  // #16-17: Gelato premium option
  "젤라또 싱글",
  "젤라또 더블",
  // #18-19: Dessert accompaniments
  "브라우니 아 라 모드",
  "크루아상 와플",
  // #20-21: Workshop extras
  "마카롱\n피스타치오 아몬드",
  "바닐라라떼",
  // #22-23: Prepack take-home
  "아이스 모찌 6개입",
  "아이스 모찌 10개입",
  // #24: Family size
  "패밀리",
]

export function getRankedRecommendations(): Product[] {
  const ranked: Product[] = []
  const usedIds = new Set<string>()

  // Add products in ranked order
  for (const name of RANKED_BEST_SELLERS) {
    const found = products.find((p) => p.name === name && !usedIds.has(p.id))
    if (found) {
      ranked.push(found)
      usedIds.add(found.id)
    }
  }

  return ranked
}

// Shuffle for "AI가 추천하는 오늘의 조합" -- re-rank with randomization
export function shuffleRankedRecommendations(): Product[] {
  const base = getRankedRecommendations()
  return [...base].sort(() => Math.random() - 0.5)
}

// Get the category filter list for the recommended page
export function getRecommendedFilterCategories(): { id: string; name: string }[] {
  const recCats = categories.filter(
    (c) => c.id !== "event" && c.id !== "ai-pick" && c.id !== "party"
  )
  return recCats.map((c) => ({ id: c.id, name: c.name.replace("\n", " ") }))
}
