# Beehive Vault Web agent guidance

## Project scope

- This repository contains the Beehive Vault web client built with Nuxt, Vue, TypeScript, Pinia, Tailwind CSS, and Vue I18n.
- The `reboot/web-foundation` work replaces the historical investment portfolio domain. Do not treat legacy domain code as the target architecture unless the current documentation explicitly retains it.
- Product design and contract documentation currently precede implementation. Read the relevant files in `docs/` before changing a user flow.
- Keep product documentation and user-facing text in French. Keep source code, technical identifiers, test data, and code comments in English.

## Domain and implementation rules

- Access the API through the same-origin Nuxt server proxy. Do not call the API origin directly from browser code.
- Preserve monetary amounts as decimal strings at HTTP and client boundaries.
  Do not parse them as JavaScript `number` values or calculate financial totals in the browser when the API contract owns that calculation.
- Resolve the active household through the documented client context instead of adding the household identifier to page URLs.
- Drive behavior and translations from canonical Problem Details `type` or `code` values. Do not interpret human-readable API error messages.
- Preserve light and dark themes, internationalization, keyboard navigation, focus management, and touch targets of at least 44 by 44 CSS pixels.
- Keep responsive layouts readable before reducing spacing or target sizes.
- Preserve unrelated user changes in a dirty worktree.

## Verification

- Run `yarn lint` for source changes.
- Run `yarn build` for changes that affect application behavior or Nuxt configuration.
- Run `yarn exec prettier --check .` for formatting verification.
- Add focused tests when the reconstructed application introduces a test harness for the affected behavior.
- For documentation-only changes, verify links, API route names, payload fields, and consistency with the API repository contracts.

## Code Review Rules

- Flag direct browser-to-API calls. The safe path is the Nuxt server proxy defined by the architecture decision records.
- Flag monetary parsing, arithmetic, grouping totals, or sign derivation in the browser when the API contract provides exact values.
- Flag client behavior that branches on Problem Details `detail` or `title` instead of stable `type` or `code` values.
- Flag divergences between UI assumptions, `docs/`, and the effective contracts in the API repository.
- Flag regressions in keyboard access, focus restoration, accessible naming, theme support, internationalization, responsive behavior, or 44-pixel touch targets.
- Flag new dependencies on the historical portfolio domain unless a current ADR or foundation document explicitly requires them.
- Do not report formatting or lint preferences already enforced by Prettier or ESLint.
