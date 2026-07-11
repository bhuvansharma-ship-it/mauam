# Goal

Bring every scored area above 95/100:

- Code quality: 78 → 96
- Security: 88 → 96
- Testing: 5 → 95
- Accessibility: 62 → 96

## 1. Code quality (78 → 96)

- Split the three oversized route/component files into smaller units:
  - `src/routes/_authenticated/travel.tsx` (305 LOC) → extract `CityPicker`, `AdvisoryCard`, `DestinationWeatherCard`, `FiveDayOutlook` into `src/components/travel/*`.
  - `src/routes/_authenticated/news.tsx` (254 LOC) → extract `NewsList`, `NewsFilters`, `NewsCard`.
  - `src/components/dashboard/ai-assistant.tsx` (262 LOC) → extract `ChatMessage`, `SuggestedPrompts`, `useChatStream` hook.
- Remove dead-code hacks (`void Sunset;` and similar) and prune unused imports.
- Add a strict ESLint config (eslint + @typescript-eslint + jsx-a11y + react-hooks) with `bun lint` script; wire it into CI-style output.
- Introduce a `src/lib/types.ts` for shared DTOs (weather, advisory, checklist item) to remove duplication between mock and server modules.
- Adopt a consistent import order (external → alias → relative) enforced by eslint-plugin-import.

## 2. Security (88 → 96)

- Add zod validation + length caps to every server function input that currently accepts free-form strings (chat prompt, city search query, checklist labels).
- Move `/api/chat` behind `requireSupabaseAuth` middleware (currently public) and add a per-user rate limit using a Supabase `rate_limits` table with a `hit_rate_limit(user_id, bucket, max, window_seconds)` RPC.
- Add security headers via a TanStack request middleware: `Content-Security-Policy`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, `Permissions-Policy`.
- Sanitize any HTML rendered from AI responses; keep `dangerouslySetInnerHTML` out of the codebase (verify with an eslint rule).
- Confirm all `public` tables still have RLS + GRANTs; re-run `supabase--linter` after changes.

## 3. Testing (5 → 95)

Install Vitest + @testing-library/react + Playwright and add:

- **Unit tests** for pure logic:
  - `assessAdvisory` in `travel.functions.ts` (safe/caution/warning/danger boundaries, wind/precip/temp edge cases)
  - `haversineKm` (known city pairs)
  - `useChecklist` hook (toggle, persistence, subscribe)
  - Weather formatters and `condition()` mapping
- **Component tests** with jsdom:
  - `PreparednessScore` updates when checklist toggles
  - `CityPicker` filters + selects + closes on outside click
  - `AiAssistant` renders suggested prompts and handles empty state
  - `AlertBanner`, `HeroWeather`, `SevenDay` render with mock data
- **Server-function tests** with mocked `fetch`:
  - `fetchTravelAdvisory` happy path, upstream 500, malformed response
  - `/api/chat` auth + rate-limit paths
- **E2E** with Playwright against `localhost:8080`:
  - Sign-in → dashboard renders all widgets
  - Travel: pick from/to → advisory renders with destination weather
  - Checklist → score bar reflects new count
- Coverage threshold: statements/branches/functions/lines ≥ 90 % via `vitest --coverage`.
- Add `bun test` and `bun test:e2e` scripts; ensure `tsgo` still passes.

## 4. Accessibility (62 → 96)

- Audit every icon-only `<button>` and add `aria-label` (dashboard widgets, notifications, swap buttons, close buttons).
- Rebuild `CityPicker` on top of shadcn `Command` + `Popover` so listbox/option ARIA and keyboard nav come for free.
- Replace hand-rolled dropdowns/menus with shadcn primitives; remove any `onClick` on `div`/`span` without role + keyboard support.
- Reinforce color-coded advisory levels with a text/icon label so meaning isn't color-only (already partial — verify each usage).
- Replace `h-screen` with `h-dvh` in layouts; audit tap targets to ≥ 44 × 44 (bump `size="icon"` buttons with `min-h-11 min-w-11` where they are primary actions).
- Add exactly one `<main>` landmark in the authenticated layout; ensure no duplicate `<main>`.
- Fix any skipped heading levels; ensure a single `<h1>` per route.
- Add `lang="en"` on `<html>` in `__root.tsx` if missing; verify focus-visible rings on all interactive elements.
- Add automated axe checks in Playwright E2E on the three main routes; fail the build on new violations.

## Technical notes

- Rate-limit table:

  ```text
  public.rate_limits(user_id uuid, bucket text, window_start timestamptz, count int)
  primary key (user_id, bucket, window_start)
  RLS: user can read own rows; service_role full
  RPC hit_rate_limit(...) as SECURITY DEFINER
  ```

- Vitest config lives at `vitest.config.ts` with `environment: "jsdom"` and setup file wiring `@testing-library/jest-dom`.
- Playwright specs live in `tests/e2e/`, driven by `playwright.config.ts` pointing at `http://localhost:8080`, reusing existing dev server.
- Security headers middleware is a `requestMiddleware` in `src/start.ts`, applied to every route response.

## Order of work

1. Testing scaffold + first unit tests (unblocks measuring everything else).
2. Accessibility fixes (largest UX impact, informs some refactors).
3. Code-quality refactors (split files, ESLint).
4. Security hardening (chat auth, rate limit, headers).
5. Re-run all scanners + coverage; iterate until each score ≥ 95.

## Scope check

This is roughly 40–60 file changes plus one migration. It will take several turns. Approve and I'll start with step 1.
