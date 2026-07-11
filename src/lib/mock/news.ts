export type NewsCategory =
  | "Weather"
  | "Floods"
  | "Cyclones"
  | "Heatwaves"
  | "Storms"
  | "Landslides"
  | "Earthquakes"
  | "Wildfires"
  | "Public Safety"
  | "Health Advisories"
  | "Transportation"
  | "Government Alerts";

export type NewsSeverity = "breaking" | "critical" | "advisory" | "official" | "info";

export type Source = { name: string; verified: boolean; official: boolean };

export type Article = {
  id: string;
  slug: string;
  headline: string;
  summary: string;
  body: string;
  category: NewsCategory;
  severity: NewsSeverity;
  location: string;
  publishedAt: string;
  source: Source;
  image: {
    hue: number;
    icon: "storm" | "flood" | "fire" | "heat" | "quake" | "wind" | "health" | "road" | "gov";
  };
  trending?: boolean;
  pinned?: boolean;
  url?: string;
  sourceUrl?: string;
};

const S = {
  nws: { name: "National Weather Service", verified: true, official: true },
  fema: { name: "FEMA Emergency Mgmt", verified: true, official: true },
  cdc: { name: "CDC Health Advisories", verified: true, official: true },
  dot: { name: "Dept. of Transportation", verified: true, official: true },
  reuters: { name: "Reuters", verified: true, official: false },
  ap: { name: "Associated Press", verified: true, official: false },
  bbc: { name: "BBC News", verified: true, official: false },
  local: { name: "SF Chronicle", verified: true, official: false },
} satisfies Record<string, Source>;

function ago(mins: number) {
  const d = new Date();
  d.setMinutes(d.getMinutes() - mins);
  return d.toISOString();
}

export const articles: Article[] = [
  {
    id: "n1",
    slug: "coastal-flood-warning-bay-area",
    headline: "Coastal Flood Warning issued for San Francisco Bay through evening",
    summary:
      "High tides combined with a Pacific storm system are expected to inundate low-lying coastal roads. Residents urged to avoid Embarcadero, Marina, and Ocean Beach approaches.",
    body: "The National Weather Service has issued a Coastal Flood Warning covering the greater San Francisco Bay area, effective immediately through 8 PM local time. Forecasters cite an unusually high tide cycle combined with sustained onshore winds and 2-4 inches of rainfall expected in the next 12 hours.\n\nCity officials have activated the Emergency Operations Center and pre-positioned pumps at three known flood-prone intersections. Residents in Zones A and B are advised to move vehicles to higher ground and prepare go-bags in case of evacuation.\n\nPublic transit is running on modified schedules; Muni and BART report intermittent service along the waterfront corridor.",
    category: "Floods",
    severity: "breaking",
    location: "San Francisco, CA",
    publishedAt: ago(12),
    source: S.nws,
    image: { hue: 235, icon: "flood" },
    pinned: true,
    trending: true,
  },
  {
    id: "n2",
    slug: "pacific-storm-intensifies",
    headline: "Pacific low intensifies overnight, wind gusts up to 60 mph forecast",
    summary:
      "A rapidly deepening low pressure system offshore will bring damaging winds and heavy rain to the Northern California coast overnight.",
    body: "A rapidly deepening low pressure system is undergoing bombogenesis off the Northern California coast and is expected to bring wind gusts of 45-60 mph along the immediate coastline overnight into tomorrow morning.\n\nUtility companies have staged crews in anticipation of widespread outages. Residents are advised to secure outdoor furniture, charge devices, and prepare for potential loss of power lasting 12-24 hours.",
    category: "Storms",
    severity: "critical",
    location: "Northern California",
    publishedAt: ago(35),
    source: S.reuters,
    image: { hue: 290, icon: "storm" },
    trending: true,
  },
  {
    id: "n3",
    slug: "governor-declares-state-emergency",
    headline: "Governor declares state of emergency for six coastal counties",
    summary:
      "The declaration unlocks state and federal resources ahead of an anticipated 72-hour severe weather event.",
    body: "The Governor's office announced a state of emergency covering six coastal counties, activating California Office of Emergency Services (Cal OES) mutual aid and requesting federal pre-positioning of FEMA resources.\n\nAffected counties: San Francisco, San Mateo, Marin, Sonoma, Santa Cruz, and Monterey. Residents can text SHELTER to 43362 to receive the nearest activated shelter location.",
    category: "Government Alerts",
    severity: "official",
    location: "State of California",
    publishedAt: ago(70),
    source: S.fema,
    image: { hue: 260, icon: "gov" },
    pinned: true,
  },
  {
    id: "n4",
    slug: "highway-101-southbound-closed",
    headline: "Highway 101 southbound closed at Sierra Point due to flooding",
    summary:
      "Caltrans crews are on scene. Detour via I-280 southbound; expect delays of 45-60 minutes.",
    body: "Caltrans has fully closed Highway 101 southbound at the Sierra Point exit after standing water reached vehicle-disabling depths. Motorists are being detoured to I-280 southbound. Estimated reopening: 6 PM.",
    category: "Transportation",
    severity: "advisory",
    location: "San Mateo County, CA",
    publishedAt: ago(95),
    source: S.dot,
    image: { hue: 45, icon: "road" },
    trending: true,
  },
  {
    id: "n5",
    slug: "sfusd-early-dismissal",
    headline: "SFUSD announces early dismissal across all K-12 schools",
    summary:
      "All San Francisco Unified schools will dismiss at 12:30 PM today. After-school programs cancelled.",
    body: "In coordination with the National Weather Service and city officials, San Francisco Unified School District has announced early dismissal at 12:30 PM. All after-school programs, athletic practices, and evening events are cancelled.\n\nParents unable to pick up students should call their school's front office. Shelter-in-place is available for students without safe transport home.",
    category: "Public Safety",
    severity: "official",
    location: "San Francisco, CA",
    publishedAt: ago(130),
    source: S.local,
    image: { hue: 200, icon: "gov" },
  },
  {
    id: "n6",
    slug: "pge-widespread-outages-expected",
    headline: "PG&E warns of widespread power outages during peak wind event",
    summary:
      "Public Safety Power Shutoffs (PSPS) may affect up to 180,000 customers across the Bay Area.",
    body: "Pacific Gas & Electric is preparing for potential Public Safety Power Shutoffs affecting up to 180,000 customers across nine counties as high winds threaten distribution infrastructure. Customers should charge devices, refill prescriptions, and prepare backup power for medical equipment.",
    category: "Public Safety",
    severity: "advisory",
    location: "Bay Area",
    publishedAt: ago(180),
    source: S.local,
    image: { hue: 45, icon: "wind" },
  },
  {
    id: "n7",
    slug: "wildfire-contained-lake-county",
    headline: "Wildfire near Clear Lake now 60% contained after 4 days",
    summary:
      "Cal Fire reports significant progress on the Ridge Fire as cooler temperatures and higher humidity aid containment.",
    body: "Cal Fire spokespeople reported this morning that the Ridge Fire burning in Lake County has reached 60% containment after four days. Cooler overnight temperatures and rising humidity have allowed ground crews to strengthen containment lines on the northeast flank.",
    category: "Wildfires",
    severity: "info",
    location: "Lake County, CA",
    publishedAt: ago(240),
    source: S.ap,
    image: { hue: 25, icon: "fire" },
    trending: true,
  },
  {
    id: "n8",
    slug: "heat-advisory-central-valley",
    headline: "Excessive Heat Warning for Central Valley through weekend",
    summary:
      "Temperatures may exceed 108°F. Cooling centers open in Sacramento, Stockton, and Fresno.",
    body: "The National Weather Service has issued an Excessive Heat Warning for the Central Valley through Sunday evening. Cooling centers are open in Sacramento, Stockton, Modesto, and Fresno with extended hours.\n\nHealth officials remind residents to check on elderly neighbors, never leave children or pets in vehicles, and limit outdoor activity to before 10 AM.",
    category: "Heatwaves",
    severity: "advisory",
    location: "Central Valley, CA",
    publishedAt: ago(300),
    source: S.nws,
    image: { hue: 50, icon: "heat" },
  },
  {
    id: "n9",
    slug: "cdc-air-quality-guidance",
    headline: "CDC issues respiratory health guidance for wildfire smoke exposure",
    summary:
      "Vulnerable populations urged to limit outdoor exposure and use N95 masks when AQI exceeds 150.",
    body: "The Centers for Disease Control and Prevention released updated guidance for communities affected by wildfire smoke. The advisory targets vulnerable populations including children, pregnant individuals, older adults, and those with cardiovascular or respiratory conditions.",
    category: "Health Advisories",
    severity: "official",
    location: "Western United States",
    publishedAt: ago(420),
    source: S.cdc,
    image: { hue: 195, icon: "health" },
  },
  {
    id: "n10",
    slug: "landslide-highway-1-big-sur",
    headline: "Landslide closes Highway 1 near Big Sur; reopening unclear",
    summary:
      "A significant slide covers both lanes of Highway 1 south of Bixby Bridge. Caltrans engineers evaluating stability.",
    body: "A major landslide activated by saturated soils has closed Highway 1 in both directions south of Bixby Bridge. Caltrans geotechnical engineers are on site evaluating slope stability before crews can safely begin clearing operations.",
    category: "Landslides",
    severity: "advisory",
    location: "Big Sur, CA",
    publishedAt: ago(560),
    source: S.dot,
    image: { hue: 30, icon: "road" },
  },
  {
    id: "n11",
    slug: "magnitude-4-2-earthquake-hollister",
    headline: "Magnitude 4.2 earthquake reported near Hollister, no damage",
    summary:
      "USGS confirms a magnitude 4.2 quake at 3:14 AM. Lightly felt across South Bay. No damage or injuries reported.",
    body: "The U.S. Geological Survey confirmed a magnitude 4.2 earthquake at 3:14 AM local time, centered 8 miles east of Hollister at a depth of 6.2 miles. The quake was lightly felt across the South Bay and Monterey Bay areas. No damage or injuries have been reported.",
    category: "Earthquakes",
    severity: "info",
    location: "Hollister, CA",
    publishedAt: ago(720),
    source: S.ap,
    image: { hue: 280, icon: "quake" },
  },
  {
    id: "n12",
    slug: "cyclone-forms-off-baja",
    headline: "Tropical cyclone forms off Baja coast, monitored for Pacific track",
    summary:
      "The National Hurricane Center is tracking a newly-named tropical storm that may influence Southern California moisture.",
    body: "The National Hurricane Center has upgraded a tropical disturbance off the Baja California coast to a named tropical storm. While the system is not forecast to make landfall along the U.S. West Coast, remnant moisture could enhance rainfall totals across Southern California later this week.",
    category: "Cyclones",
    severity: "info",
    location: "Pacific Ocean",
    publishedAt: ago(880),
    source: S.reuters,
    image: { hue: 250, icon: "storm" },
  },
];

export function breakingNews() {
  return articles.filter((a) => a.severity === "breaking" || a.severity === "critical");
}

export function findArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
