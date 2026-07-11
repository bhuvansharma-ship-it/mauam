# Aurora Guardian — Weather, Emergency & News Dashboard

Premium consumer-grade UI. Aurora Glass palette (`#1a1a2e` / `#16213e` / mint `#4ade80` / violet `#a78bfa`), Outfit + Figtree typography, bento-grid dashboard, auto light/dark theme. All data mocked so the app is fully explorable without a backend.

## Design foundation

- **Palette**: Aurora Glass base + semantic weather tokens (sunny amber, rain sky, storm violet, flood deep-blue, heatwave orange, snow ice, safe mint, warning amber, critical red) and news-severity tokens (breaking red, official violet, advisory amber, info mint).
- **Typography**: Outfit (display) + Figtree (body) via `<link>` in `__root.tsx`.
- **Surfaces**: layered glass cards, aurora gradient washes on heroes, 20–24px radii, soft palette-tinted shadows, hairline `white/10` borders.
- **Motion**: fade/slide, drifting clouds & rain streaks (CSS SVG), animated aurora gradients, skeleton loaders, ticker marquee for breaking news, pulse for critical alerts — all gated by `prefers-reduced-motion`.
- **Icons**: Lucide only; custom inline SVG weather illustrations; no emojis.
- **Theme**: auto (system) with manual toggle, full light + dark tokens.

## Layout (bento, 12-col desktop → 6 tablet → 1 mobile)

```text
┌─────────────────────────────────────────────────────────────┐
│ TopBar: logo · search · location · theme · profile          │
├─────────────────────────────────────────────────────────────┤
│ 🚨 Sticky Emergency Alert Banner                            │
├─────────────────────────────────────────────────────────────┤
│ 📰 Breaking News Ticker (scrolling marquee)                 │
├─────────────────────────────────────────────────────────────┤
│ ┌── Hero Weather (2×2) ────────┐  ┌─ Prep Score ─┐          │
│ │ 72° · illustration · metrics │  └──────────────┘          │
│ └──────────────────────────────┘  ┌─ Travel Adv ─┐          │
│ ┌── Hourly ──┐ ┌── AI Assist ─┐   └──────────────┘          │
│ └────────────┘ └──────────────┘   ┌─ Shelters ───┐          │
│ ┌── 7-Day ────┐ ┌── Checklist ─┐  └──────────────┘          │
│ └─────────────┘ └──────────────┘                            │
│ ┌── Latest News (2col) ────────┐  ┌─ Contacts ───┐          │
│ │ featured + 3 headlines       │  └──────────────┘          │
│ │ "See all news" → /news       │  ┌─ Notifs ─────┐          │
│ └──────────────────────────────┘  └──────────────┘          │
│ ┌── Incident Map (2col) ───────┐  ┌─ Knowledge ──┐          │
│ └──────────────────────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## Routes

- `/` Dashboard
- `/news` Full news app
- `/news/$slug` Article detail
- `/map` Full incident/shelter map
- `/alerts` All alerts
- `/checklist` Full preparedness checklist
- `/knowledge` FAQ hub
- `/bookmarks` Saved articles
- `/settings` Location, theme, notification prefs

Every route sets its own `head()` (title, description, og:*, twitter:*).

## Dashboard modules

Hero weather · Alert banner · Breaking news ticker · Hourly forecast · 7-day forecast · Preparedness score · Checklist · AI assistant · Travel advisory · Nearby shelters · Incident map · Emergency contacts · Notifications · **Latest News widget** · Knowledge hub.

### Latest News dashboard widget

- Header: "Latest News" + category chip filter (All / Weather / Public Safety / Government) + "See all →"
- 1 featured card (large image, breaking badge, headline, source, time) + 3 compact headlines beneath
- Location-first ordering, official announcements pinned, breaking items outlined in critical red
- Bookmark + share icon on each item
- Skeleton loaders + empty/error states

## News page (`/news`)

Structured like a modern news app:

- **Breaking banner** (auto-rotating carousel of critical stories)
- **Featured story** (large hero card)
- **Category chips**: Weather · Floods · Cyclones · Heatwaves · Storms · Landslides · Earthquakes · Wildfires · Public Safety · Health Advisories · Transportation · Government Alerts
- **Search bar** (title + body + source filter)
- **Filter row**: location · time range · severity · source (official / verified)
- **Emergency Bulletins** rail (pinned official announcements)
- **Trending Topics** chips
- **Main feed**: image-rich cards, infinite-scroll pagination
- **Recent Updates timeline** (sidebar on desktop, collapsible on mobile)
- **News by location** section
- Skeleton loaders, empty state ("No news matches your filters"), error state with retry

### News card anatomy

Featured image · severity badge (Breaking / Critical / Advisory / Official / Info) · category chip · headline · 2-line summary · location · source (with verified checkmark) · relative published time · bookmark toggle · share menu · "Read More" → `/news/$slug`.

### Article detail (`/news/$slug`)

Hero image · breadcrumbs · title · source + verified badge · timestamps · location · severity · body (markdown-rendered mock) · related articles rail · bookmark + share bar · "Report inaccuracy" link.

### Smart features

- Location-first sorting (mock user location)
- Critical items visually elevated (red outline + subtle pulse)
- Official gov announcements pinned to top
- Breaking News banner appears for `severity: 'breaking'` items
- Bookmark stored in `localStorage` (surfaced on `/bookmarks`)
- Share via Web Share API with clipboard fallback
- Push-notification opt-in surface on `/settings` (UI only; wiring is future work)

### Trusted sources (mock)

National Meteorological Dept · National Disaster Management Agency · Government Emergency Services · Local Authorities · Verified News Orgs. Each source object carries `{ name, logo, verified: true, official: boolean }` and renders a checkmark badge.

## File plan

**Tokens & shell**
- `src/styles.css` — Aurora Glass tokens, weather + news-severity tokens, aurora gradients, glass shadows, keyframes (aurora drift, rain, float, pulse-alert, ticker-marquee), reduced-motion overrides, both `:root` + `.dark`.
- `src/routes/__root.tsx` — Outfit + Figtree `<link>`s, real app metadata (`Aurora Guardian — Weather, Emergency & News`), theme provider, keep `<Outlet />`.
- `src/components/theme-provider.tsx` — system-aware with manual override (localStorage read in `useEffect`).
- `src/components/app-shell.tsx` — top bar + sticky alert + breaking-news ticker slot + main container.

**Dashboard** (`src/components/dashboard/`)
`hero-weather.tsx`, `alert-banner.tsx`, `breaking-ticker.tsx`, `hourly-forecast.tsx`, `seven-day.tsx`, `preparedness-score.tsx`, `checklist.tsx`, `ai-assistant.tsx`, `travel-advisory.tsx`, `nearby-shelters.tsx`, `incident-map.tsx`, `emergency-contacts.tsx`, `notifications.tsx`, `latest-news-widget.tsx`, `knowledge-hub.tsx`, `glass-card.tsx`.

**News** (`src/components/news/`)
`breaking-banner.tsx`, `featured-story.tsx`, `category-chips.tsx`, `news-search.tsx`, `news-filters.tsx`, `news-card.tsx`, `news-card-compact.tsx`, `news-card-skeleton.tsx`, `trending-topics.tsx`, `emergency-bulletins.tsx`, `updates-timeline.tsx`, `bookmark-button.tsx`, `share-menu.tsx`, `severity-badge.tsx`, `source-badge.tsx`.

**Weather illustrations** (`src/components/weather-icons/`)
`sunny.tsx`, `partly-cloudy.tsx`, `cloudy.tsx`, `rain.tsx`, `storm.tsx`, `snow.tsx`, `fog.tsx`.

**Mock data** (`src/lib/mock/`)
`weather.ts`, `alerts.ts`, `shelters.ts`, `incidents.ts`, `contacts.ts`, `checklist.ts`, `faq.ts`, `notifications.ts`, `news.ts` (30+ articles across all categories/severities with sources), `sources.ts`.

**State** (`src/lib/`)
`use-bookmarks.ts` (localStorage-backed), `share.ts` (Web Share + clipboard fallback), `format-time.ts` (relative "2h ago").

**Routes**
`src/routes/index.tsx`, `news.tsx` (with `validateSearch` for `?category&q&location&severity`), `news.$slug.tsx`, `map.tsx`, `alerts.tsx`, `checklist.tsx`, `knowledge.tsx`, `bookmarks.tsx`, `settings.tsx` — each with unique `head()`.

## Technical notes

- Tailwind v4 tokens in `@theme inline`, no config file. Register weather + news-severity colors for utility classes.
- News list uses `IntersectionObserver` for infinite scroll over the mock array (paginated slices).
- News search + filters are URL-driven via `validateSearch` + `fallback()`.
- Map remains stylized SVG (no Mapbox/Leaflet) with absolutely positioned markers.
- All animations respect `prefers-reduced-motion`.
- Fully responsive down to 360px.

## Out of scope (call out after build)

Real weather API, real news feed integration (NWS/IMD/GDACS/RSS), real geolocation, real map SDK, real push notifications, auth, persistence beyond `localStorage` — all layerable later via Lovable Cloud + provider connectors.
