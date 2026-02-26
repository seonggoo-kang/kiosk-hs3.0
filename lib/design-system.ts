/**
 * ══════════════════════════════════════════════════════════════════════════════
 * BR KIOSK DESIGN SYSTEM
 * ══════════════════════════════════════════════════════════════════════════════
 * 
 * This file defines the complete design system for the BR Kiosk application.
 * Hand this off to designers for review and modification.
 * 
 * USAGE:
 * - Import tokens: import { colors, spacing, typography } from '@/lib/design-system'
 * - Use with Tailwind: className={`bg-primary ${typography.heading.lg}`}
 * - Reference CSS vars: var(--color-primary)
 * 
 * ══════════════════════════════════════════════════════════════════════════════
 */

// ══════════════════════════════════════════════════════════════════════════════
// 1. COLORS
// ══════════════════════════════════════════════════════════════════════════════

export const colors = {
  // ─── Brand Colors ───
  brand: {
    primary: "hsl(338, 80%, 55%)",      // BR Pink - #E84073
    primaryLight: "hsl(338, 80%, 96%)", // Light pink for accents
    primaryDark: "hsl(338, 80%, 45%)",  // Darker pink for hover states
  },

  // ─── Semantic Colors ───
  semantic: {
    background: "hsl(0, 0%, 96%)",       // Page background - #F5F5F5
    foreground: "hsl(220, 15%, 15%)",    // Primary text - #202530
    card: "hsl(0, 0%, 100%)",            // Card/surface - #FFFFFF
    cardForeground: "hsl(220, 15%, 15%)",
    muted: "hsl(220, 10%, 94%)",         // Muted backgrounds - #EEEFF2
    mutedForeground: "hsl(220, 10%, 46%)", // Secondary text - #6B7280
    border: "hsl(220, 13%, 89%)",        // Borders - #DFE1E6
    panel: "hsl(240, 20%, 97%)",         // Panel background - #F6F6FA
  },

  // ─── Interactive States ───
  interactive: {
    hover: "hsl(338, 80%, 50%)",         // Hover state
    active: "hsl(338, 80%, 45%)",        // Active/pressed state
    disabled: "hsl(220, 10%, 80%)",      // Disabled state
    focus: "hsl(338, 80%, 55%)",         // Focus ring
  },

  // ─── Feedback Colors ───
  feedback: {
    success: "hsl(142, 76%, 36%)",       // Success green
    warning: "hsl(38, 92%, 50%)",        // Warning amber
    error: "hsl(0, 84%, 60%)",           // Error red
    info: "hsl(199, 89%, 48%)",          // Info blue
  },

  // ─── Neutral Palette ───
  neutral: {
    white: "#FFFFFF",
    gray50: "#F9FAFB",
    gray100: "#F3F4F6",
    gray200: "#E5E7EB",
    gray300: "#D1D5DB",
    gray400: "#9CA3AF",
    gray500: "#6B7280",
    gray600: "#4B5563",
    gray700: "#374151",
    gray800: "#1F2937",
    gray900: "#111827",
    black: "#000000",
  },
} as const

// CSS variable mapping for globals.css
export const colorVars = {
  "--color-primary": colors.brand.primary,
  "--color-primary-light": colors.brand.primaryLight,
  "--color-primary-dark": colors.brand.primaryDark,
  "--color-background": colors.semantic.background,
  "--color-foreground": colors.semantic.foreground,
  "--color-card": colors.semantic.card,
  "--color-muted": colors.semantic.muted,
  "--color-border": colors.semantic.border,
  "--color-panel": colors.semantic.panel,
} as const


// ══════════════════════════════════════════════════════════════════════════════
// 2. TYPOGRAPHY
// ══════════════════════════════════════════════════════════════════════════════

export const typography = {
  // ─── Font Family ───
  fontFamily: {
    primary: "'NanumSquareNeo', system-ui, sans-serif",
  },

  // ─── Font Sizes (in px, for kiosk scale) ───
  fontSize: {
    "2xs": "8px",   // Micro labels
    xs: "9px",      // Small labels, badges
    sm: "10px",     // Body small, captions
    base: "11px",   // Body text
    md: "12px",     // Emphasized body
    lg: "13px",     // Subheadings
    xl: "14px",     // Headings
    "2xl": "16px",  // Large headings
    "3xl": "18px",  // Section titles
    "4xl": "20px",  // Page titles
    "5xl": "24px",  // Hero text
  },

  // ─── Font Weights ───
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700,
    extrabold: 800,
    heavy: 900,
  },

  // ─── Line Heights ───
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },

  // ─── Pre-composed Text Styles (Tailwind classes) ───
  styles: {
    // Headings
    "heading-xl": "text-[20px] font-bold leading-tight",
    "heading-lg": "text-[16px] font-bold leading-tight",
    "heading-md": "text-[14px] font-bold leading-tight",
    "heading-sm": "text-[12px] font-bold leading-tight",
    
    // Body
    "body-lg": "text-[12px] font-medium leading-normal",
    "body-md": "text-[11px] font-normal leading-normal",
    "body-sm": "text-[10px] font-normal leading-relaxed",
    
    // Labels
    "label-lg": "text-[11px] font-bold leading-tight",
    "label-md": "text-[10px] font-medium leading-tight",
    "label-sm": "text-[9px] font-medium leading-tight",
    
    // Prices
    "price-xl": "text-[18px] font-extrabold leading-tight text-primary",
    "price-lg": "text-[14px] font-bold leading-tight text-primary",
    "price-md": "text-[12px] font-bold leading-tight text-primary",
    "price-sm": "text-[10px] font-bold leading-tight text-primary",
    
    // Buttons
    "button-lg": "text-[14px] font-bold",
    "button-md": "text-[12px] font-bold",
    "button-sm": "text-[10px] font-bold",
  },
} as const


// ══════════════════════════════════════════════════════════════════════════════
// 3. SPACING
// ══════════════════════════════════════════════════════════════════════════════

export const spacing = {
  // ─── Base Scale (4px grid) ───
  px: "1px",
  0: "0px",
  0.5: "2px",
  1: "4px",
  1.5: "6px",
  2: "8px",
  2.5: "10px",
  3: "12px",
  3.5: "14px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  9: "36px",
  10: "40px",
  12: "48px",
  16: "64px",

  // ─── Semantic Spacing ───
  semantic: {
    screenPadding: "12px",     // p-3, horizontal screen padding
    cardPadding: "14px",       // p-3.5, card internal padding
    sectionGap: "16px",        // gap-4, between sections
    itemGap: "10px",           // gap-2.5, between list items
    inlineGap: "8px",          // gap-2, inline element spacing
    tightGap: "6px",           // gap-1.5, tight spacing
  },
} as const


// ══════════════════════════════════════════════════════════════════════════════
// 4. BORDER RADIUS
// ══════════════════════════════════════════════════════════════════════════════

export const radius = {
  none: "0px",
  sm: "4px",        // rounded-sm - subtle rounding
  md: "8px",        // rounded-md - buttons, inputs
  lg: "12px",       // rounded-lg - cards, modals
  xl: "16px",       // rounded-xl - large cards, CTAs
  "2xl": "20px",    // rounded-2xl - hero elements
  "3xl": "24px",    // rounded-3xl - special elements
  full: "9999px",   // rounded-full - pills, avatars

  // ─── Semantic Radius ───
  semantic: {
    button: "12px",       // rounded-xl - all buttons
    card: "12px",         // rounded-xl - all cards
    badge: "9999px",      // rounded-full - badges, pills
    input: "8px",         // rounded-md - input fields
    modal: "16px",        // rounded-xl - modals, sheets
    thumbnail: "8px",     // rounded-md - product images
  },
} as const


// ══════════════════════════════════════════════════════════════════════════════
// 5. SHADOWS
// ══════════════════════════════════════════════════════════════════════════════

export const shadows = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",

  // ─── Semantic Shadows ───
  semantic: {
    card: "0 1px 2px 0 rgb(0 0 0 / 0.05)",           // shadow-sm
    cardHover: "0 4px 6px -1px rgb(0 0 0 / 0.1)",    // shadow-md
    modal: "0 20px 25px -5px rgb(0 0 0 / 0.1)",      // shadow-xl
    button: "0 1px 2px 0 rgb(0 0 0 / 0.05)",         // shadow-sm
  },
} as const


// ══════════════════════════════════════════════════════════════════════════════
// 6. COMPONENT SPECIFICATIONS
// ══════════════════════════════════════════════════════════════════════════════

export const components = {
  // ─── Action Buttons (CTAs at bottom of screens) ───
  actionButton: {
    height: "48px",           // h-12
    minWidth: "120px",
    borderRadius: radius.semantic.button,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    
    primary: {
      background: "bg-primary",
      text: "text-primary-foreground",
      hover: "hover:bg-primary/90",
      active: "active:bg-primary/80",
    },
    secondary: {
      background: "bg-muted",
      text: "text-foreground",
      hover: "hover:bg-muted/80",
      active: "active:bg-muted/70",
    },
    
    // Tailwind class string
    className: {
      primary: "h-12 rounded-xl bg-primary text-primary-foreground text-sm font-bold transition-colors hover:bg-primary/90 active:bg-primary/80",
      secondary: "h-12 rounded-xl bg-muted text-foreground text-sm font-bold transition-colors hover:bg-muted/80 active:bg-muted/70",
    },
  },

  // ─── Cards ───
  card: {
    borderRadius: radius.semantic.card,
    padding: spacing.semantic.cardPadding,
    background: colors.semantic.card,
    border: `1px solid ${colors.semantic.border}`,
    shadow: shadows.semantic.card,
    
    // Tailwind class string
    className: "rounded-xl border border-border bg-card shadow-sm",
  },

  // ─── Quantity Stepper ───
  quantityStepper: {
    height: "32px",           // h-8
    buttonSize: "28px",       // h-7 w-7
    borderRadius: radius.full,
    fontSize: typography.fontSize.md,
    
    // Tailwind class string
    container: "inline-flex items-center gap-1 rounded-full border border-border bg-card",
    button: "flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-muted active:bg-muted/80",
    value: "min-w-[28px] text-center text-xs font-bold text-primary",
  },

  // ─── Remove/Delete Button ───
  removeButton: {
    size: "20px",             // h-5 w-5
    iconSize: "12px",         // h-3 w-3
    borderRadius: radius.full,
    
    // Tailwind class string
    className: "flex h-5 w-5 items-center justify-center rounded-full bg-foreground/70 text-white transition-opacity hover:bg-foreground/90",
  },

  // ─── Scroll Indicators ───
  scrollIndicator: {
    size: "32px",             // h-8 w-8
    iconSize: "16px",         // h-4 w-4
    borderRadius: radius.lg,
    
    // Tailwind class string  
    className: "flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card shadow-sm transition-colors hover:bg-muted disabled:opacity-30",
  },

  // ─── Badges/Pills ───
  badge: {
    height: "20px",           // h-5
    paddingX: "8px",          // px-2
    borderRadius: radius.full,
    fontSize: typography.fontSize.xs,
    
    // Tailwind class string
    primary: "inline-flex h-5 items-center rounded-full bg-primary px-2 text-[9px] font-bold text-primary-foreground",
    secondary: "inline-flex h-5 items-center rounded-full bg-muted px-2 text-[9px] font-medium text-muted-foreground",
    outline: "inline-flex h-5 items-center rounded-full border border-border px-2 text-[9px] font-medium text-foreground",
  },

  // ─── Summary Bar ───
  summaryBar: {
    height: "auto",
    paddingX: spacing.semantic.screenPadding,
    paddingY: "8px",
    background: colors.semantic.card,
    
    // Tailwind class string
    container: "flex items-center justify-between border-t border-border bg-card px-3 py-2",
    label: "text-[11px] font-medium text-foreground",
    value: "text-lg font-extrabold text-primary",
  },

  // ─── Category Tabs ───
  categoryTab: {
    height: "40px",           // h-10
    fontSize: typography.fontSize.sm,
    
    // Tailwind class string
    inactive: "flex h-10 items-center justify-center text-[10px] font-medium text-muted-foreground transition-colors",
    active: "flex h-10 items-center justify-center border-b-2 border-primary text-[10px] font-bold text-primary",
  },

  // ─── Product Card ───
  productCard: {
    borderRadius: radius.semantic.card,
    imageSize: "72px",
    
    // Tailwind class string
    container: "relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-transform active:scale-[0.98]",
    image: "aspect-square w-full object-contain p-2",
    content: "flex flex-1 flex-col p-2",
    name: "line-clamp-2 text-[10px] font-medium leading-tight text-foreground",
    price: "mt-auto pt-1 text-[11px] font-bold text-primary",
  },

  // ─── Option Card (for selections) ───
  optionCard: {
    borderRadius: radius.semantic.card,
    padding: "12px",
    
    // Tailwind class string
    unselected: "flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 transition-all",
    selected: "flex flex-col items-center gap-2 rounded-xl border-2 border-primary bg-accent p-3 transition-all",
  },

  // ─── Flavor Pill ───
  flavorPill: {
    height: "24px",
    paddingX: "8px",
    borderRadius: radius.full,
    imageSize: "18px",
    
    // Tailwind class string
    className: "inline-flex h-6 items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2 text-[9px] font-medium text-foreground",
  },

  // ─── Panels ───
  panel: {
    background: "bg-[#F6F6FA]",  // Will be replaced with bg-panel
    borderTop: "border-t border-border",
    padding: spacing.semantic.screenPadding,
    
    // Tailwind class string
    className: "border-t border-border bg-[#F6F6FA] px-3 py-2",
  },
} as const


// ══════════════════════════════════════════════════════════════════════════════
// 7. ANIMATION & TRANSITIONS
// ══════════════════════════════════════════════════════════════════════════════

export const animation = {
  // ─── Durations ───
  duration: {
    instant: "0ms",
    fast: "100ms",
    normal: "200ms",
    slow: "300ms",
    slower: "500ms",
  },

  // ─── Easings ───
  easing: {
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },

  // ─── Common Transitions ───
  transitions: {
    colors: "transition-colors duration-200 ease-in-out",
    transform: "transition-transform duration-200 ease-out",
    opacity: "transition-opacity duration-200 ease-in-out",
    all: "transition-all duration-200 ease-in-out",
  },
} as const


// ══════════════════════════════════════════════════════════════════════════════
// 8. LAYOUT
// ══════════════════════════════════════════════════════════════════════════════

export const layout = {
  // ─── Kiosk Viewport ───
  kiosk: {
    logicalWidth: 480,
    logicalHeight: 853,
    physicalWidth: 1080,
    physicalHeight: 1920,
    dpr: 2.25,
  },

  // ─── Z-Index Scale ───
  zIndex: {
    base: 0,
    dropdown: 10,
    sticky: 20,
    overlay: 30,
    modal: 40,
    popover: 50,
    tooltip: 60,
  },

  // ─── Common Heights ───
  heights: {
    header: "52px",           // ProgressStepper height
    footer: "28px",           // KioskFooter height  
    actionBar: "100px",       // ActionBar + summary
    categoryTabs: "80px",     // Two-row category tabs
  },
} as const


// ══════════════════════════════════════════════════════════════════════════════
// 9. HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Combines multiple class names, filtering out falsy values
 */
export function cx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ")
}

/**
 * Creates a CSS variable reference
 */
export function cssVar(name: string): string {
  return `var(--${name})`
}


// ══════════════════════════════════════════════════════════════════════════════
// 10. DESIGN TOKENS EXPORT (for design tools)
// ══════════════════════════════════════════════════════════════════════════════

export const designTokens = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  animation,
  layout,
  components,
} as const

export type DesignTokens = typeof designTokens
