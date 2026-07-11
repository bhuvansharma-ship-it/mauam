import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Article, NewsCategory, NewsSeverity } from "./mock/news";

const CategorySchema = z.enum([
  "All", "Weather", "Floods", "Cyclones", "Heatwaves", "Storms",
  "Landslides", "Earthquakes", "Wildfires", "Public Safety",
  "Health Advisories", "Transportation", "Government Alerts",
]);

const InputSchema = z.object({
  category: CategorySchema.default("All"),
  q: z.string().default(""),
  location: z.object({
    name: z.string(),
    region: z.string().optional(),
    country: z.string().optional(),
  }),
});

type ImageIcon = Article["image"]["icon"];

const CATEGORY_KEYWORDS: Record<Exclude<NewsCategory, never> | "All", string> = {
  "All": "weather OR flood OR cyclone OR earthquake OR emergency OR disaster",
  "Weather": "weather forecast OR rainfall OR IMD",
  "Floods": "flood OR flooding OR inundation",
  "Cyclones": "cyclone OR hurricane OR typhoon",
  "Heatwaves": "heatwave OR \"heat wave\" OR extreme heat",
  "Storms": "storm OR thunderstorm OR lightning",
  "Landslides": "landslide OR mudslide",
  "Earthquakes": "earthquake OR tremor OR seismic",
  "Wildfires": "wildfire OR \"forest fire\" OR bushfire",
  "Public Safety": "emergency OR \"public safety\" OR rescue",
  "Health Advisories": "health advisory OR outbreak OR epidemic",
  "Transportation": "traffic OR road closure OR flight cancellation OR train disruption",
  "Government Alerts": "government advisory OR NDMA OR emergency alert",
};

const COUNTRY_CC: Record<string, { gl: string; hl: string; ceid: string }> = {
  "India": { gl: "IN", hl: "en-IN", ceid: "IN:en" },
  "United States": { gl: "US", hl: "en-US", ceid: "US:en" },
  "United Kingdom": { gl: "GB", hl: "en-GB", ceid: "GB:en" },
  "Canada": { gl: "CA", hl: "en-CA", ceid: "CA:en" },
  "Australia": { gl: "AU", hl: "en-AU", ceid: "AU:en" },
};

function locale(country?: string) {
  if (country && COUNTRY_CC[country]) return COUNTRY_CC[country];
  return { gl: "US", hl: "en", ceid: "US:en" };
}

function categoryFromText(text: string): { category: NewsCategory; icon: ImageIcon; hue: number } {
  const t = text.toLowerCase();
  if (/flood|inundat|deluge/.test(t)) return { category: "Floods", icon: "flood", hue: 210 };
  if (/cyclone|hurricane|typhoon/.test(t)) return { category: "Cyclones", icon: "wind", hue: 260 };
  if (/heat\s?wave|extreme heat|scorching/.test(t)) return { category: "Heatwaves", icon: "heat", hue: 30 };
  if (/landslide|mudslide/.test(t)) return { category: "Landslides", icon: "quake", hue: 20 };
  if (/earthquake|tremor|seismic|magnitude/.test(t)) return { category: "Earthquakes", icon: "quake", hue: 10 };
  if (/wildfire|forest fire|bushfire|blaze/.test(t)) return { category: "Wildfires", icon: "fire", hue: 15 };
  if (/traffic|road|highway|flight|train|metro|transport/.test(t)) return { category: "Transportation", icon: "road", hue: 45 };
  if (/health|outbreak|virus|disease|advisory.*health/.test(t)) return { category: "Health Advisories", icon: "health", hue: 150 };
  if (/government|ministr|declare|order|ndma|fema/.test(t)) return { category: "Government Alerts", icon: "gov", hue: 260 };
  if (/storm|thunder|lightning/.test(t)) return { category: "Storms", icon: "storm", hue: 280 };
  if (/rescue|evacuat|safety|emergency/.test(t)) return { category: "Public Safety", icon: "gov", hue: 200 };
  return { category: "Weather", icon: "storm", hue: 235 };
}

function severityFromText(text: string): NewsSeverity {
  const t = text.toLowerCase();
  if (/red alert|evacuat|breaking|catastroph|devastat|killed|dead|casualt/.test(t)) return "breaking";
  if (/severe|warning|orange alert|major|emergency|critical|urgent/.test(t)) return "critical";
  if (/advisory|caution|watch|expected|forecast/.test(t)) return "advisory";
  if (/government|ministr|declare|official|department|authority/.test(t)) return "official";
  return "info";
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

function hashId(s: string) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return "n" + (h >>> 0).toString(36);
}

function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function stripTags(s: string): string {
  return decodeHtml(s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function pick(xml: string, tag: string): string | null {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = xml.match(re);
  if (!m) return null;
  const inner = m[1].trim();
  const cdata = inner.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  return cdata ? cdata[1] : inner;
}

function pickAttr(xml: string, tag: string, attr: string): string | null {
  const re = new RegExp(`<${tag}[^>]*\\b${attr}=["']([^"']+)["'][^>]*>`, "i");
  const m = xml.match(re);
  return m ? m[1] : null;
}

type CacheEntry = { at: number; data: Article[] };
const cache = new Map<string, CacheEntry>();
const CACHE_MS = 3 * 60 * 1000;

export const fetchNews = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<Article[]> => {
    const { category, q, location } = data;
    const loc = locale(location.country);
    const keywords = q.trim() || CATEGORY_KEYWORDS[category];
    const geo = [location.name, location.region].filter(Boolean).join(" ");
    const query = `(${keywords}) (${geo})`;
    const cacheKey = `${loc.gl}|${category}|${q}|${geo}`;

    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.at < CACHE_MS) return cached.data;

    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${loc.hl}&gl=${loc.gl}&ceid=${loc.ceid}`;

    try {
      const res = await fetch(url, {
        headers: { "user-agent": "Mozilla/5.0 (compatible; Mausam/1.0)" },
      });
      if (!res.ok) return [];
      const xml = await res.text();
      const items = xml.split(/<item>/i).slice(1).map((chunk) => "<item>" + chunk.split(/<\/item>/i)[0] + "</item>");

      const articles: Article[] = items.slice(0, 30).map((item) => {
        const title = stripTags(pick(item, "title") ?? "");
        const link = stripTags(pick(item, "link") ?? "");
        const pub = pick(item, "pubDate") ?? new Date().toISOString();
        const descRaw = pick(item, "description") ?? "";
        const description = stripTags(descRaw);
        const sourceName = stripTags(pick(item, "source") ?? "News");
        const sourceUrl = pickAttr(item, "source", "url") ?? undefined;
        const meta = categoryFromText(`${title} ${description}`);
        const overrideCat: NewsCategory = category === "All" ? meta.category : (category as NewsCategory);
        const severity = severityFromText(`${title} ${description}`);
        const publishedAt = new Date(pub).toISOString();
        const id = hashId(link || title);

        return {
          id,
          slug: slugify(title) || id,
          headline: title,
          summary: description || title,
          body: description || title,
          category: overrideCat,
          severity,
          location: [location.name, location.country].filter(Boolean).join(", "),
          publishedAt,
          source: {
            name: sourceName,
            verified: true,
            official: /government|ministry|ndma|fema|imd|police|department|authority|weather service/i.test(sourceName),
          },
          image: { hue: meta.hue, icon: meta.icon },
          url: link,
          sourceUrl,
          trending: severity === "breaking" || severity === "critical",
        } as Article;
      }).filter((a) => a.headline);

      cache.set(cacheKey, { at: Date.now(), data: articles });
      return articles;
    } catch {
      return [];
    }
  });
