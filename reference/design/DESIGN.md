---
name: Precision Industrial Filtration
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#5c403d'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#906f6c'
  outline-variant: '#e5bdba'
  surface-tint: '#be0c1e'
  primary: '#b20019'
  on-primary: '#ffffff'
  primary-container: '#d7262d'
  on-primary-container: '#fff1f0'
  inverse-primary: '#ffb3ad'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#006444'
  on-tertiary: '#ffffff'
  tertiary-container: '#008058'
  on-tertiary-container: '#d3ffe5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad7'
  primary-fixed-dim: '#ffb3ad'
  on-primary-fixed: '#410004'
  on-primary-fixed-variant: '#930012'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.04em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.08em
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system targets B2B automotive parts distributors, fleet maintenance engineers, bulk commercial mechanics, and industrial procurement officers. The aesthetic projects mechanical reliability, OEM-grade precision, and high-volume wholesale efficiency. 

Drawing from Modern Industrial Functionalism and Technical Brutalism, the UI rejects decorative flourishes, soft gradients, and ambient blurs. Instead, it relies on crisp structural lines, high-density data tables, decisive grid dividers, and high-contrast color blocking. Every element must communicate heavy-duty engineering, catalog utility, and commercial dependability.

## Colors

The palette is engineered around high-visibility industrial contrasts:
- **Primary (`#D7262D`)**: Industrial Safety Red. Reserved strictly for primary operational triggers, critical filter category indicators, OEM cross-reference matches, and urgent stock statuses.
- **Secondary (`#1E293B`)**: Deep Industrial Slate. Used for primary typography, structural headers, high-density table rows, and grounding structural containers.
- **Tertiary (`#10B981`)**: Precision Emerald. Exclusively reserved for instant wholesale commercial actions, RFQ dispatch, and direct WhatsApp trade inquiries.
- **Neutral (`#475569`)**: Machine Slate. Applied to secondary data, sub-labels, part specifications, and table borders.
- **Surface & Backgrounds**: Base canvas is pure sterile white (`#FFFFFF`), supported by structural framing tiers of Cool Grey (`#F1F5F9`) and Slate Line Gray (`#E2E8F0`).
- **Rule of Execution**: Never blend or feather colors with gradients. Use strict 100% solid fills and sharp-edge blocking.

## Typography

The typographic hierarchy establishes clear structural discipline:
- **Headlines (Space Grotesk)**: Geometric, technical, and architectural. Provides bold mechanical authority for product series, technical designations, and hero statements.
- **Body & Long Form (Inter)**: High legibility, neutral, and systematically balanced. Powers dense specification lists, technical manuals, and corporate credentials.
- **Data & Metadata (JetBrains Mono)**: Pure monospaced clarity for part numbers, OEM cross-reference codes, micron ratings, thread dimensions, and bulk pricing units.

## Layout & Spacing

A strictly regimented 12-column grid layout governs desktop experiences, shifting to a 6-column grid on tablets, and a 2-column or 4-column compact structural grid on mobile.

- **Desktop (>= 1280px)**: 12 columns, max-width 1360px centered, 24px (`1.5rem`) gutters, 32px (`2rem`) side margins. Technical tables and filter selectors anchor full-width or inside an 8:4 catalog-sidebar ratio.
- **Tablet (768px - 1279px)**: 6 columns, fluid width with 16px gutters, 24px margins. Filters collapse into top-aligned quick-drawers.
- **Mobile (< 768px)**: 4 columns or single-column stack, 12px (`0.75rem`) gutters, 16px (`1rem`) outer canvas margins. SKU cards and part comparisons shift into horizontal swiping strips with rigid boundaries.

## Elevation & Depth

To sustain an authentic industrial catalog identity, depth is conveyed through **crisp borders and flat tonal stacking** rather than blurred dropshadows.

- **No Diffuse Shadows**: Avoid soft ambient blurs (`box-shadow: 0 10px 30px rgba(...)`).
- **Surface Layering**:
  - Base Level (`#FFFFFF`): Primary background canvas.
  - Recessed Level (`#F8FAFC`): Table headers, filter control bars, and data sheet backgrounds.
  - Elevated Popovers & Drawers (`#FFFFFF`): Surrounded by a strict `1px solid #1E293B` or `2px solid #E2E8F0` border.
- **Hard Technical Offset (Optional for interactive cards)**: If simulated depth is needed for hover states, use an industrial hard shadow: `box-shadow: 4px 4px 0px #1E293B`.

## Shapes

The geometric architecture is set to **Sharp (`0`)**. 

All buttons, inputs, badge indicators, cards, and modal sheets have exact `0px` border-radius. This angular precision reinforces high-tolerance manufacturing, stamped metal, and automotive OEM specs. Micro-accents can incorporate a 45-degree chamfer cut (3px to 4px) on active tab corners or SKU badges to signal technical blueprints.

## Components

### Buttons
- **Primary Industrial Red**: Solid `#D7262D` background, `#FFFFFF` bold text (Space Grotesk, 14px uppercase), 0px radius, 12px 24px padding. Hover: `#B91C1C`.
- **Secondary Technical Slate**: Solid `#1E293B` background, `#FFFFFF` text. Hover: `#0F172A`.
- **Emerald WhatsApp RFQ**: Solid `#10B981` background, `#FFFFFF` text, paired with WhatsApp icon. Hover: `#059669`.
- **Outline / Ghost**: 1px solid `#475569`, transparent background, `#1E293B` text. Hover: Solid `#F1F5F9`.

### Input Fields & Selectors
- Background: `#FFFFFF`. Border: 1px solid `#CBD5E1`. Radius: `0px`.
- Typography: Inter 14px or JetBrains Mono 13px for part searches.
- Focus State: 2px solid `#D7262D`, no glow ring.

### Product & Part Cards (SKU Block)
- Flat white container bordered with `1px solid #E2E8F0`.
- Top-left: Category tag (e.g., "HEAVY DUTY AIR FILTER") in JetBrains Mono 10px bold uppercase on `#F1F5F9`.
- Center: High-detail cut-out product photograph on clean white canvas.
- Bottom: Bold part number (Space Grotesk 18px), OEM Cross-Reference matrix, and quick-action quote/WhatsApp CTA. Hover: `1px solid #1E293B` with `4px 4px 0px #1E293B` hard offset.

### Data Tables & OEM Cross-Reference Matrix
- Header: `#1E293B` with `#F8FAFC` uppercase JetBrains Mono 12px text.
- Row zebra striping: `#FFFFFF` alternate with `#F8FAFC`.
- Grid: Thin lines `1px solid #E2E8F0`. Hover highlight: `#F1F5F9` with left indicator bar in `#D7262D`.

### Chips & Technical Badges
- Micron ratings, bypass valve pressures, and fluid compatibilities rendered in rectangular box tags with `1px solid #94A3B8`, background `#F8FAFC`, font JetBrains Mono 11px uppercase.