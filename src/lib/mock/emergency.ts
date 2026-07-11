export type Shelter = {
  id: string;
  name: string;
  distanceMi: number;
  capacity: number;
  filled: number;
  address: string;
  amenities: string[];
};

export const shelters: Shelter[] = [
  { id: "s1", name: "Moscone Community Center", distanceMi: 0.8, capacity: 500, filled: 210, address: "747 Howard St", amenities: ["Medical", "Pet-friendly", "Wi-Fi"] },
  { id: "s2", name: "Kezar Pavilion", distanceMi: 2.1, capacity: 350, filled: 90, address: "755 Stanyan St", amenities: ["Medical", "Family"] },
  { id: "s3", name: "Bill Graham Auditorium", distanceMi: 1.4, capacity: 800, filled: 340, address: "99 Grove St", amenities: ["Medical", "Wi-Fi", "Meals"] },
];

export type Contact = { id: string; name: string; phone: string; kind: "emergency" | "personal" };
export const contacts: Contact[] = [
  { id: "c1", name: "Emergency Services", phone: "911", kind: "emergency" },
  { id: "c2", name: "Poison Control", phone: "1-800-222-1222", kind: "emergency" },
  { id: "c3", name: "Non-emergency Police", phone: "415-553-0123", kind: "emergency" },
  { id: "c4", name: "Family — Mom", phone: "555-014-2288", kind: "personal" },
  { id: "c5", name: "Neighbor — Ana", phone: "555-014-9012", kind: "personal" },
];

export type Incident = { id: string; kind: "flood" | "fire" | "accident" | "outage"; x: number; y: number; label: string };
export const incidents: Incident[] = [
  { id: "i1", kind: "flood", x: 22, y: 62, label: "Embarcadero flooding" },
  { id: "i2", kind: "fire", x: 68, y: 30, label: "Brush fire — Twin Peaks" },
  { id: "i3", kind: "outage", x: 45, y: 48, label: "Power outage — Mission" },
  { id: "i4", kind: "accident", x: 78, y: 72, label: "Highway 101 collision" },
];

export type ChecklistItem = { id: string; group: string; text: string; done: boolean };
export const initialChecklist: ChecklistItem[] = [
  { id: "w1", group: "Water & Food", text: "Store 1 gallon of water per person per day (3 days)", done: true },
  { id: "w2", group: "Water & Food", text: "Non-perishable food for 3 days", done: true },
  { id: "p1", group: "Power & Light", text: "Flashlights + spare batteries", done: true },
  { id: "p2", group: "Power & Light", text: "Portable power bank charged", done: false },
  { id: "d1", group: "Documents", text: "Copies of ID, insurance, medical records", done: false },
  { id: "d2", group: "Documents", text: "Cash in small bills", done: false },
  { id: "m1", group: "Medical", text: "First-aid kit reviewed", done: true },
  { id: "m2", group: "Medical", text: "7-day medication supply", done: false },
  { id: "c1", group: "Comms", text: "Family meeting point agreed", done: true },
  { id: "c2", group: "Comms", text: "Emergency contact list printed", done: false },
];

export type FaqItem = { id: string; title: string; category: string; summary: string };
export const faq: FaqItem[] = [
  { id: "f1", title: "What to do during an earthquake", category: "Earthquake", summary: "Drop, Cover, and Hold On. Move away from windows and heavy objects." },
  { id: "f2", title: "Flood safety essentials", category: "Flood", summary: "Never walk or drive through flooded roads. Move to higher ground." },
  { id: "f3", title: "Wildfire evacuation checklist", category: "Wildfire", summary: "Prepare go-bag, know two evacuation routes, sign up for local alerts." },
  { id: "f4", title: "Extreme heat protection", category: "Heatwave", summary: "Hydrate, avoid outdoor activity 10 AM–4 PM, check on vulnerable neighbors." },
  { id: "f5", title: "Storm & tornado shelter", category: "Storm", summary: "Interior windowless room on lowest floor. Cover with blankets." },
  { id: "f6", title: "Power outage preparedness", category: "Public Safety", summary: "Keep refrigerator closed, unplug electronics, use flashlights not candles." },
];

export type Notif = { id: string; title: string; time: string; kind: "alert" | "news" | "system" };
export const notifications: Notif[] = [
  { id: "n1", title: "New Coastal Flood Warning issued for your area", time: mins(4), kind: "alert" },
  { id: "n2", title: "Storm coverage: Pacific low intensifies overnight", time: mins(22), kind: "news" },
  { id: "n3", title: "Preparedness score updated to 78", time: hrs(2), kind: "system" },
  { id: "n4", title: "3 new shelters activated within 5 miles", time: hrs(5), kind: "alert" },
];
function mins(m: number) { const d = new Date(); d.setMinutes(d.getMinutes() - m); return d.toISOString(); }
function hrs(h: number) { const d = new Date(); d.setHours(d.getHours() - h); return d.toISOString(); }
