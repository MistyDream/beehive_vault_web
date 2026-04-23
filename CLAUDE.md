# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

```bash
yarn dev        # Start dev server (http://localhost:3000)
yarn build      # Production build (Nitro + client)
yarn generate   # Static generation
yarn preview    # Preview the built app
yarn lint       # ESLint
yarn lint:fix   # ESLint + autofix
yarn format     # Prettier
```

Node 22+ (enforced via `engines.node` + `.nvmrc`). Yarn 4 (Berry) via corepack. API base URL is wired through `src/plugins/api.ts`.

## Stack

- Nuxt 4 + Vue 3.5 (Composition API, `<script setup lang="ts">`)
- vue-router 5, Unhead v2 (bundled)
- TypeScript strict (noUncheckedIndexedAccess active)
- Pinia 3 (stores) + `@pinia/nuxt`
- VueUse 14 — prefer composables over hand-rolled logic; `@floating-ui/vue` for positioning
- Tailwind via `@nuxtjs/tailwindcss` with custom `theme-*` tokens backed by CSS vars
- `@nuxtjs/i18n` 10 — strategy `prefix_except_default`, FR default, EN under `/en/*`
- `vue-sonner` (toasts), `focus-trap`, `highcharts` + `highcharts-vue` (waterfall/performance charts), `nuxt-lucide-icons`, `@nuxt/fonts`, `@nuxt/image` 2

## Structure

```
src/
├── assets/css/              # main.css — theme tokens + global utilities
├── components/
│   ├── atoms/BH*.vue        # Leaf (BHButton, BHStockAvatar, …)
│   ├── molecules/BH*.vue    # Compositions of atoms (BHTabs, BHKpiTile, …)
│   └── organisms/BH*.vue    # Feature-scoped blocks (BHPortfolio*, BHDrawer, …)
├── composables/             # useXxx() — auto-imported
├── constants/               # theme.ts, http.ts
├── layouts/default.vue      # Shell applied to every page
├── pages/                   # Nuxt file-based routing (nested under [id]/ for tabs)
├── plugins/api.ts           # $fetch wrapper with base URL + Problem+JSON error mapping
├── stores/                  # Pinia (drawer, header, portfolio)
├── types/                   # Domain types (portfolio.ts, navigation-link.ts)
├── utils/                   # Pure functions (stringToColor.ts, transaction.ts)
└── i18n/locales/            # fr-FR.json, en-US.json — all UI text
```

All components prefixed `BH`. Atomic Design layering is strict: atoms have no feature knowledge; organisms may fetch data.

## Key Patterns

### Theme tokens

- CSS vars in `src/assets/css/main.css` hold RGB channels (`--color-bg-primary: 26 26 26`)
- Tailwind maps them to `theme-*` utilities (`bg-theme-bg-card`, `text-theme-text-primary`, `border-theme-border-primary`)
- **Never hardcode colors** (`bg-gray-500`, `text-[#...]`, `text-white`) — use `theme-*`
- `*-strong` variants exist for tight contrast on tinted bg (`text-theme-status-error-strong` on `bg-theme-status-error/10`)

### i18n — navigation rule

Strategy `prefix_except_default` means EN lives under `/en/*`. A raw path string drops the locale silently. **Every internal navigation target must pass through `useLocalePath()`**:

```ts
const localePath = useLocalePath();
// ✅ :to="localePath(`/portfolios/${id}`)"
// ✅ navigateTo(localePath('/'))
// ✅ router.push({ path: localePath('/foo'), query })
// ❌ :to="`/portfolios/${id}`"
```

Applies to `.to` fields passed as data (e.g. the tabs array for `BHTabs`) — localize at the construction site, not inside the component.

All UI strings go through `t('...')`. No hardcoded FR/EN in templates.

### Data fetching

- Every API call goes through a composable (`usePortfolioApi`, `useTransactionApi`) that wraps `useFetch` with the `$api` plugin
- `useFetch` dedups by URL key — multiple call sites for the same URL share state/response
- When a view needs several endpoints together, aggregate in a use-case composable (`usePortfolioDetail` wraps `detail + summary + performance`)
- Local component state owns UI-driven filters (sort, pagination) — Pinia reserved for cross-component mutations

### Paginated responses

Backend returns `{ items, total, page, per_page }` — see `Paginated<T>` in `src/types/portfolio.ts`.

### Shared helpers

- `~/utils/transaction.ts` — `displayAmount(tx)`, `iconForTransaction(type)`
- `~/composables/useLocaleFormatters.ts` — `formatQuantity`, `formatPercent`, `formatDate`
- Always prefer these over reimplementing `Intl.*` locally.

### Toasts

- `useToast()` wraps vue-sonner. `.error()` is auto-wrapped with `{ important: true }` → `role="alert"` (assertive). Info/success stay polite.

### Accessibility (target WCAG 2.1 AA)

- Every interactive element has a visible focus ring (`focus-visible:ring-2 focus-visible:ring-theme-accent-primary`)
- Modals/drawers trap focus via `@vueuse/integrations/useFocusTrap`. Restore focus manually with `{ preventScroll: true }` to avoid unwanted page scroll
- Tabs: `role="tab"` + `aria-selected` + `aria-controls` paired to panels with matching `id`/`aria-labelledby`. Truly-unavailable tabs render as `<span tabindex="-1" aria-disabled="true">` — never a disabled `<a>`
- Async tiles set `aria-busy`; parent strips set `aria-live="polite"`
- Decorative icons always `aria-hidden="true"`; icon-only buttons always have `:aria-label`
- Skip-to-main link in `layouts/default.vue` → `<main id="main-content" tabindex="-1">`

## Code Conventions

- **English-only** code, comments, identifiers — user-facing strings via i18n
- **No comments** by default; add only when the WHY is non-obvious (hidden constraint, subtle invariant, workaround)
- **Extract** utils/composables only when a duplication is confirmed across ≥ 2 call sites
- **No raw path navigation** (see i18n rule)
- **No `as const` on query params** — use the project types (`PositionsQuery`, `TransactionsQuery`, …)
- **No `any` leaks** — narrow at the boundary; prefer generics on composables

## Related Obsidian notes

Main vault at `/mnt/c/Users/Max/Documents/Obsidian Vault/`.

- [[Projets/Beehive Vault/Beehive Vault Web]] — stack & components inventory
- [[Projets/Beehive Vault/Communication API Front]] — API layer design (plugin, composables, error handling)
- [[Projets/Beehive Vault/Roadmap Frontend]] — upcoming tasks
- [[Projets/Beehive Vault/Implémentation Portfolio Pages]] / [[Projets/Beehive Vault/Implémentation Portfolio Detail]] — feature recaps + post-review logs
- [[Projets/Beehive Vault/Product Brief]] — visual direction, typography, brand
- [[Projets/Beehive Vault/Design Portfolio Detail]] — spec for the portfolio detail screen
- [[Projets/Beehive Vault/Choix lib charts]] — chart library decision (nuxt-charts → Highcharts pivot, licensing tradeoffs)
- [[Concepts/Atomic Design]] — component layering rationale
- [[Concepts/Frontière DTO et value object]] — where serde/serializable types belong (applies to response shapes)
- [[Concepts/Architecture hexagonale]] — backend layering (context for DTO shapes and error contracts)
- [[Reflections/Refonte Frontend — Périmètre & Principes]] — scope & principles of the rebuild
- [[Reflections/Gestion API Frontend]] — composable patterns, error handling reflection
- [[Reflections/Navigation & Layout Frontend]] — nav & layout decisions
