# DESIGN SYSTEM SPEC (CODE-DERIVED)

This document is extracted from current repository code only.  
No speculative or invented design direction is included.

## 1) Source Of Truth Files

- `assets/css/app.css`
- `assets/css/custom.css`
- `nuxt.config.ts`
- `app.vue`
- `layouts/home.vue`
- `layouts/other.vue`
- `pages/index.vue`
- `pages/projects/index.vue`
- `pages/blog/index.vue`
- `pages/blog/[slug].vue`
- `components/Hero.vue`
- `components/LinkCard.vue`
- `components/TechBadge.vue`
- `components/SocialIcon.vue`
- `components/projects/card.vue`
- `components/blog/card.vue`
- `components/blog/stats.vue`
- `components/blog/categories.vue`
- `components/BlogStatsSection.vue`
- `components/Quote.vue`
- `components/Hint.vue`
- `components/Gotcha.vue`
- `components/CustomHeading.vue`
- `components/BlogImage.vue`
- `components/BlogLink.vue`
- `components/codeBlock.vue`
- `components/bottomBar.vue`
- `components/logo.vue`
- `components/sound.vue`
- `data/siteSettings.ts`

## 2) Styling Stack

- Framework: Nuxt 3 + Vue 3.
- CSS framework: Tailwind CSS v4 (`@import "tailwindcss"`).
- Component/theme layer: DaisyUI (`@plugin "daisyui"`).
- Typography plugin: `@tailwindcss/typography`.
- Icon system: `@nuxt/icon` with `solar`, `ph`, `simple-icons`, `logos` collections.
- Image system: `@nuxt/image` (`webp/png/jpeg`; `rect` preset for project cards).
- Fonts provider: `@nuxt/fonts` with local provider (`provider: 'local'`).
- Runtime theme posture in code:
  - Daisy theme: `prefersdark: true`, `color-scheme: "dark"`
  - Head meta in `app.vue`: `theme-color: #b4ff22`, `color-scheme: dark`.

## 3) Theme Tokens (`data-theme="mine"`)

Defined in `assets/css/app.css` via DaisyUI theme plugin.

### 3.1 Color Tokens (OKLCH)

- `--color-base-100: oklch(14% 0.005 285.823)`
- `--color-base-200: oklch(21% 0.006 285.885)`
- `--color-base-300: oklch(27% 0.006 286.033)`
- `--color-base-content: oklch(96% 0.001 286.375)`
- `--color-primary: oklch(92% 0.238 128.85)`
- `--color-primary-alt: oklch(52% 0.238 128.85)`
- `--color-primary-content: oklch(27% 0.072 132.109)`
- `--color-secondary: oklch(70% 0.183 293.541)`
- `--color-secondary-content: oklch(28% 0.141 291.089)`
- `--color-accent: oklch(60% 0.126 221.723)`
- `--color-accent-content: oklch(98% 0.019 200.873)`
- `--color-neutral: oklch(27% 0.006 286.033)`
- `--color-neutral-content: oklch(98% 0 0)`
- `--color-info: oklch(70% 0.165 254.624)`
- `--color-info-content: oklch(28% 0.091 267.935)`
- `--color-success: oklch(79% 0.209 151.711)`
- `--color-success-content: oklch(26% 0.065 152.934)`
- `--color-warning: oklch(85% 0.199 91.936)`
- `--color-warning-content: oklch(28% 0.066 53.813)`
- `--color-error: oklch(71% 0.194 13.428)`
- `--color-error-content: oklch(27% 0.105 12.094)`

### 3.2 Radius / Border / Depth Tokens

- `--radius-selector: 2rem`
- `--radius-field: 0.5rem`
- `--radius-box: 1rem`
- `--size-selector: 0.21875rem`
- `--size-field: 0.3125rem`
- `--border: 0.5px`
- `--depth: 1`
- `--noise: 1`

### 3.3 Font Tokens

- `--font-mono: "Operator Mono Lig"`
- `--font-display: "Formula Condensed"`
- `--font-body: "DM Sans"`
- `--font-sans: "DM Sans"`

Also used utility override:

- `.font-normal-weight { font-weight: 300 !important; }`

### 3.4 Icon Bundle Allow-List

From `nuxt.config.ts` `icon.clientBundle.icons`:

- `solar:info-circle-broken`
- `solar:hand-shake-broken`
- `solar:code-broken`
- `solar:bookmark-square-minimalistic-broken`
- `simple-icons:github`
- `simple-icons:whatsapp`
- `simple-icons:gmail`
- `simple-icons:discord`
- `ph:house-simple-duotone`
- `ph:speaker-high-fill`
- `ph:speaker-slash-fill`
- `logos:vue`
- `logos:typescript-icon`
- `logos:nuxt-icon`
- `logos:supabase-icon`
- `logos:tailwindcss-icon`
- `logos:bun`
- `logos:nodejs-icon-alt`
- `logos:git-icon`
- `simple-icons:git`
- `ph:book-bookmark-duotone`
- `simple-icons:gitbook`
- `solar:gameboy-line-duotone`
- `solar:verified-check-bold-duotone`
- `solar:star-fall-minimalistic-bold-duotone`
- `ph:git-branch-duotone`
- `ph:share`
- `solar:calendar-add-line-duotone`
- `solar:home-2-bold-duotone`
- `ph:laptop-duotone`
- `solar:user-circle-bold`
- `ph:warning-fill`
- `ph:lightbulb-filament-fill`
- `ph:quotes-fill`

Also defined alias in `app.config.ts`:

- `nuxt -> logos:nuxt-icon`

## 4) Global Surface + Shell Layout

## 4.1 App Shell

From `app.vue`:

- Global page wrapper has:
  - sticky top bar: `w-full px-6 py-3 border-b border-base-300 ... bg-base-200`
  - bottom floating nav component (`<BottomBar />`) always rendered.
- Theme scope: `<div data-theme="mine"><NuxtPage /></div>`.
- Toaster theme: dark, rounded-box class override.
- Top-right status pill:
  - `text-xs bg-base-300 rounded-box px-3 py-1`
  - uses DaisyUI `status` indicators (success/error + ping).

## 4.2 Layout Files

- `layouts/home.vue`: wrapper `w-full pb-24` (space for fixed bottom bar).
- `layouts/other.vue`: wrapper `w-full`; no footer by default (footer commented out).

## 4.3 Bottom Navigation

From `components/bottomBar.vue`:

- Fixed center-bottom glass pill:
  - `fixed bottom-4 left-1/2 -translate-x-1/2`
  - `!rounded-full glass !border-none p-3 px-6 flex gap-x-4`
- Nav items:
  - base: `rounded-full p-2 md:p-3 ... hover:bg-base-300`
  - active: `!text-primary-content !bg-primary !rounded-box`
- Labels hidden on small screens (`hidden md:inline`).

## 5) Page-Level Layout Patterns

## 5.1 Home (`pages/index.vue` + `components/Hero.vue`)

- Page container:
  - `w-full p-6`
  - inner: `container max-w-6xl mx-auto`
- Hero split:
  - `flex flex-col md:flex-row gap-8 py-6 md:p-6`
  - left column sticky on desktop: `md:sticky md:top-28`
- Section rhythm in right column: repeated `mt-16` blocks.
- Primary heading:
  - `font-display text-6xl xl:text-7xl`
  - name accent: `text-primary underline`.

## 5.2 Projects (`pages/projects/index.vue`)

- Outer container: `container mx-auto xl:max-w-7xl`.
- Tab control shell:
  - `p-3 rounded-box max-w-xl bg-base-200`
  - tab buttons: rounded-full with active `!bg-base-300 !rounded-box`.
- Content area:
  - `min-h-screen px-6`
  - animated switches via `v-auto-animate`.
- Project lists use:
  - `grid md:grid-cols-2 lg:grid-cols-3 gap-8`.

## 5.3 Blog Index (`pages/blog/index.vue`)

- Outer wrapper:
  - `w-full p-6 md:p-12 pb-24 md:pb-32 lg:pb-48`
- Inner container:
  - `container max-w-7xl mx-auto min-h-screen`
- Cards grid:
  - `grid md:grid-cols-2 lg:grid-cols-3 gap-8`.

## 5.4 Blog Detail (`pages/blog/[slug].vue`)

- Content width:
  - `container max-w-[105rem] ... min-h-screen mx-auto`
- Main split:
  - `flex flex-col lg:flex-row gap-12`
  - content `lg:w-2/3`, sidebar `lg:w-1/3`.
- Sidebar sticky:
  - `md:sticky md:top-24 space-y-12`.
- Article body wrapper:
  - `bg-base-300/30 md:border border-base-300 rounded-t-2xl md:rounded-3xl p-6 md:p-8 lg:p-6`.

## 6) Reusable UI Patterns

## 6.1 Elevated Card Pattern

Shared across blog/project/link/stats cards:

- `bg-base-200 border border-base-300 rounded-box|rounded-2xl`
- `shadow-md|shadow-xl`
- `transition-all duration-200 ease-out`
- hover typically adds:
  - `hover:border-primary`
  - `hover:shadow-lg`
  - sometimes `hover:shadow-primary/10`.

Exact examples:

```txt
Blog/Project card root:
bg-base-200 shadow-xl hover:shadow-primary/10 w-full rounded-box hover:border-primary transition-all group border border-base-300 p-3

LinkCard root:
py-3 px-4 rounded-box bg-base-200 shadow-md border border-base-300 transition-all duration-200 ease-out hover:border-primary hover:shadow-lg
```

## 6.2 Chips / Badges / Meta Pills

Used in project/blog cards and tech stack chips:

- base shape: `rounded-lg` or `rounded-box`
- mono font: `font-mono`
- dashed borders often used:
  - `border-dashed border-base-300` or `border-base-content/30`.
- compact paddings:
  - `py-1 px-3` (meta pills)
  - `py-2 px-3` (tech badges).

Exact examples:

```txt
TechBadge:
py-2 px-3 rounded-lg bg-base-200 inline-flex shadow-sm border border-dashed border-base-300 text-sm font-mono items-center gap-2 transition-all duration-200 ease-out hover:shadow-md hover:border-base-200

Project/blog meta pill:
py-1 px-3 rounded-lg bg-base-200 inline-flex shadow-xl border-1 border-dashed text-sm font-medium capitalize border-base-content/30 font-mono flex items-center gap-2
```

## 6.3 Buttons

Global `.btn` in `assets/css/app.css`:

- tactile bottom-border behavior:
  - `border-b-[4px]` normal
  - `hover:border-b-[6px]` + slight raise
  - `active:border-b-[2px]` + slight press down.

Ghost/soft variants remove this depth effect.

## 6.4 Image Treatment Pattern

Common image treatment in cards/articles:

- `NuxtImg` with `:custom="true"` slot.
- loaded image:
  - `w-full object-cover`
- placeholder:
  - skeleton with matching height and `border border-base-300`.
- card images:
  - blog: fixed `h-[150px]`
  - project: fixed `h-[200px]`
  - article hero: skeleton `h-[400px]`.

Exact class examples:

```txt
Card image wrapper:
rounded-box border border-base-300

Article image wrapper:
w-full object-cover border border-base-300 rounded-box shadow-xl shadow-base-300/10
```

## 6.5 Typography Usage Pattern

- Display headings: `font-display`.
- Body copy: default sans, with many blocks explicitly forcing lightweight body via `.font-normal-weight`.
- Utility text hierarchy classes:
  - `.text-content-primary`
  - `.text-content-secondary` (`/80`)
  - `.text-content-tertiary` (`/60`).

## 6.6 Rich Text (PortableText) Styling

From article page:

- prose shell:
  - `prose prose-lg md:!prose-xl prose-invert`
  - heading weight override `prose-headings:font-extrabold`
  - pre formatting customized to inherit background and custom rounding.
- Custom heading mapping:
  - h2: `font-bold text-4xl md:text-5xl`
  - h3: `!font-medium text-3xl md:text-2xl`
  - h4: `!font-medium text-2xl md:text-3xl`.

## 6.7 Callout Blocks

- `Quote.vue`: primary-tinted card with quote icon badge (`ph:quotes-fill`), large gradient text.
- `Hint.vue`: success-tinted equivalent (`ph:lightbulb-filament-fill`).
- `Gotcha.vue`: warning-tinted equivalent (`ph:warning-fill`).
- Shared structure:
  - `p-6 pt-16 my-12 rounded-box relative`
  - top-left floating circular icon badge.

## 7) Motion + Interaction Language

## 7.1 Global Motion Rules

- All anchors/buttons: `transition-all duration-200 ease-out`.
- Page transition:
  - duration `0.3s`, `opacity` + `translateY(10px)`.
- Layout transition:
  - duration `0.3s`, `opacity` + `scale(0.97)`.
- Reduced-motion media query forces near-zero animation/transition duration globally.

## 7.2 Local Motion/Feedback

- `jello-horizontal` keyframe used for blog reaction icon feedback.
- `group-hover:rotate-12` used on several icon/title accents.
- Some stat icons scale on hover (`group-hover:scale-105`).
- Auto-animate (`@formkit/auto-animate`) used for projects tab content switching.

## 8) Sound Interaction Layer

- Global toggle state: `usePlaySound()` (`useState('playSounds', () => true)`).
- Major clickable UI components call sound hooks (`Hero`, cards, bottom nav, stats actions).
- `bottomBar` and `Hero` include reduced-motion guard before playing click sounds.
- Toggle icon in header:
  - on: `ph:speaker-high-fill`
  - off: `ph:speaker-slash-fill`.

## 9) Accessibility + Interaction Constraints Present In Code

- Global focus-visible outline:
  - `2px solid var(--color-primary)`, offset `2px`.
- High contrast mode increases focus outline width to `3px`.
- Social links include `aria-label`.
- Disabled social icon uses `<button disabled>` and reduced opacity/cursor state.

## 10) Exact Reproduction Rules (No Drift)

- Keep `data-theme="mine"` and all DaisyUI token values unchanged.
- Keep `base-*` layering (`base-100/200/300`) and border treatment (`border-base-300`) unchanged.
- Keep card geometry:
  - rounded-box/rounded-2xl,
  - subtle shadow + primary-border hover pattern.
- Keep body copy weight pattern (`font-normal-weight`) in narrative paragraphs.
- Keep bottom floating nav glass treatment and active-state color inversion.
- Keep chip style: mono font + compact rounded geometry + dashed borders.
- Keep page/container widths exactly as currently used:
  - home `max-w-6xl`,
  - projects/blog index `max-w-7xl`,
  - blog detail `max-w-[105rem]`.
- Keep current icon families (`solar`, `ph`, `simple-icons`, `logos`) and listed bundled icons in `nuxt.config.ts`.

## 11) Extension Guidance (Derived Only From Existing Code)

When adding new UI:

- Build from existing card/chip/button class patterns above, not new visual patterns.
- Use existing semantic tokens (`primary`, `secondary`, `success`, `warning`, `error`, `info`) rather than ad-hoc colors.
- Use same motion timings (`200ms` micro, `300ms` page/layout).
- Use same responsive grid conventions (`md:grid-cols-2`, `lg:grid-cols-3`, `gap-8`) where list layouts are needed.
