## Goal
Replace the mocked news feed with real, location-aware news that refreshes in real time based on the user's active location.

## Approach

**Data source: GNews API** (free tier: 100 req/day, supports country + query + category, returns title/description/image/source/publishedAt). Requires an API key stored via `add_secret` as `GNEWS_API_KEY`.

Fallback if the user prefers no key: Google News RSS via `news.google.com/rss/search?q=<location>&hl=en-IN&gl=IN` parsed server-side (no key, but no images and less reliable). Default recommendation is GNews.

## Implementation

1. **Server function** `src/lib/news.functions.ts`
   - `fetchNews({ location, category, query })` via `createServerFn`.
   - Maps active location → country code + city query (e.g. Bengaluru → `country=in&q="Bengaluru" OR "Karnataka"`).
   - Category maps to GNews topics (`world`, `nation`, `business`, `health`, `science`, `technology`) plus custom queries for our domain categories (weather/disaster/safety/traffic → keyword queries like `"flood" OR "cyclone" OR "IMD"`).
   - Normalizes response → existing `Article` shape (id from URL hash, severity inferred from keywords: "red alert/evacuate/cyclone" → breaking; "warning/advisory" → warning; else info).
   - 5-minute in-memory cache per (location+category+query) key.

2. **Client integration**
   - `src/routes/news.tsx`: replace mock `articles` import with `useSuspenseQuery` calling the server fn, keyed on `[activeLocation.id, category, query, severity]`. Auto-refetch every 60s (`refetchInterval`). Skeleton loaders (already exist) shown during fetch; empty/error states already wired.
   - `src/routes/index.tsx` `LatestNewsWidget`: same hook, limited to top 6, refetch every 2 min.
   - `src/components/app-shell.tsx` `BreakingTicker`: pull breaking-severity items from same query.
   - `src/routes/news.$slug.tsx`: since IDs are URL-hashed, fetch article by re-querying and matching id, or pass through router state; simplest — store last-fetched list in a small query cache and look up by id, else show "Article no longer available".

3. **Location wiring**
   - Read `useLocations().active` inside the news route/widget.
   - Refetch automatically when active location changes (query key includes location id).
   - Show current location name in the news page header ("News for Bengaluru, IN").

4. **Bookmarks**
   - Keep existing localStorage bookmark ids. Store the full article payload alongside the id so bookmarked articles survive even if they drop out of the live feed.

5. **Secret setup**
   - Ask user to confirm GNews first, then `add_secret GNEWS_API_KEY` (obtained free at gnews.io).

## Files
- new: `src/lib/news.functions.ts`, `src/lib/news-mapping.ts`
- edit: `src/routes/news.tsx`, `src/routes/news.$slug.tsx`, `src/components/dashboard/latest-news-widget.tsx`, `src/components/app-shell.tsx` (ticker), `src/lib/use-bookmarks.ts` (store payload)
- keep: `src/lib/mock/news.ts` used only as a typing source + offline fallback

## Open question
Confirm **GNews** as the provider (recommended, needs a free key) — or prefer keyless Google News RSS (no images, lower quality)?
