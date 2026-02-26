# BR Kiosk Design System

## Overview

This document describes the complete design system for the BR (Baskin-Robbins) Kiosk application. All design tokens, component specifications, and usage guidelines are defined here for designer-developer handoff.

---

## Files

| File | Purpose |
|------|---------|
| `/lib/design-system.ts` | TypeScript design tokens (colors, typography, spacing, etc.) |
| `/app/globals.css` | CSS custom properties (design tokens as CSS variables) |
| `/tailwind.config.ts` | Tailwind CSS configuration extending design tokens |
| `/components/kiosk/ui/index.tsx` | Shared UI primitive components |

---

## 1. Colors

### Brand Colors

| Token | Value | HSL | Usage |
|-------|-------|-----|-------|
| `--primary` | #E84073 | `338 80% 55%` | Primary brand pink - CTAs, prices, active states |
| `--primary-light` | #FDF2F5 | `338 80% 96%` | Light pink backgrounds, accents |
| `--primary-dark` | #C73561 | `338 80% 45%` | Hover/pressed states |

### Semantic Colors

| Token | Value | HSL | Usage |
|-------|-------|-----|-------|
| `--background` | #F5F5F5 | `0 0% 96%` | Page background |
| `--foreground` | #202530 | `220 15% 15%` | Primary text |
| `--card` | #FFFFFF | `0 0% 100%` | Card/surface background |
| `--muted` | #EEEFF2 | `220 10% 94%` | Muted backgrounds |
| `--muted-foreground` | #6B7280 | `220 10% 46%` | Secondary text |
| `--border` | #DFE1E6 | `220 13% 89%` | Borders, dividers |
| `--panel` | #F6F6FA | `240 20% 97%` | Panel backgrounds (action bars, bottom sheets) |

### Feedback Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--success` | `142 76% 36%` | Success states |
| `--warning` | `38 92% 50%` | Warning states |
| `--destructive` | `0 84% 60%` | Error states |
| `--info` | `199 89% 48%` | Information states |

---

## 2. Typography

### Font Family

```
NanumSquareNeo, system-ui, sans-serif
```

Weights available: 300 (Light), 400 (Regular), 700 (Bold), 800 (ExtraBold), 900 (Heavy)

### Font Size Scale

| Size | Pixels | Usage |
|------|--------|-------|
| `2xs` | 8px | Micro labels |
| `xs` | 9px | Small labels, badges, step indicators |
| `sm` | 10px | Body small, captions, card labels |
| `base` | 11px | Body text, descriptions |
| `md` | 12px | Emphasized body, section titles |
| `lg` | 13px | Subheadings |
| `xl` | 14px | Headings, button text |
| `2xl` | 16px | Large headings |
| `3xl` | 18px | Section titles |
| `4xl` | 20px | Page titles |
| `5xl` | 24px | Hero text |

### Pre-composed Text Styles (Tailwind Classes)

```css
/* Headings */
.heading-xl  → text-[20px] font-bold leading-tight
.heading-lg  → text-[16px] font-bold leading-tight
.heading-md  → text-[14px] font-bold leading-tight
.heading-sm  → text-[12px] font-bold leading-tight

/* Body */
.body-lg     → text-[12px] font-medium leading-normal
.body-md     → text-[11px] font-normal leading-normal
.body-sm     → text-[10px] font-normal leading-relaxed

/* Labels */
.label-lg    → text-[11px] font-bold leading-tight
.label-md    → text-[10px] font-medium leading-tight
.label-sm    → text-[9px] font-medium leading-tight

/* Prices */
.price-xl    → text-[18px] font-extrabold text-primary
.price-lg    → text-[14px] font-bold text-primary
.price-md    → text-[12px] font-bold text-primary
.price-sm    → text-[10px] font-bold text-primary
```

---

## 3. Spacing

### Base Scale (4px grid)

| Token | Value |
|-------|-------|
| `0.5` | 2px |
| `1` | 4px |
| `1.5` | 6px |
| `2` | 8px |
| `2.5` | 10px |
| `3` | 12px |
| `3.5` | 14px |
| `4` | 16px |
| `5` | 20px |
| `6` | 24px |
| `8` | 32px |

### Semantic Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--space-screen` | 12px | Horizontal screen padding (`px-3`) |
| `--space-card` | 14px | Card internal padding (`p-3.5`) |
| `--space-section` | 16px | Gap between sections (`gap-4`) |
| `--space-item` | 10px | Gap between list items (`gap-2.5`) |

---

## 4. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Subtle rounding |
| `--radius-md` | 8px | Inputs, thumbnails |
| `--radius-lg` | 12px | Cards, buttons (default) |
| `--radius-xl` | 16px | Large cards, modals |
| `--radius-2xl` | 20px | Hero elements |
| `--radius-full` | 9999px | Pills, badges, avatars |

### Semantic Usage

| Element | Radius |
|---------|--------|
| Buttons | `rounded-xl` (12px) |
| Cards | `rounded-xl` (12px) |
| Badges/Pills | `rounded-full` |
| Inputs | `rounded-md` (8px) |
| Modals/Sheets | `rounded-xl` (16px) |
| Thumbnails | `rounded-md` (8px) |

---

## 5. Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Cards, buttons |
| `shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1)` | Hover states |
| `shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1)` | Dropdowns |
| `shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1)` | Modals |

---

## 6. Component Specifications

### Action Buttons (CTAs)

```
Height: 48px (h-12)
Border Radius: 12px (rounded-xl)
Font: 14px bold

Primary:   bg-primary text-primary-foreground
Secondary: bg-muted text-foreground
```

**Tailwind:**
```jsx
// Primary
<button className="h-12 rounded-xl bg-primary text-primary-foreground text-sm font-bold">

// Secondary  
<button className="h-12 rounded-xl bg-muted text-foreground text-sm font-bold">
```

### Cards

```
Border Radius: 12px (rounded-xl)
Border: 1px solid border
Background: card (white)
Shadow: shadow-sm
```

**Tailwind:**
```jsx
<div className="rounded-xl border border-border bg-card shadow-sm">
```

### Quantity Stepper

```
Container Height: 32px
Button Size: 28px × 28px
Border Radius: full (pill)
Value Font: 12px bold text-primary
```

**Tailwind:**
```jsx
<div className="inline-flex h-8 items-center gap-0.5 rounded-full border border-border bg-card">
  <button className="flex h-7 w-7 items-center justify-center rounded-full">
  <span className="min-w-[28px] text-center text-xs font-bold text-primary">
  <button className="flex h-7 w-7 items-center justify-center rounded-full">
</div>
```

### Remove Button

```
Size: 20px × 20px
Icon Size: 12px
Border Radius: full
Background: foreground/70
```

**Tailwind:**
```jsx
<button className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/70 text-white">
```

### Scroll Indicators

```
Size: 32px × 32px
Border Radius: 12px (rounded-lg)
Border: 1px solid border
Background: card
Shadow: shadow-sm
```

**Tailwind:**
```jsx
<button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card shadow-sm">
```

### Summary Bar

```
Background: card
Padding: 12px horizontal, 8px vertical
Left Label: 11px medium
Right Value: 18px extrabold text-primary
Badge: 20px height, rounded-full, bg-primary
```

**Tailwind:**
```jsx
<div className="flex items-center justify-between bg-card px-3 py-2">
  <div className="flex items-center gap-2">
    <span className="text-[11px] font-medium">주문수량</span>
    <span className="inline-flex h-5 items-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">3</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="text-[11px] font-medium">총 주문금액</span>
    <span className="text-lg font-extrabold text-primary">38,700원</span>
  </div>
</div>
```

### Category Tabs

```
Height: 40px
Font: 10px medium (inactive) / 10px bold (active)
Active Border: 2px bottom, primary color
```

**Tailwind:**
```jsx
// Inactive
<button className="flex h-10 items-center justify-center text-[10px] font-medium text-muted-foreground border-b-2 border-transparent">

// Active
<button className="flex h-10 items-center justify-center text-[10px] font-bold text-primary border-b-2 border-primary">
```

### Panels (Bottom sheets, Action bars)

```
Background: panel (#F6F6FA)
Border: 1px top, border color
Padding: 12px horizontal
```

**Tailwind:**
```jsx
<div className="border-t border-border bg-panel px-3 py-2">
```

### Flavor Pills

```
Height: 24px
Padding: 8px horizontal
Border Radius: full
Image Size: 18px
Font: 9px medium
```

**Tailwind:**
```jsx
<span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2 text-[9px] font-medium">
  <img className="h-[18px] w-[18px] rounded-full">
  <span>바람과 함께 사라지다</span>
</span>
```

---

## 7. Layout

### Kiosk Viewport

```
Logical Width:  480px
Logical Height: 853px
Physical Width:  1080px (standing kiosk)
Physical Height: 1920px (standing kiosk)
DPR: 2.25
```

### Z-Index Scale

| Layer | Z-Index | Usage |
|-------|---------|-------|
| Base | 0 | Default content |
| Dropdown | 10 | Dropdown menus |
| Sticky | 20 | Sticky headers |
| Overlay | 30 | Overlays |
| Modal | 40 | Modals, bottom sheets |
| Popover | 50 | Popovers |
| Tooltip | 60 | Tooltips |

### Common Heights

| Element | Height |
|---------|--------|
| Header (ProgressStepper) | 52px |
| Footer (KioskFooter) | 28px |
| Action Bar | ~100px |
| Category Tabs | 80px (2 rows) |
| Button | 48px |
| Button Small | 40px |

---

## 8. Animations

### Durations

| Token | Value | Usage |
|-------|-------|-------|
| `instant` | 0ms | No animation |
| `fast` | 100ms | Micro-interactions |
| `normal` | 200ms | Standard transitions |
| `slow` | 300ms | Page transitions |
| `slower` | 500ms | Complex animations |

### Easings

| Token | Value | Usage |
|-------|-------|-------|
| `easeIn` | `cubic-bezier(0.4, 0, 1, 1)` | Exit animations |
| `easeOut` | `cubic-bezier(0, 0, 0.2, 1)` | Enter animations |
| `easeInOut` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard transitions |
| `spring` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | Bouncy effects |

### Common Transitions (Tailwind)

```jsx
transition-colors duration-200    // Color changes
transition-transform duration-200 // Scale/move
transition-opacity duration-200   // Fade
transition-all duration-200       // All properties
```

---

## 9. Usage in Code

### Importing Design Tokens

```tsx
import { colors, typography, spacing, radius, components } from '@/lib/design-system'

// Use in styles
const cardBg = colors.semantic.card
const headingStyle = typography.styles["heading-lg"]
```

### Using UI Components

```tsx
import { 
  ActionButton, 
  QuantityStepper, 
  RemoveButton, 
  ScrollIndicators,
  SummaryBar,
  Card,
  Badge,
  Panel,
  Price 
} from '@/components/kiosk/ui'

// Primary button
<ActionButton variant="primary">결제하기</ActionButton>

// Quantity stepper
<QuantityStepper value={2} onChange={setQuantity} />

// Summary bar
<SummaryBar leftValue={3} rightValue="38,700원" />

// Price display
<Price value={5100} size="lg" />
```

---

## 10. Design Checklist

When creating new components or screens, verify:

- [ ] Colors use design tokens (no hardcoded hex values)
- [ ] Typography follows the scale (8-24px range)
- [ ] Spacing uses 4px grid increments
- [ ] Border radius uses semantic values (xl for cards/buttons, full for pills)
- [ ] Shadows use standard levels (sm for cards, xl for modals)
- [ ] Transitions use standard durations (200ms default)
- [ ] Buttons are 48px height with rounded-xl
- [ ] Cards have rounded-xl, border, shadow-sm
- [ ] Panels use bg-panel with border-t
- [ ] Prices use text-primary with appropriate weight

---

## Questions?

Contact the development team for clarification on any design token usage or component specifications.
