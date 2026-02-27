# BR Kiosk API 상세 가이드

## 목차

1. [개요](#1-개요)
2. [인증 및 보안](#2-인증-및-보안)
3. [공통 응답 형식](#3-공통-응답-형식)
4. [API 엔드포인트](#4-api-엔드포인트)
5. [데이터베이스 스키마](#5-데이터베이스-스키마)
6. [에러 코드](#6-에러-코드)

---

## 1. 개요

### 1.1 API 기본 정보

| 항목 | 값 |
|------|-----|
| Base URL | `https://api.br-kiosk.com/v1` |
| 프로토콜 | HTTPS only |
| 데이터 형식 | JSON |
| 인코딩 | UTF-8 |
| 인증 방식 | API Key + JWT Token |

### 1.2 키오스크 식별

모든 요청에 키오스크 식별 정보 포함:

```
Headers:
  X-Kiosk-ID: "KIOSK-001"
  X-Store-ID: "STORE-GANGNAM-01"
  X-Device-Type: "kiosk-portrait" | "kiosk-landscape" | "mobile"
```

---

## 2. 인증 및 보안

### 2.1 API 키 인증

```http
GET /api/v1/products
Authorization: Bearer {API_KEY}
X-Kiosk-ID: KIOSK-001
```

### 2.2 키오스크 등록

```http
POST /api/v1/kiosk/register
Content-Type: application/json

{
  "store_id": "STORE-GANGNAM-01",
  "device_serial": "SN-123456789",
  "device_type": "kiosk-portrait"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "kiosk_id": "KIOSK-001",
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 86400
  }
}
```

---

## 3. 공통 응답 형식

### 3.1 성공 응답

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-15T09:30:00Z",
    "request_id": "req-abc123"
  }
}
```

### 3.2 에러 응답

```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "상품을 찾을 수 없습니다",
    "details": { "product_id": "invalid-id" }
  },
  "meta": {
    "timestamp": "2024-01-15T09:30:00Z",
    "request_id": "req-abc123"
  }
}
```

### 3.3 페이지네이션

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total_items": 301,
    "total_pages": 16
  }
}
```

---

## 4. API 엔드포인트

### 4.1 카테고리 (Categories)

#### 전체 카테고리 조회

```http
GET /api/v1/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "bingsu",
      "display_name": "빙수",
      "sort_order": 1,
      "is_special": false,
      "icon_url": "/icons/bingsu.png",
      "subcategory_filters": []
    },
    {
      "id": "cone-cup",
      "display_name": "콘/컵",
      "sort_order": 3,
      "is_special": false,
      "icon_url": "/icons/cone-cup.png",
      "subcategory_filters": []
    },
    {
      "id": "packable-icecream",
      "display_name": "포장가능\n아이스크림",
      "sort_order": 4,
      "is_special": false,
      "icon_url": "/icons/packable.png",
      "subcategory_filters": [
        { "filter_id": "all", "display_name": "전체", "sort_order": 0 },
        { "filter_id": "pint", "display_name": "파인트", "sort_order": 1 },
        { "filter_id": "quarter", "display_name": "쿼터", "sort_order": 2 }
      ]
    }
  ]
}
```

---

### 4.2 상품 (Products)

#### 카테고리별 상품 목록

```http
GET /api/v1/products?category_id={category_id}&subcategory={filter_id}&page={page}&per_page={per_page}
```

**Query Parameters:**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| category_id | string | Y | 카테고리 ID |
| subcategory | string | N | 서브카테고리 필터 ID (기본: "all") |
| page | number | N | 페이지 번호 (기본: 1) |
| per_page | number | N | 페이지당 항목 수 (기본: 12) |
| order_type | string | N | "takeout" \| "dine-in" (가용성 필터링) |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cone-cup-1",
      "category_id": "cone-cup",
      "name": "싱글레귤러",
      "description": "1가지 맛",
      "size": "레귤러",
      "weight": "105g",
      "price": 3800,
      "calories": "200~350 kcal",
      "total_serving": "105g",
      "image_url": "/products/콘컵/싱글레귤러_0.png",
      "requires_flavor": true,
      "max_flavors": 1,
      "tag": null,
      "subcategory": null,
      "availability": "both",
      "required_options": [
        { "group_id": "serving-type", "label": "콘/컵 선택" }
      ],
      "is_soldout": false,
      "stock_quantity": 999
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 12,
    "total_items": 6,
    "total_pages": 1
  }
}
```

#### 상품 상세 조회

```http
GET /api/v1/products/{product_id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cone-cup-1",
    "category_id": "cone-cup",
    "name": "싱글레귤러",
    "description": "1가지 맛",
    "size": "레귤러",
    "weight": "105g",
    "price": 3800,
    "calories": "200~350 kcal",
    "total_serving": "105g",
    "image_url": "/products/콘컵/싱글레귤러_0.png",
    "requires_flavor": true,
    "max_flavors": 1,
    "tag": null,
    "subcategory": null,
    "availability": "both",
    "required_options": [
      {
        "group_id": "serving-type",
        "label": "콘/컵 선택",
        "options": [
          { "id": "cone", "name": "콘", "price_add": 0 },
          { "id": "cup", "name": "컵", "price_add": 0 },
          { "id": "dish", "name": "디쉬", "price_add": 0 }
        ]
      }
    ],
    "optional_groups": [
      {
        "id": "topping1",
        "name": "토핑1",
        "type": "multi",
        "options": [
          { "id": "choco-ball", "name": "초코볼", "price_add": 500, "has_quantity": true }
        ]
      }
    ],
    "nutrition_info": {
      "calories": "200~350",
      "protein": "5g",
      "fat": "12g",
      "carbs": "28g"
    },
    "allergens": ["우유", "계란"]
  }
}
```

---

### 4.3 맛 (Flavors)

#### 전체 맛 목록

```http
GET /api/v1/flavors?category_id={category_id}
```

**Query Parameters:**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| category_id | string | N | 맛 카테고리 ID (기본: "all") |

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      { "id": "all", "display_name": "전체", "sort_order": 0 },
      { "id": "recommended", "display_name": "추천", "sort_order": 1 },
      { "id": "fruit", "display_name": "과일", "sort_order": 2 }
    ],
    "flavors": [
      {
        "id": "strawberry-icecream",
        "name": "스트로베리 아이스크림",
        "image_url": "/flavors/스트로베리 아이스크림.png",
        "color": "hsl(350, 80%, 70%)",
        "category_id": "fruit",
        "description": "신선한 딸기의 달콤함",
        "badge": "1위",
        "is_available": true
      }
    ]
  }
}
```

#### 맛 가용성 확인

```http
GET /api/v1/flavors/availability?flavor_ids={id1,id2,id3}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "strawberry-icecream": { "available": true, "stock_level": "high" },
    "choco-mint": { "available": true, "stock_level": "medium" },
    "vanilla": { "available": false, "stock_level": "out" }
  }
}
```

---

### 4.4 옵션 그룹 (Option Groups)

#### 필수 옵션 그룹 조회

```http
GET /api/v1/options/required
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "serving-type",
      "name": "콘/컵 선택",
      "options": [
        { "id": "cone", "name": "콘", "price_add": 0, "icon": "cone" },
        { "id": "cup", "name": "컵", "price_add": 0, "icon": "cup" },
        { "id": "dish", "name": "디쉬", "price_add": 0, "icon": "dish" }
      ]
    },
    {
      "id": "temperature",
      "name": "온도",
      "options": [
        { "id": "ice", "name": "아이스", "price_add": 0, "icon": "snowflake" },
        { "id": "hot", "name": "핫", "price_add": 0, "icon": "steam" }
      ]
    },
    {
      "id": "cup-size",
      "name": "컵 사이즈",
      "options": [
        { "id": "regular", "name": "레귤러", "price_add": 0 },
        { "id": "large", "name": "라지", "price_add": 700 }
      ]
    },
    {
      "id": "bean",
      "name": "원두",
      "options": [
        { "id": "special-edition", "name": "스페셜 에디션", "price_add": 0, "description": "갓 볶은 견과류의 고소함과 진한 여운" },
        { "id": "white-and-blue", "name": "화이트 앤 블루", "price_add": 0, "description": "다크초콜릿 풍미와 묵직한 단맛" },
        { "id": "decaf", "name": "디카페인", "price_add": 0, "description": "카페인 99.9% 제거" }
      ]
    },
    {
      "id": "shot",
      "name": "샷",
      "options": [
        { "id": "no-shot", "name": "추가 안함", "price_add": 0 },
        { "id": "add-shot", "name": "샷 추가", "price_add": 500 }
      ]
    },
    {
      "id": "milk",
      "name": "우유",
      "options": [
        { "id": "regular-milk", "name": "우유", "price_add": 0 },
        { "id": "oat-milk", "name": "오트(귀리) 변경", "price_add": 500 }
      ]
    },
    {
      "id": "cup-type",
      "name": "컵",
      "options": [
        { "id": "regular-cup", "name": "일반컵", "price_add": 0 },
        { "id": "personal-cup", "name": "개인용 컵", "price_add": -300 }
      ]
    }
  ]
}
```

#### 선택 옵션 그룹 (토핑 등)

```http
GET /api/v1/options/optional
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "spoon",
      "display_name": "스푼",
      "type": "single",
      "items": [
        { "id": "no-spoon", "display_name": "필요 없음", "price_add": 0, "has_quantity": false },
        { "id": "spoon-normal", "display_name": "스푼", "price_add": 0, "has_quantity": true, "default_qty": 1, "unit": "개" },
        { "id": "spoon-extra", "display_name": "스푼추가", "price_add": 50, "has_quantity": true, "default_qty": 1, "unit": "개" }
      ]
    },
    {
      "id": "cooling",
      "display_name": "보냉",
      "type": "single",
      "items": [
        { "id": "dry-ice", "display_name": "드라이 아이스", "price_add": 0, "has_quantity": true, "default_qty": 30, "unit": "분" },
        { "id": "no-cooling", "display_name": "필요 없음", "price_add": 0, "has_quantity": false }
      ]
    },
    {
      "id": "topping1",
      "display_name": "토핑1",
      "type": "multi",
      "items": [
        { "id": "choco-ball", "display_name": "초코볼", "price_add": 500, "has_quantity": true, "default_qty": 0, "unit": "개" },
        { "id": "strawberry-top", "display_name": "딸기", "price_add": 0, "has_quantity": true, "default_qty": 0, "unit": "개" }
      ]
    }
  ]
}
```

---

### 4.5 배너 (Banners)

#### 랜딩 페이지 배너 조회

```http
GET /api/v1/banners?placement={placement}
```

**Query Parameters:**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| placement | string | N | "landing" \| "menu" \| "promotion" |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "banner-001",
      "image_url": "/banners/summer-promotion.jpg",
      "alt_text": "여름 빙수 프로모션",
      "link_type": "category",
      "link_target": "bingsu",
      "sort_order": 1,
      "start_date": "2024-06-01",
      "end_date": "2024-08-31",
      "is_active": true
    }
  ]
}
```

---

### 4.6 결제 수단 (Payment Methods)

#### 사용 가능한 결제 수단 조회

```http
GET /api/v1/payment-methods
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "credit-samsung",
      "display_name": "신용카드/삼성페이",
      "icon_keys": ["CreditCard"],
      "sort_order": 1,
      "is_enabled": true
    },
    {
      "id": "easy-pay",
      "display_name": "간편결제",
      "description": "카카오페이, 네이버페이",
      "icon_keys": ["Wallet"],
      "sort_order": 2,
      "is_enabled": true
    }
  ]
}
```

---

### 4.7 할인/적립 (Discounts)

#### 할인/적립 옵션 조회

```http
GET /api/v1/discounts
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "section_id": "one-click",
      "display_name": "원클릭 결제",
      "sort_order": 1,
      "items": [
        { "id": "br-app-pay", "display_name": "배라앱 매장 결제", "discount_amount": null, "icon_key": "Store" }
      ]
    },
    {
      "section_id": "mobile-coupon",
      "display_name": "모바일 교환권 / 쿠폰 / 기프티콘",
      "sort_order": 2,
      "items": [
        { "id": "mobile-voucher", "display_name": "모바일 교환권", "discount_amount": 3900, "icon_key": "Ticket" },
        { "id": "br-app-coupon", "display_name": "배라앱 발급 쿠폰", "discount_amount": null, "icon_key": "Tag" }
      ]
    },
    {
      "section_id": "carrier",
      "display_name": "통신사 멤버십 할인",
      "sort_order": 3,
      "items": [
        { "id": "t-membership", "display_name": "T 멤버십", "discount_amount": null, "icon_key": "Signal" },
        { "id": "kt-membership", "display_name": "KT 멤버십", "discount_amount": null, "icon_key": "Wifi" }
      ]
    }
  ]
}
```

#### 할인 적용 검증

```http
POST /api/v1/discounts/validate
Content-Type: application/json

{
  "discount_id": "mobile-voucher",
  "voucher_code": "GIFT-1234-5678",
  "order_subtotal": 15000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "is_valid": true,
    "discount_amount": 3900,
    "discount_type": "fixed",
    "message": "모바일 교환권이 적용되었습니다"
  }
}
```

---

### 4.8 주문 (Orders)

#### 주문 생성

```http
POST /api/v1/orders
Content-Type: application/json

{
  "kiosk_id": "KIOSK-001",
  "store_id": "STORE-GANGNAM-01",
  "order_type": "dine-in",
  "items": [
    {
      "product_id": "cone-cup-1",
      "quantity": 2,
      "selected_flavors": [
        { "flavor_id": "strawberry-icecream", "sort_order": 1 }
      ],
      "required_selections": [
        { "group_id": "serving-type", "option_id": "cone" }
      ],
      "optional_selections": [
        { "group_id": "topping1", "option_id": "choco-ball", "quantity": 1 }
      ],
      "unit_price": 3800,
      "options_price": 500,
      "line_total": 8600
    }
  ],
  "discounts": [
    { "id": "mobile-voucher", "amount": 3900, "voucher_code": "GIFT-1234-5678" }
  ],
  "subtotal": 8600,
  "total_discount": 3900,
  "final_amount": 4700,
  "payment_method": "credit-samsung"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order_id": "ORD-20240115-001234",
    "order_number": 1234,
    "status": "pending_payment",
    "created_at": "2024-01-15T09:30:00Z",
    "payment_url": "https://pay.example.com/...",
    "qr_code": "data:image/png;base64,..."
  }
}
```

#### 결제 상태 조회

```http
GET /api/v1/orders/{order_id}/payment-status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order_id": "ORD-20240115-001234",
    "status": "paid",
    "paid_at": "2024-01-15T09:31:00Z",
    "receipt_url": "https://receipt.example.com/...",
    "order_number": 1234,
    "estimated_ready_time": "2024-01-15T09:35:00Z"
  }
}
```

#### 주문 상태 값

| 상태 | 설명 |
|------|------|
| `pending_payment` | 결제 대기 중 |
| `paid` | 결제 완료 |
| `preparing` | 제조 중 |
| `ready` | 준비 완료 |
| `completed` | 수령 완료 |
| `cancelled` | 취소됨 |

---

### 4.9 AI 추천 (AI Pick)

#### AI 추천 메뉴 조회

```http
POST /api/v1/ai-pick
Content-Type: application/json

{
  "order_type": "dine-in",
  "preferences": {
    "flavor_categories": ["fruit", "chocolate"],
    "price_range": { "min": 3000, "max": 10000 },
    "exclude_allergens": ["견과류"]
  },
  "weather": {
    "temperature": 28,
    "condition": "sunny"
  },
  "time_of_day": "afternoon"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommended_items": [
      {
        "product_id": "bingsu-1",
        "name": "딸기 빙수",
        "reason": "더운 날씨에 어울리는 시원한 빙수",
        "confidence_score": 0.95
      }
    ],
    "recommended_flavors": [
      {
        "flavor_id": "strawberry-icecream",
        "name": "스트로베리 아이스크림",
        "reason": "과일맛 선호도 기반 추천",
        "confidence_score": 0.88
      }
    ]
  }
}
```

---

## 5. 데이터베이스 스키마

### 5.1 ERD 개요

```
┌─────────────────┐     ┌─────────────────────┐
│   categories    │────<│ subcategory_filters │
└─────────────────┘     └─────────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────┐     ┌─────────────────────┐
│    products     │────<│ product_required_   │
└─────────────────┘     │      options        │
        │               └─────────────────────┘
        │ M:N                     │
        ▼                         ▼
┌─────────────────┐     ┌─────────────────────┐
│ order_items     │     │ required_option_    │
└─────────────────┘     │      groups         │
        │               └─────────────────────┘
        │ M:N
        ▼
┌─────────────────┐     ┌─────────────────────┐
│    flavors      │────<│  flavor_categories  │
└─────────────────┘     └─────────────────────┘

┌─────────────────┐     ┌─────────────────────┐
│ option_groups   │────<│   option_items      │
└─────────────────┘     └─────────────────────┘

┌─────────────────┐     ┌─────────────────────┐
│     orders      │────<│    order_items      │
└─────────────────┘     └─────────────────────┘
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
            ┌───────────┐ ┌───────┐ ┌─────────┐
            │order_item_│ │order_ │ │order_   │
            │ _flavors  │ │item_  │ │item_    │
            └───────────┘ │options│ │required │
                          └───────┘ └─────────┘
```

### 5.2 주요 테이블 정의

#### categories
```sql
CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  display_name VARCHAR(100) NOT NULL,
  sort_order INT NOT NULL,
  is_special BOOLEAN DEFAULT FALSE,
  icon_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### products
```sql
CREATE TABLE products (
  id VARCHAR(100) PRIMARY KEY,
  category_id VARCHAR(50) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description VARCHAR(500),
  size VARCHAR(100),
  weight VARCHAR(50),
  price INT NOT NULL,
  calories VARCHAR(50),
  total_serving VARCHAR(50),
  image_url VARCHAR(255),
  requires_flavor BOOLEAN DEFAULT FALSE,
  max_flavors INT DEFAULT 0,
  tag VARCHAR(50),
  subcategory VARCHAR(50),
  availability ENUM('both', 'takeout-only', 'dine-in-only') DEFAULT 'both',
  is_soldout BOOLEAN DEFAULT FALSE,
  stock_quantity INT DEFAULT 999,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

#### flavors
```sql
CREATE TABLE flavors (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  image_url VARCHAR(255),
  color VARCHAR(50),
  category_id VARCHAR(50) NOT NULL,
  description VARCHAR(500),
  badge VARCHAR(50),
  is_available BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES flavor_categories(id)
);
```

#### orders
```sql
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,
  order_number INT NOT NULL,
  kiosk_id VARCHAR(50) NOT NULL,
  store_id VARCHAR(50) NOT NULL,
  order_type ENUM('takeout', 'dine-in') NOT NULL,
  status ENUM('pending_payment', 'paid', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending_payment',
  subtotal INT NOT NULL,
  total_discount INT DEFAULT 0,
  final_amount INT NOT NULL,
  payment_method VARCHAR(50),
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### order_items
```sql
CREATE TABLE order_items (
  id VARCHAR(50) PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(100) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price INT NOT NULL,
  options_price INT DEFAULT 0,
  line_total INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

#### order_item_flavors
```sql
CREATE TABLE order_item_flavors (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_item_id VARCHAR(50) NOT NULL,
  flavor_id VARCHAR(100) NOT NULL,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (order_item_id) REFERENCES order_items(id),
  FOREIGN KEY (flavor_id) REFERENCES flavors(id)
);
```

#### order_item_options
```sql
CREATE TABLE order_item_options (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_item_id VARCHAR(50) NOT NULL,
  group_id VARCHAR(50) NOT NULL,
  option_id VARCHAR(50) NOT NULL,
  quantity INT DEFAULT 1,
  price_add INT DEFAULT 0,
  FOREIGN KEY (order_item_id) REFERENCES order_items(id)
);
```

---

## 6. 에러 코드

### 6.1 공통 에러 코드

| 코드 | HTTP | 설명 |
|------|------|------|
| `UNAUTHORIZED` | 401 | 인증 실패 |
| `FORBIDDEN` | 403 | 권한 없음 |
| `NOT_FOUND` | 404 | 리소스를 찾을 수 없음 |
| `VALIDATION_ERROR` | 400 | 요청 데이터 유효성 검증 실패 |
| `INTERNAL_ERROR` | 500 | 서버 내부 오류 |

### 6.2 비즈니스 에러 코드

| 코드 | HTTP | 설명 |
|------|------|------|
| `PRODUCT_NOT_FOUND` | 404 | 상품을 찾을 수 없음 |
| `PRODUCT_SOLDOUT` | 400 | 품절된 상품 |
| `FLAVOR_UNAVAILABLE` | 400 | 선택한 맛 품절 |
| `INVALID_FLAVOR_COUNT` | 400 | 맛 선택 개수 초과/미달 |
| `REQUIRED_OPTION_MISSING` | 400 | 필수 옵션 미선택 |
| `INVALID_VOUCHER` | 400 | 유효하지 않은 교환권/쿠폰 |
| `VOUCHER_EXPIRED` | 400 | 만료된 교환권/쿠폰 |
| `PAYMENT_FAILED` | 400 | 결제 실패 |
| `ORDER_NOT_FOUND` | 404 | 주문을 찾을 수 없음 |
| `ORDER_ALREADY_PAID` | 400 | 이미 결제된 주문 |
| `KIOSK_NOT_REGISTERED` | 401 | 등록되지 않은 키오스크 |

---

## 7. WebSocket 이벤트 (실시간 통신)

### 7.1 연결

```javascript
const ws = new WebSocket('wss://api.br-kiosk.com/v1/ws?kiosk_id=KIOSK-001');
```

### 7.2 이벤트 타입

#### 주문 상태 변경
```json
{
  "event": "order_status_changed",
  "data": {
    "order_id": "ORD-20240115-001234",
    "order_number": 1234,
    "status": "ready",
    "message": "주문하신 메뉴가 준비되었습니다"
  }
}
```

#### 재고 업데이트
```json
{
  "event": "stock_updated",
  "data": {
    "type": "flavor",
    "id": "vanilla",
    "is_available": false
  }
}
```

#### 키오스크 설정 변경
```json
{
  "event": "config_updated",
  "data": {
    "reload_products": true,
    "reload_banners": true
  }
}
```

---

## 8. 버전 히스토리

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0.0 | 2024-01-15 | 초기 API 문서 작성 |

---

## 9. 연락처

- API 기술 지원: api-support@br-kiosk.com
- 긴급 장애 신고: 1588-XXXX
