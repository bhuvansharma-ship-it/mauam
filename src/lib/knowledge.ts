import {
  Activity,
  CloudRain,
  Flame,
  Home,
  Thermometer,
  Waves,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type KnowledgeSection = {
  heading: string;
  points: string[];
};

export type KnowledgeTopic = {
  id: string;
  slug: string;
  category: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  hue: number;
  quickFacts: { label: string; value: string }[];
  sections: KnowledgeSection[];
  doNots: string[];
  sources: { name: string; url: string }[];
};

export const knowledge: KnowledgeTopic[] = [
  {
    id: "f1",
    slug: "earthquake",
    category: "Earthquake",
    title: "What to do during an earthquake",
    summary: "Drop, Cover, and Hold On. Stay away from windows and heavy objects that can fall.",
    icon: Activity,
    hue: 15,
    quickFacts: [
      { label: "Warning time", value: "Seconds" },
      { label: "Safe zone", value: "Under sturdy furniture" },
      { label: "After-shock window", value: "Hours to days" },
    ],
    sections: [
      {
        heading: "Before",
        points: [
          "Secure heavy furniture, water heaters and TVs to wall studs.",
          "Identify Drop-Cover-Hold spots in every room — sturdy desks, interior walls away from glass.",
          "Store a go-bag with water (3 L per person), shoes, a whistle, medications and copies of ID.",
          "Practise a family drill twice a year and agree on an out-of-area contact everyone will text.",
        ],
      },
      {
        heading: "During shaking",
        points: [
          "DROP to your hands and knees before the quake knocks you down.",
          "COVER your head and neck with one arm; crawl under a sturdy table if one is within reach.",
          "HOLD ON to your shelter and move with it until the shaking stops (typically under 60 seconds).",
          "If in bed, stay there and cover your head with a pillow. If driving, pull over away from bridges, overpasses and power lines.",
          "Do NOT run outside during shaking — most injuries happen from falling debris at exits.",
        ],
      },
      {
        heading: "After",
        points: [
          "Expect aftershocks; Drop-Cover-Hold again for each one.",
          "Check yourself and others for injuries; give first aid before moving seriously injured people.",
          "Smell gas or hear hissing? Shut off the main valve, open windows, leave and call from outside.",
          "Text — do not call — to keep voice networks open for emergencies.",
          "Inspect the home for cracks in the chimney, foundation and gas lines before re-entering.",
        ],
      },
    ],
    doNots: [
      "Do not stand in a doorway — modern doorways are no stronger than the rest of the house.",
      "Do not use elevators.",
      "Do not light matches or flip switches until you have confirmed there is no gas leak.",
    ],
    sources: [
      {
        name: "US Geological Survey",
        url: "https://www.usgs.gov/programs/earthquake-hazards/science/drop-cover-and-hold",
      },
      { name: "Ready.gov — Earthquakes", url: "https://www.ready.gov/earthquakes" },
    ],
  },
  {
    id: "f2",
    slug: "flood",
    category: "Flood",
    title: "Flood safety essentials",
    summary:
      "Never walk or drive through flood water. Move to higher ground the moment a warning is issued.",
    icon: Waves,
    hue: 210,
    quickFacts: [
      { label: "Vehicle risk", value: "30 cm floats a car" },
      { label: "Foot risk", value: "15 cm knocks you down" },
      { label: "Boil-water advisory", value: "Common after floods" },
    ],
    sections: [
      {
        heading: "Before the water rises",
        points: [
          "Know your zone — check the local flood map and note the nearest higher ground and shelter.",
          "Elevate electricals, appliances and valuables above the historical flood line.",
          "Keep sandbags, plastic sheeting and a battery radio ready during monsoon or hurricane season.",
          "Photograph rooms and belongings for insurance; store copies in the cloud.",
        ],
      },
      {
        heading: "When a warning is issued",
        points: [
          "Move to higher ground immediately — do not wait for instructions if water is visibly rising.",
          "Disconnect electricity at the main breaker before water reaches outlets.",
          "Fill bathtubs and bottles with clean water in case supply is cut or contaminated.",
          "Bring pets indoors; large livestock should already be on higher ground.",
        ],
      },
      {
        heading: "During and after",
        points: [
          "Turn Around, Don't Drown — 15 cm of moving water sweeps adults off their feet; 60 cm floats most vehicles.",
          "Assume all flood water is contaminated with sewage, chemicals and debris; wear boots and gloves.",
          "Do not return home until authorities declare it safe and utilities have been inspected.",
          "Boil tap water for at least 1 minute (3 minutes at altitude) until a boil-water notice is lifted.",
        ],
      },
    ],
    doNots: [
      "Do not drive around barricades — they are placed where the road is unsafe.",
      "Do not touch electrical equipment while wet or standing in water.",
      "Do not let children play in flood water.",
    ],
    sources: [
      { name: "NOAA — Turn Around Don't Drown", url: "https://www.weather.gov/safety/flood" },
      { name: "NDMA India — Floods", url: "https://ndma.gov.in/Natural-Hazards/Floods" },
    ],
  },
  {
    id: "f3",
    slug: "wildfire",
    category: "Wildfire",
    title: "Wildfire evacuation checklist",
    summary:
      "Prepare a go-bag, memorise two evacuation routes and leave early — do not wait for a mandatory order.",
    icon: Flame,
    hue: 20,
    quickFacts: [
      { label: "Ignition distance", value: "Embers travel 1–2 km" },
      { label: "Defensible space", value: "30 m minimum" },
      { label: "AQI danger", value: "> 150 for sensitive groups" },
    ],
    sections: [
      {
        heading: "Harden your home",
        points: [
          "Clear a 30-metre defensible zone: no dry leaves, wood piles or propane tanks against the house.",
          "Trim tree branches so they are at least 3 metres from the roof and chimney.",
          "Install ember-resistant vents and enclose eaves; embers cause most home losses, not the flame front.",
          "Keep hoses connected to every outdoor tap and mark them clearly.",
        ],
      },
      {
        heading: "Go-bag (per person)",
        points: [
          "N95 masks and safety goggles for smoke.",
          "3 days of water, non-perishable food and any medications.",
          "Copies of ID, insurance, deeds and a USB with family photos.",
          "Sturdy shoes, cotton long-sleeves, torch, spare phone charger and cash in small bills.",
          "Pet carriers, leashes, food and vaccination records.",
        ],
      },
      {
        heading: "When you evacuate",
        points: [
          "Leave early — traffic and low visibility from smoke make late departures deadly.",
          "Know two routes out; the primary road often closes first.",
          "Close all windows and doors but leave them unlocked for firefighters.",
          "Turn off gas at the meter and pilot lights; leave outside lights on so crews can see through smoke.",
          "Register with your county's evacuation tracker so responders know you are out.",
        ],
      },
    ],
    doNots: [
      "Do not return until officials lift the evacuation order — hot spots reignite for days.",
      "Do not rely on garden hoses alone to defend a home against a fire front.",
      "Do not shelter in a swimming pool — the heat and smoke can be lethal.",
    ],
    sources: [
      { name: "CAL FIRE — Ready, Set, Go!", url: "https://readyforwildfire.org/" },
      {
        name: "US Forest Service — Wildfire Prep",
        url: "https://www.fs.usda.gov/managing-land/fire",
      },
    ],
  },
  {
    id: "f4",
    slug: "heatwave",
    category: "Heatwave",
    title: "Extreme heat protection",
    summary:
      "Hydrate, avoid outdoor work 10 AM–4 PM and check on elderly neighbours and outdoor workers.",
    icon: Thermometer,
    hue: 30,
    quickFacts: [
      { label: "High risk", value: "Over 40 °C / 104 °F" },
      { label: "Hydration", value: "2–3 L water/day" },
      { label: "Danger sign", value: "No sweat + confusion" },
    ],
    sections: [
      {
        heading: "Cool the body",
        points: [
          "Drink water on a schedule — do not wait to feel thirsty; add oral rehydration salts if sweating heavily.",
          "Wear loose, light-coloured cotton and a wide-brimmed hat outdoors.",
          "Take cool showers, use damp cloths on wrists, neck and forehead, and sit in front of a fan with a wet towel.",
          "If without AC, move to a cooling centre, library, mall or metro station during peak hours.",
        ],
      },
      {
        heading: "Cool the home",
        points: [
          "Close curtains and blinds on the sunny side during the day; open windows once it is cooler outside than inside.",
          "Cook with the microwave, kettle or outdoor grill instead of the oven.",
          "Unplug non-essential electronics — they add heat and raise indoor temperature.",
        ],
      },
      {
        heading: "Recognise heat illness",
        points: [
          "Heat cramps: muscle pain — move to a cool place, hydrate with electrolytes.",
          "Heat exhaustion: heavy sweat, weakness, headache, nausea — cool the body, sip water, seek shade for 30 min.",
          "Heat stroke (medical emergency): body ≥ 40 °C, hot dry skin, confusion, seizures. Call emergency services, move to shade, cool aggressively with wet cloths and fanning until help arrives.",
        ],
      },
    ],
    doNots: [
      "Do not leave children, elderly or pets in a parked vehicle — cabin temperatures spike within minutes.",
      "Do not drink alcohol or sugary drinks during peak heat.",
      "Do not exercise outdoors between 10 AM and 4 PM during a heat warning.",
    ],
    sources: [
      { name: "CDC — Extreme Heat", url: "https://www.cdc.gov/disasters/extremeheat/" },
      {
        name: "IMD — Heatwave Guidelines",
        url: "https://mausam.imd.gov.in/imd_latest/contents/heatwave.php",
      },
    ],
  },
  {
    id: "f5",
    slug: "storm-tornado",
    category: "Storm",
    title: "Storm & tornado shelter",
    summary:
      "Take shelter in an interior windowless room on the lowest floor. Cover yourself with blankets or a mattress.",
    icon: Wind,
    hue: 280,
    quickFacts: [
      { label: "Tornado warning", value: "Take cover NOW" },
      { label: "Safe room", value: "Interior, no windows" },
      { label: "Lightning rule", value: "30 sec = come inside" },
    ],
    sections: [
      {
        heading: "Watch vs Warning",
        points: [
          "Watch = conditions are favourable. Review your plan and stay near shelter.",
          "Warning = a tornado or severe storm is imminent or spotted. Take cover immediately.",
          "Enable Wireless Emergency Alerts on your phone; keep a battery-powered NOAA radio as a backup.",
        ],
      },
      {
        heading: "Take shelter",
        points: [
          "Best: a purpose-built safe room or basement.",
          "Second best: an interior room on the lowest floor — bathroom, closet or hallway with no exterior walls or windows.",
          "Get under a heavy table or workbench and cover your head and neck with your arms.",
          "Put on shoes and a helmet (bike, sports) to protect against debris.",
          "If in a mobile home or vehicle, leave immediately for a sturdy building; if none is available, lie flat in the lowest ditch you can find and cover your head.",
        ],
      },
      {
        heading: "After the storm",
        points: [
          "Stay away from downed power lines and standing water — assume both are energised.",
          "Do not use candles; use a torch to check for gas leaks and structural damage.",
          "Wear sturdy shoes and gloves while cleaning debris; broken glass and nails cause most post-storm injuries.",
        ],
      },
    ],
    doNots: [
      "Do not shelter under an overpass — wind speeds accelerate underneath.",
      "Do not open windows to 'equalise pressure' — it wastes precious seconds and does not help.",
      "Do not try to outrun a tornado in city traffic.",
    ],
    sources: [
      { name: "NWS Storm Prediction Center", url: "https://www.spc.noaa.gov/" },
      { name: "Ready.gov — Tornadoes", url: "https://www.ready.gov/tornadoes" },
    ],
  },
  {
    id: "f6",
    slug: "power-outage",
    category: "Public Safety",
    title: "Power outage preparedness",
    summary:
      "Keep the fridge closed, unplug electronics, use torches instead of candles, and watch for CO poisoning from generators.",
    icon: Zap,
    hue: 200,
    quickFacts: [
      { label: "Fridge safety", value: "4 hrs closed" },
      { label: "Freezer safety", value: "48 hrs full / 24 hrs half" },
      { label: "Generator distance", value: "≥ 6 m from windows" },
    ],
    sections: [
      {
        heading: "In the first 10 minutes",
        points: [
          "Report the outage to your utility and check the estimated restoration time.",
          "Unplug computers, TVs and appliances to protect against a power surge when service returns.",
          "Leave one lamp switched on so you know the moment power is restored.",
          "Turn the fridge and freezer to the coldest setting before the temperature rises.",
        ],
      },
      {
        heading: "Stay safe indoors",
        points: [
          "Use battery torches and headlamps — candles cause many home fires each year.",
          "Dress in layers or seek a cooling/warming centre if the outage is prolonged.",
          "Keep phones charged with a power bank; a car USB port also works if you can safely reach the vehicle.",
          "In winter, close off unused rooms and stuff towels under doors to keep heat in the room you are using.",
        ],
      },
      {
        heading: "Generator and carbon monoxide safety",
        points: [
          "NEVER run a generator, grill or camp stove indoors, in a garage, basement or near open windows.",
          "Place generators at least 6 metres from doors, windows and vents; install a battery-powered CO alarm on every level of the home.",
          "If anyone develops headache, dizziness or nausea, get everyone outside and call emergency services.",
        ],
      },
      {
        heading: "Food safety",
        points: [
          "A closed fridge keeps food safe for about 4 hours; a full freezer for 48 hours (24 if half-full).",
          "When in doubt, throw it out — bacteria multiply rapidly above 4 °C / 40 °F.",
          "Use a cooler with ice or dry ice for medications that must stay cold (insulin, some vaccines).",
        ],
      },
    ],
    doNots: [
      "Do not use a gas oven for heating.",
      "Do not approach downed power lines — assume they are live and stay at least 10 metres away.",
      "Do not open the freezer repeatedly to check food.",
    ],
    sources: [
      { name: "Ready.gov — Power Outages", url: "https://www.ready.gov/power-outages" },
      { name: "CDC — Generator CO Safety", url: "https://www.cdc.gov/co/faqs.htm" },
    ],
  },
  {
    id: "f7",
    slug: "cyclone",
    category: "Cyclone",
    title: "Cyclone & hurricane readiness",
    summary:
      "Track the forecast, secure the outside of your home, and be ready to evacuate coastal and low-lying areas 24–48 hours early.",
    icon: Wind,
    hue: 260,
    quickFacts: [
      { label: "Wind risk", value: "≥ 120 km/h flying debris" },
      { label: "Storm surge", value: "Deadliest hazard" },
      { label: "Lead time", value: "24–72 hours" },
    ],
    sections: [
      {
        heading: "72 hours out",
        points: [
          "Follow the local meteorological service (IMD, NHC) and note the forecast track and expected landfall time.",
          "Fuel vehicles, refill medications and withdraw some cash — ATMs and pumps fail in outages.",
          "Charge phones, power banks, radios and torches. Freeze water bottles to keep the fridge cold longer.",
          "Confirm your evacuation route and destination if you live in a surge or flood zone.",
        ],
      },
      {
        heading: "24 hours out",
        points: [
          "Board or tape windows only if instructed; permanent storm shutters are far safer.",
          "Bring in or tie down anything the wind can lift — furniture, planters, bins, garden tools, umbrellas.",
          "Fill bathtubs and buckets for washing and flushing after the storm.",
          "Move valuables and electronics upstairs; put important documents in a waterproof bag.",
        ],
      },
      {
        heading: "During landfall",
        points: [
          "Stay indoors in an interior room on the lowest safe floor away from windows.",
          "If the eye passes over, the calm is temporary — do NOT go outside; winds return from the opposite direction.",
          "Listen to the radio for official updates; mobile networks may fail.",
        ],
      },
      {
        heading: "After",
        points: [
          "Wait for authorities to confirm it is safe to leave shelter.",
          "Watch for downed lines, blocked roads, gas leaks and contaminated water.",
          "Take photos of any damage before starting cleanup — insurers will need them.",
        ],
      },
    ],
    doNots: [
      "Do not shelter in a mobile home, RV or vehicle — wind and surge will destroy them.",
      "Do not walk or drive through flooded streets after the storm.",
      "Do not run generators indoors (see Power outage section for CO safety).",
    ],
    sources: [
      { name: "National Hurricane Center", url: "https://www.nhc.noaa.gov/prepare/ready.php" },
      { name: "NDMA India — Cyclones", url: "https://ndma.gov.in/Natural-Hazards/Cyclone" },
    ],
  },
  {
    id: "f8",
    slug: "home-emergency-kit",
    category: "Preparedness",
    title: "Build a 72-hour home emergency kit",
    summary:
      "One kit, well-stocked, checked every six months — the single highest-leverage preparedness step for any household.",
    icon: Home,
    hue: 150,
    quickFacts: [
      { label: "Water", value: "4 L / person / day" },
      { label: "Food", value: "3 days non-perishable" },
      { label: "Review", value: "Every 6 months" },
    ],
    sections: [
      {
        heading: "Water & food",
        points: [
          "4 litres of water per person per day for at least 3 days (drinking + basic hygiene).",
          "3-day supply of ready-to-eat food: canned beans, dried fruit, nut butter, energy bars, infant formula, pet food.",
          "Manual can opener, mess kit, sealable bags, small camping stove with fuel stored outdoors.",
        ],
      },
      {
        heading: "Light, power & communication",
        points: [
          "Two LED torches with spare batteries — one by the bed, one in the kit.",
          "Battery or hand-crank NOAA / AIR weather radio.",
          "Two power banks (≥ 10 000 mAh) kept charged, plus cables for every device.",
          "Whistle to signal for help; laminated list of emergency and family contacts.",
        ],
      },
      {
        heading: "Health & documents",
        points: [
          "Comprehensive first-aid kit and a 7-day supply of prescription medications rotated regularly.",
          "N95 masks, hand sanitiser, moist towelettes, garbage bags with ties.",
          "Waterproof pouch with copies of ID, insurance, deeds, prescriptions, and family photos.",
          "Small cash reserve in low denominations.",
        ],
      },
      {
        heading: "Comfort & clothing",
        points: [
          "One change of clothes and sturdy shoes per person; rain gear and a warm layer.",
          "Emergency blanket or sleeping bag per person.",
          "Books, cards or small toys for children; comfort items reduce stress in shelters.",
        ],
      },
    ],
    doNots: [
      "Do not store the kit only in the basement if you live in a flood zone.",
      "Do not forget pet supplies — food, leash, carrier, vaccination records.",
      "Do not let batteries and medications expire — set a calendar reminder every 6 months.",
    ],
    sources: [
      { name: "Ready.gov — Build a Kit", url: "https://www.ready.gov/kit" },
      {
        name: "Red Cross — Survival Kit",
        url: "https://www.redcross.org/get-help/how-to-prepare-for-emergencies/survival-kit-supplies.html",
      },
    ],
  },
  {
    id: "f9",
    slug: "severe-rain-urban-flood",
    category: "Flood",
    title: "Severe rain & urban flooding",
    summary:
      "Cities flash-flood fast. Move off streets, avoid basements and underpasses, and never drive into standing water.",
    icon: CloudRain,
    hue: 220,
    quickFacts: [
      { label: "Flash flood onset", value: "Minutes" },
      { label: "Underpass depth", value: "Can double quickly" },
      { label: "Sewer risk", value: "Contaminated water" },
    ],
    sections: [
      {
        heading: "If you are outdoors",
        points: [
          "Move to higher ground away from drains, canals, rivers and low-lying roads.",
          "Assume water is contaminated with sewage and may hide manholes and downed cables.",
          "Do not shelter under trees or metal structures during heavy thunderstorms.",
        ],
      },
      {
        heading: "If you are driving",
        points: [
          "Turn around at any flooded road — most flood deaths happen inside vehicles.",
          "If the vehicle stalls in rising water, abandon it and move to higher ground on foot.",
          "Never drive around barricades; roads may be washed out beneath the surface.",
        ],
      },
      {
        heading: "If you are at home",
        points: [
          "Move to an upper floor if water enters the building; take phone, torch, medications and shoes.",
          "Turn off electricity at the main breaker before water reaches outlets — only if you can do it safely and dry.",
          "Do not enter flooded basements — mixing water and electricity is lethal.",
          "Boil tap water until authorities confirm it is safe.",
        ],
      },
    ],
    doNots: [
      "Do not walk through moving water more than knee-deep.",
      "Do not use gas or electric appliances that have been submerged.",
      "Do not swim or play in flood water.",
    ],
    sources: [
      {
        name: "NDMA India — Urban Flooding",
        url: "https://ndma.gov.in/Natural-Hazards/Urban-Flooding",
      },
      { name: "NOAA — Flood Safety", url: "https://www.weather.gov/safety/flood" },
    ],
  },
];

export function findTopic(slug: string): KnowledgeTopic | undefined {
  return knowledge.find((k) => k.slug === slug);
}
