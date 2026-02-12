import { writeFileSync } from "fs"

// Category definitions with their product templates
const categoryTemplates = {
  event: {
    items: [
      { name: "베리굿 스페셜", desc: "딸기 아이스크림", size: "스페셜 에디션", weight: "500g", price: 15900, cal: "300~500 kcal", img: "/products/family.jpg", flavor: true, maxF: 3 },
      { name: "윈터 스페셜", desc: "초코 아이스크림", size: "스페셜 에디션", weight: "500g", price: 15900, cal: "350~550 kcal", img: "/products/pint.jpg", flavor: true, maxF: 3 },
      { name: "봄날 세트", desc: "봄 시즌 한정", size: "레귤러", weight: "400g", price: 12900, cal: "280~450 kcal", img: "/products/quarter.jpg", flavor: true, maxF: 2 },
      { name: "썸머 쿨 팩", desc: "여름 한정판", size: "레귤러", weight: "600g", price: 19800, cal: "350~600 kcal", img: "/products/pack-4.jpg", flavor: true, maxF: 4 },
      { name: "할로윈 스페셜", desc: "호박맛 아이스크림", size: "스페셜", weight: "500g", price: 16500, cal: "320~500 kcal", img: "/products/half-gallon.jpg", flavor: true, maxF: 3 },
      { name: "크리스마스 세트", desc: "홀리데이 에디션", size: "라지", weight: "800g", price: 25900, cal: "450~700 kcal", img: "/products/pack-6.jpg", flavor: true, maxF: 5 },
      { name: "발렌타인 하트", desc: "하트 모양 케이크", size: "미디엄", weight: "450g", price: 18900, cal: "300~480 kcal", img: "/products/cake-heart.jpg", flavor: false, maxF: 0 },
      { name: "어린이날 팩", desc: "키즈 세트", size: "레귤러", weight: "350g", price: 11900, cal: "250~400 kcal", img: "/products/pack-4.jpg", flavor: true, maxF: 3 },
      { name: "스프링 블로썸", desc: "벚꽃 에디션", size: "레귤러", weight: "400g", price: 13500, cal: "280~430 kcal", img: "/products/pint.jpg", flavor: true, maxF: 2 },
      { name: "가을 단풍 세트", desc: "가을 시즌", size: "레귤러", weight: "500g", price: 14900, cal: "300~480 kcal", img: "/products/quarter.jpg", flavor: true, maxF: 3 },
    ],
    extraNames: ["피크닉 세트", "패밀리 파티팩", "커플 세트", "미니 파티", "골든 에디션", "실버 에디션", "브론즈 세트", "딜럭스 팩", "프리미엄 세트", "로열 에디션", "한정 스페셜A", "한정 스페셜B", "시즌 콜라보A", "시즌 콜라보B", "아트 에디션A", "아트 에디션B", "별빛 세트", "달빛 세트", "뮤직 에디션", "무비 에디션"],
    extraImg: ["/products/family.jpg", "/products/pint.jpg", "/products/quarter.jpg", "/products/half-gallon.jpg", "/products/pack-4.jpg", "/products/pack-6.jpg"],
    extraPrice: [12900, 14900, 15900, 16500, 18900, 19800, 22900, 25900],
  },
  workshop: {
    items: [
      { name: "나만의 아이스크림", desc: "DIY 체험", size: "1인 체험", weight: "300g", price: 15000, cal: "200~350 kcal", img: "/products/workshop.jpg", flavor: true, maxF: 3 },
      { name: "케이크 만들기", desc: "DIY 케이크", size: "1인 체험", weight: "500g", price: 25000, cal: "400~600 kcal", img: "/products/cake-round.jpg", flavor: true, maxF: 4 },
      { name: "아이스크림 타코", desc: "DIY 타코", size: "1인분", weight: "250g", price: 12000, cal: "200~300 kcal", img: "/products/waffle.jpg", flavor: true, maxF: 2 },
      { name: "선데 만들기", desc: "DIY 선데", size: "1인분", weight: "350g", price: 14000, cal: "300~450 kcal", img: "/products/sundae.jpg", flavor: true, maxF: 2 },
      { name: "모찌 체험", desc: "DIY 모찌", size: "6개", weight: "180g", price: 16000, cal: "200~350 kcal", img: "/products/mochi.jpg", flavor: true, maxF: 3 },
      { name: "마카롱 만들기", desc: "DIY 마카롱", size: "4개", weight: "200g", price: 18000, cal: "250~400 kcal", img: "/products/macarons.jpg", flavor: true, maxF: 2 },
      { name: "와플 체험", desc: "DIY 와플", size: "1인분", weight: "300g", price: 13000, cal: "280~420 kcal", img: "/products/waffle.jpg", flavor: true, maxF: 2 },
      { name: "젤라또 체험", desc: "DIY 젤라또", size: "1인분", weight: "250g", price: 14500, cal: "220~380 kcal", img: "/products/gelato-cup.jpg", flavor: true, maxF: 2 },
    ],
    extraNames: ["파르페 만들기", "쿠키 체험", "초콜릿 체험", "캔디 체험", "브라우니 체험", "팬케이크 체험", "크레페 체험", "도넛 체험", "타르트 체험", "파이 체험", "쉐이크 만들기", "스무디 만들기", "프라페 체험", "밀크셰이크 체험", "아포가토 체험", "크림브륄레 체험", "수플레 체험", "티라미수 체험", "뚜레주르 콜라보", "카페 콜라보", "키즈 체험A", "키즈 체험B"],
    extraImg: ["/products/workshop.jpg", "/products/sundae.jpg", "/products/waffle.jpg", "/products/gelato-cup.jpg", "/products/mochi.jpg", "/products/macarons.jpg"],
    extraPrice: [12000, 13000, 14000, 14500, 15000, 16000, 18000, 20000, 22000, 25000],
  },
  "cone-cup": {
    items: [
      { name: "싱글 레귤러", desc: "콘", size: "레귤러", weight: "120g", price: 3900, cal: "150~280 kcal", img: "/products/cone-single.jpg", flavor: true, maxF: 1 },
      { name: "더블 레귤러", desc: "콘", size: "레귤러", weight: "240g", price: 6800, cal: "300~520 kcal", img: "/products/cone-double.jpg", flavor: true, maxF: 2 },
      { name: "싱글 킹", desc: "콘", size: "킹", weight: "180g", price: 5200, cal: "230~380 kcal", img: "/products/cone-single.jpg", flavor: true, maxF: 1 },
      { name: "더블 킹", desc: "콘", size: "킹", weight: "360g", price: 8900, cal: "450~720 kcal", img: "/products/cone-double.jpg", flavor: true, maxF: 2 },
      { name: "싱글 레귤러 컵", desc: "컵", size: "레귤러", weight: "120g", price: 3900, cal: "150~280 kcal", img: "/products/cup-single.jpg", flavor: true, maxF: 1 },
      { name: "더블 레귤러 컵", desc: "컵", size: "레귤러", weight: "240g", price: 6800, cal: "300~520 kcal", img: "/products/cup-single.jpg", flavor: true, maxF: 2 },
      { name: "싱글 킹 컵", desc: "컵", size: "킹", weight: "180g", price: 5200, cal: "230~380 kcal", img: "/products/cup-single.jpg", flavor: true, maxF: 1 },
      { name: "더블 킹 컵", desc: "컵", size: "킹", weight: "360g", price: 8900, cal: "450~720 kcal", img: "/products/cup-single.jpg", flavor: true, maxF: 2 },
      { name: "트리플 레귤러", desc: "콘", size: "레귤러", weight: "360g", price: 9500, cal: "450~780 kcal", img: "/products/cone-double.jpg", flavor: true, maxF: 3 },
      { name: "트리플 킹", desc: "콘", size: "킹", weight: "540g", price: 12800, cal: "680~1100 kcal", img: "/products/cone-double.jpg", flavor: true, maxF: 3 },
    ],
    extraNames: ["와플콘 싱글", "와플콘 더블", "슈가콘 싱글", "슈가콘 더블", "초코콘 싱글", "초코콘 더블", "트리플 레귤러 컵", "트리플 킹 컵", "미니 싱글", "미니 더블", "미니 트리플", "점보 싱글", "점보 더블", "프리미엄 싱글", "프리미엄 더블", "프리미엄 트리플", "키즈 싱글", "키즈 더블", "시즌 싱글", "시즌 더블"],
    extraImg: ["/products/cone-single.jpg", "/products/cone-double.jpg", "/products/cup-single.jpg"],
    extraPrice: [3900, 4500, 5200, 5900, 6800, 7500, 8900, 9500, 10800, 12800],
  },
  "icecream-cake": {
    items: [
      { name: "해피 버스데이", desc: "원형 케이크", size: "1호 (15cm)", weight: "500g", price: 28000, cal: "1200~1800 kcal", img: "/products/cake-round.jpg", flavor: false, maxF: 0 },
      { name: "러브 하트", desc: "하트 케이크", size: "하트형", weight: "500g", price: 32000, cal: "1200~1800 kcal", img: "/products/cake-heart.jpg", flavor: false, maxF: 0 },
      { name: "캐릭터 케이크", desc: "귀여운 캐릭터", size: "1호", weight: "600g", price: 35000, cal: "1400~2000 kcal", img: "/products/cake-character.jpg", flavor: false, maxF: 0 },
      { name: "프리미엄 케이크", desc: "프리미엄", size: "2호 (18cm)", weight: "800g", price: 42000, cal: "1800~2500 kcal", img: "/products/cake-round.jpg", flavor: false, maxF: 0 },
      { name: "미니 케이크", desc: "미니 사이즈", size: "미니 (10cm)", weight: "300g", price: 18000, cal: "800~1200 kcal", img: "/products/cake-round.jpg", flavor: false, maxF: 0 },
      { name: "초코 블리스", desc: "초콜릿 케이크", size: "1호", weight: "550g", price: 30000, cal: "1300~1900 kcal", img: "/products/cake-character.jpg", flavor: false, maxF: 0 },
      { name: "베리 가든", desc: "베리 케이크", size: "1호", weight: "550g", price: 30000, cal: "1300~1900 kcal", img: "/products/cake-heart.jpg", flavor: false, maxF: 0 },
      { name: "레인보우 케이크", desc: "레인보우", size: "1호", weight: "550g", price: 33000, cal: "1300~1950 kcal", img: "/products/cake-round.jpg", flavor: false, maxF: 0 },
    ],
    extraNames: ["스페셜 2호", "스페셜 3호", "판타지 케이크", "드림 케이크", "스타 케이크", "엔젤 케이크", "꽃다발 케이크", "리본 케이크", "프린세스 케이크", "프린스 케이크", "골드 케이크", "실버 케이크", "크리스탈 케이크", "마블 케이크", "모카 케이크", "녹차 케이크", "바닐라 케이크", "카라멜 케이크", "민트초코 케이크", "딸기 케이크", "망고 케이크", "블루베리 케이크"],
    extraImg: ["/products/cake-round.jpg", "/products/cake-heart.jpg", "/products/cake-character.jpg"],
    extraPrice: [18000, 22000, 25000, 28000, 30000, 32000, 35000, 38000, 42000, 48000],
  },
  bingsu: {
    items: [
      { name: "딸기 빙수", desc: "딸기 토핑", size: "레귤러", weight: "400g", price: 12900, cal: "350~500 kcal", img: "/products/bingsu.jpg", flavor: false, maxF: 0 },
      { name: "망고 빙수", desc: "망고 토핑", size: "레귤러", weight: "400g", price: 12900, cal: "330~480 kcal", img: "/products/bingsu-mango.jpg", flavor: false, maxF: 0 },
      { name: "팥 빙수", desc: "전통 팥 토핑", size: "레귤러", weight: "450g", price: 11900, cal: "380~550 kcal", img: "/products/bingsu.jpg", flavor: false, maxF: 0 },
      { name: "초코 빙수", desc: "초콜릿 토핑", size: "레귤러", weight: "400g", price: 12900, cal: "400~580 kcal", img: "/products/bingsu-mango.jpg", flavor: false, maxF: 0 },
      { name: "녹차 빙수", desc: "녹차 토핑", size: "레귤러", weight: "400g", price: 12900, cal: "340~480 kcal", img: "/products/bingsu.jpg", flavor: false, maxF: 0 },
      { name: "인절미 빙수", desc: "인절미 토핑", size: "레귤러", weight: "420g", price: 11900, cal: "360~520 kcal", img: "/products/bingsu-mango.jpg", flavor: false, maxF: 0 },
      { name: "오레오 빙수", desc: "오레오 토핑", size: "레귤러", weight: "400g", price: 13500, cal: "400~600 kcal", img: "/products/bingsu.jpg", flavor: false, maxF: 0 },
      { name: "블루베리 빙수", desc: "블루베리 토핑", size: "레귤러", weight: "400g", price: 13500, cal: "330~480 kcal", img: "/products/bingsu-mango.jpg", flavor: false, maxF: 0 },
    ],
    extraNames: ["체리 빙수", "복숭아 빙수", "수박 빙수", "멜론 빙수", "포도 빙수", "키위 빙수", "코코넛 빙수", "바나나 빙수", "자몽 빙수", "레몬 빙수", "라임 빙수", "패션후르츠 빙수", "유자 빙수", "피스타치오 빙수", "캬라멜 빙수", "티라미수 빙수", "쿠키앤크림 빙수", "브라우니 빙수", "치즈케이크 빙수", "흑임자 빙수", "콩가루 빙수", "고구마 빙수"],
    extraImg: ["/products/bingsu.jpg", "/products/bingsu-mango.jpg"],
    extraPrice: [11900, 12500, 12900, 13500, 13900, 14500, 14900, 15500],
  },
  coffee: {
    items: [
      { name: "아메리카노", desc: "아이스/레귤러", size: "레귤러", weight: "350ml", price: 3500, cal: "5~10 kcal", img: "/products/americano.jpg", flavor: false, maxF: 0 },
      { name: "카페라떼", desc: "아이스/레귤러", size: "레귤러", weight: "350ml", price: 4500, cal: "120~180 kcal", img: "/products/cafe-latte.jpg", flavor: false, maxF: 0 },
      { name: "카푸치노", desc: "핫", size: "레귤러", weight: "300ml", price: 4500, cal: "110~170 kcal", img: "/products/cafe-latte.jpg", flavor: false, maxF: 0 },
      { name: "바닐라 라떼", desc: "아이스/핫", size: "레귤러", weight: "350ml", price: 5000, cal: "180~250 kcal", img: "/products/cafe-latte.jpg", flavor: false, maxF: 0 },
      { name: "카라멜 마키아또", desc: "아이스/핫", size: "레귤러", weight: "350ml", price: 5500, cal: "200~280 kcal", img: "/products/cafe-latte.jpg", flavor: false, maxF: 0 },
      { name: "모카 라떼", desc: "아이스/핫", size: "레귤러", weight: "350ml", price: 5000, cal: "220~300 kcal", img: "/products/cafe-latte.jpg", flavor: false, maxF: 0 },
      { name: "콜드브루", desc: "아이스", size: "레귤러", weight: "350ml", price: 4500, cal: "5~10 kcal", img: "/products/americano.jpg", flavor: false, maxF: 0 },
      { name: "에스프레소", desc: "핫", size: "싱글", weight: "30ml", price: 3000, cal: "2~5 kcal", img: "/products/americano.jpg", flavor: false, maxF: 0 },
    ],
    extraNames: ["더블 에스프레소", "아포가토", "헤이즐넛 라떼", "녹차 라떼", "고구마 라떼", "밀크티 라떼", "로얄 밀크티", "흑당 라떼", "돌체 라떼", "연유 라떼", "타로 라떼", "초코 라떼", "민트 모카", "화이트 모카", "아인슈페너", "플랫 화이트", "코르타도", "롱블랙", "디카페인 아메리카노", "디카페인 라떼", "꿀 라떼", "계피 라떼"],
    extraImg: ["/products/americano.jpg", "/products/cafe-latte.jpg"],
    extraPrice: [3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500],
  },
  beverage: {
    items: [
      { name: "딸기 연유 블라스트", desc: "블렌디드", size: "레귤러", weight: "400ml", price: 6500, cal: "280~350 kcal", img: "/products/strawberry-blast.jpg", flavor: false, maxF: 0 },
      { name: "망고 패션 블라스트", desc: "블렌디드", size: "레귤러", weight: "400ml", price: 6500, cal: "260~320 kcal", img: "/products/smoothie.jpg", flavor: false, maxF: 0 },
      { name: "초코 블라스트", desc: "블렌디드", size: "레귤러", weight: "400ml", price: 6500, cal: "320~400 kcal", img: "/products/smoothie.jpg", flavor: false, maxF: 0 },
      { name: "민트초코 블라스트", desc: "블렌디드", size: "레귤러", weight: "400ml", price: 6500, cal: "300~380 kcal", img: "/products/smoothie.jpg", flavor: false, maxF: 0 },
      { name: "피치요거트 스무디", desc: "스무디", size: "레귤러", weight: "400ml", price: 6000, cal: "240~300 kcal", img: "/products/smoothie.jpg", flavor: false, maxF: 0 },
      { name: "블루베리 스무디", desc: "스무디", size: "레귤러", weight: "400ml", price: 6000, cal: "230~290 kcal", img: "/products/smoothie.jpg", flavor: false, maxF: 0 },
      { name: "키위 레모네이드", desc: "에이드", size: "레귤러", weight: "350ml", price: 5500, cal: "180~250 kcal", img: "/products/strawberry-blast.jpg", flavor: false, maxF: 0 },
      { name: "자몽 에이드", desc: "에이드", size: "레귤러", weight: "350ml", price: 5500, cal: "170~230 kcal", img: "/products/strawberry-blast.jpg", flavor: false, maxF: 0 },
    ],
    extraNames: ["청포도 에이드", "레몬 에이드", "패션프루트 에이드", "라임 에이드", "애플 에이드", "체리 블라스트", "바나나 블라스트", "코코넛 블라스트", "오레오 블라스트", "쿠키앤크림 블라스트", "카라멜 블라스트", "녹차 블라스트", "자색고구마 스무디", "아보카도 스무디", "베리 스무디", "트로피컬 스무디", "요거트 스무디", "그래놀라 스무디", "밀크쉐이크 바닐라", "밀크쉐이크 초코", "밀크쉐이크 딸기", "아이스티 복숭아"],
    extraImg: ["/products/strawberry-blast.jpg", "/products/smoothie.jpg"],
    extraPrice: [5000, 5500, 6000, 6500, 7000, 7500],
  },
  gelato: {
    items: [
      { name: "피스타치오 젤라또", desc: "이탈리안 스타일", size: "레귤러", weight: "150g", price: 6500, cal: "200~300 kcal", img: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
      { name: "다크초코 젤라또", desc: "이탈리안 스타일", size: "레귤러", weight: "150g", price: 6500, cal: "220~320 kcal", img: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
      { name: "레몬 소르베", desc: "상큼한 소르베", size: "레귤러", weight: "150g", price: 6000, cal: "120~180 kcal", img: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
      { name: "망고 소르베", desc: "열대과일 소르베", size: "레귤러", weight: "150g", price: 6000, cal: "130~190 kcal", img: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
      { name: "티라미수 젤라또", desc: "이탈리안 스타일", size: "레귤러", weight: "150g", price: 7000, cal: "240~340 kcal", img: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
      { name: "카라멜 젤라또", desc: "이탈리안 스타일", size: "레귤러", weight: "150g", price: 6500, cal: "210~310 kcal", img: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
      { name: "헤이즐넛 젤라또", desc: "이탈리안 스타일", size: "레귤러", weight: "150g", price: 6500, cal: "220~320 kcal", img: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
      { name: "바닐라 빈 젤라또", desc: "프리미엄", size: "레귤러", weight: "150g", price: 7000, cal: "200~290 kcal", img: "/products/gelato-cup.jpg", flavor: false, maxF: 0 },
    ],
    extraNames: ["스트라치아텔라", "노칠라 젤라또", "코코넛 젤라또", "라즈베리 소르베", "패션프루트 소르베", "라벤더 젤라또", "아마레또 젤라또", "에스프레소 젤라또", "쿠키 젤라또", "브라우니 젤라또", "마스카포네 젤라또", "리코타 젤라또", "프로마주 블랑", "잔두야 젤라또", "피오르 디 라떼", "스페큘러스 젤라또", "캐러멜 시솔트", "얼그레이 젤라또", "말차 젤라또", "유자 소르베", "청포도 소르베", "로즈마리 소르베"],
    extraImg: ["/products/gelato-cup.jpg"],
    extraPrice: [6000, 6500, 7000, 7500, 8000],
  },
  dessert: {
    items: [
      { name: "아이스 마카롱", desc: "6개입", size: "6개", weight: "180g", price: 12000, cal: "350~500 kcal", img: "/products/macarons.jpg", flavor: false, maxF: 0 },
      { name: "아이스 모찌", desc: "6개입", size: "6개", weight: "180g", price: 10000, cal: "300~450 kcal", img: "/products/mochi.jpg", flavor: false, maxF: 0 },
      { name: "와플 선데", desc: "와플+아이스크림", size: "1인분", weight: "300g", price: 8900, cal: "400~580 kcal", img: "/products/waffle.jpg", flavor: true, maxF: 2 },
      { name: "브라우니 선데", desc: "브라우니+아이스크림", size: "1인분", weight: "280g", price: 8500, cal: "420~600 kcal", img: "/products/sundae.jpg", flavor: true, maxF: 1 },
      { name: "초코 선데", desc: "초콜릿 소스", size: "레귤러", weight: "250g", price: 7500, cal: "350~500 kcal", img: "/products/sundae.jpg", flavor: true, maxF: 1 },
      { name: "딸기 선데", desc: "딸기 소스", size: "레귤러", weight: "250g", price: 7500, cal: "320~460 kcal", img: "/products/sundae.jpg", flavor: true, maxF: 1 },
      { name: "바나나 스플릿", desc: "바나나+아이스크림", size: "1인분", weight: "350g", price: 9500, cal: "450~650 kcal", img: "/products/sundae.jpg", flavor: true, maxF: 3 },
      { name: "크레페 아이스크림", desc: "크레페", size: "1인분", weight: "280g", price: 8900, cal: "380~550 kcal", img: "/products/waffle.jpg", flavor: true, maxF: 2 },
    ],
    extraNames: ["미니 와플", "더블 초코 선데", "카라멜 선데", "쿠키 선데", "아포가토 선데", "프렌치토스트 세트", "팬케이크 세트", "츄러스 세트", "타르트", "에클레어", "슈크림", "크림브륄레", "초코퐁듀 세트", "과일 파르페", "초코 파르페", "요거트 파르페", "그래놀라 파르페", "마롱 파르페", "미니 도넛 세트", "쁘띠 케이크", "미니 타르트 세트", "초코볼 세트"],
    extraImg: ["/products/macarons.jpg", "/products/mochi.jpg", "/products/waffle.jpg", "/products/sundae.jpg"],
    extraPrice: [6500, 7500, 8000, 8500, 8900, 9500, 10000, 12000],
  },
  prepack: {
    items: [
      { name: "아이스바 초코", desc: "초콜릿 코팅", size: "1개", weight: "70g", price: 2500, cal: "180~250 kcal", img: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
      { name: "아이스바 딸기", desc: "딸기맛", size: "1개", weight: "70g", price: 2500, cal: "170~240 kcal", img: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
      { name: "미니컵 바닐라", desc: "미니 사이즈", size: "1개", weight: "100g", price: 3000, cal: "150~220 kcal", img: "/products/cup-single.jpg", flavor: false, maxF: 0 },
      { name: "미니컵 초코", desc: "미니 사이즈", size: "1개", weight: "100g", price: 3000, cal: "160~240 kcal", img: "/products/cup-single.jpg", flavor: false, maxF: 0 },
      { name: "아이스바 민트초코", desc: "민트초코 코팅", size: "1개", weight: "70g", price: 2500, cal: "180~260 kcal", img: "/products/prepack-bar.jpg", flavor: false, maxF: 0 },
      { name: "미니컵 세트 4개", desc: "4개 세트", size: "4개", weight: "400g", price: 10000, cal: "600~880 kcal", img: "/products/pack-4.jpg", flavor: false, maxF: 0 },
      { name: "미니컵 세트 6개", desc: "6개 세트", size: "6개", weight: "600g", price: 14000, cal: "900~1320 kcal", img: "/products/pack-6.jpg", flavor: false, maxF: 0 },
      { name: "아이스바 세트 8개", desc: "8개 세트", size: "8개", weight: "560g", price: 16000, cal: "1440~2000 kcal", img: "/products/pack-8.jpg", flavor: false, maxF: 0 },
    ],
    extraNames: ["아이스바 카라멜", "아이스바 바닐라", "아이스바 쿠키앤크림", "아이스바 녹차", "아이스바 망고", "미니컵 딸기", "미니컵 녹차", "미니컵 망고", "미니컵 쿠키", "미니컵 카라멜", "콘 세트 4개", "콘 세트 6개", "모찌 바 딸기", "모찌 바 초코", "모찌 바 녹차", "샌드 쿠키 바닐라", "샌드 쿠키 초코", "샌드 쿠키 딸기", "미니바 세트 12개", "미니컵 세트 8개", "프리미엄 바 세트", "스틱바 세트"],
    extraImg: ["/products/prepack-bar.jpg", "/products/cup-single.jpg", "/products/pack-4.jpg", "/products/pack-6.jpg", "/products/pack-8.jpg"],
    extraPrice: [2500, 3000, 3500, 4000, 5000, 10000, 14000, 16000, 18000, 20000],
  },
  party: {
    items: [
      { name: "파티 플레이트 세트", desc: "접시 10개", size: "10개입", weight: "-", price: 5000, cal: "-", img: "/products/party-set.jpg", flavor: false, maxF: 0 },
      { name: "파티 컵 세트", desc: "컵 10개", size: "10개입", weight: "-", price: 4000, cal: "-", img: "/products/party-set.jpg", flavor: false, maxF: 0 },
      { name: "파티 냅킨 세트", desc: "냅킨 20개", size: "20개입", weight: "-", price: 3000, cal: "-", img: "/products/party-set.jpg", flavor: false, maxF: 0 },
      { name: "생일 초 세트", desc: "초 12개", size: "12개입", weight: "-", price: 2500, cal: "-", img: "/products/party-set.jpg", flavor: false, maxF: 0 },
      { name: "파티 풍선 세트", desc: "풍선 10개", size: "10개입", weight: "-", price: 6000, cal: "-", img: "/products/party-set.jpg", flavor: false, maxF: 0 },
      { name: "파티 모자 세트", desc: "모자 6개", size: "6개입", weight: "-", price: 5500, cal: "-", img: "/products/party-set.jpg", flavor: false, maxF: 0 },
      { name: "파티 가랜드", desc: "생일 가랜드", size: "1세트", weight: "-", price: 4500, cal: "-", img: "/products/party-set.jpg", flavor: false, maxF: 0 },
      { name: "파티 올인원 세트", desc: "종합 세트", size: "1세트", weight: "-", price: 15000, cal: "-", img: "/products/party-set.jpg", flavor: false, maxF: 0 },
    ],
    extraNames: ["케이크 토퍼", "파티 포크 세트", "파티 백 세트", "리본 세트", "캔들 홀더", "테이블보", "파티 스티커", "초대장 세트", "감사카드 세트", "포토 프롭스", "번호 초 세트", "알파벳 초", "미니 풍선 세트", "LED 초 세트", "파티 뿔피리", "포장 리본", "선물 상자 소", "선물 상자 중", "선물 상자 대", "아이스팩 소", "아이스팩 대", "보냉백"],
    extraImg: ["/products/party-set.jpg"],
    extraPrice: [2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 8000, 10000, 15000],
  },
}

// Generate products
const allProducts = []
let counter = 0

for (const [catId, template] of Object.entries(categoryTemplates)) {
  // Add the base items (8-10 per category)
  for (const item of template.items) {
    counter++
    allProducts.push({
      id: `${catId}-${counter}`,
      categoryId: catId,
      name: item.name,
      description: item.desc,
      size: item.size,
      weight: item.weight,
      price: item.price,
      calories: item.cal,
      totalServing: item.weight,
      image: item.img,
      requiresFlavor: item.flavor,
      maxFlavors: item.maxF,
    })
  }

  // Fill to 30 using extra names
  const remaining = 30 - template.items.length
  for (let i = 0; i < remaining && i < template.extraNames.length; i++) {
    counter++
    const baseItem = template.items[i % template.items.length]
    const price = template.extraPrice[i % template.extraPrice.length]
    const img = template.extraImg[i % template.extraImg.length]
    allProducts.push({
      id: `${catId}-${counter}`,
      categoryId: catId,
      name: template.extraNames[i],
      description: baseItem.desc,
      size: baseItem.size,
      weight: baseItem.weight,
      price: price,
      calories: baseItem.cal,
      totalServing: baseItem.weight,
      image: img,
      requiresFlavor: baseItem.flavor,
      maxFlavors: baseItem.maxF,
    })
  }
}

// Output as TypeScript
const output = allProducts.map(p =>
  `  {\n    id: "${p.id}",\n    categoryId: "${p.categoryId}",\n    name: "${p.name}",\n    description: "${p.description}",\n    size: "${p.size}",\n    weight: "${p.weight}",\n    price: ${p.price},\n    calories: "${p.calories}",\n    totalServing: "${p.totalServing}",\n    image: "${p.image}",\n    requiresFlavor: ${p.requiresFlavor},\n    maxFlavors: ${p.maxFlavors},\n  }`
).join(",\n")

console.log(`Generated ${allProducts.length} products across ${Object.keys(categoryTemplates).length} categories`)

// Count per category
const counts = {}
for (const p of allProducts) {
  counts[p.categoryId] = (counts[p.categoryId] || 0) + 1
}
console.log("Per category:", JSON.stringify(counts, null, 2))

writeFileSync("generated-products.txt", output, "utf8")
console.log("Written to generated-products.txt")
