export type Severity = "info" | "advisory" | "warning" | "critical";

export type Alert = {
  id: string;
  title: string;
  body: string;
  severity: Severity;
  region: string;
  issued: string;
  expires: string;
  source: string;
};

export const alerts: Alert[] = [
  {
    id: "a1",
    title: "Coastal Flood Warning",
    body: "High tide combined with heavy rainfall may cause flooding along low-lying coastal roads. Avoid Embarcadero and Marina Blvd until 8 PM.",
    severity: "critical",
    region: "San Francisco Bay",
    issued: hoursAgo(1),
    expires: hoursAhead(6),
    source: "National Weather Service",
  },
  {
    id: "a2",
    title: "Wind Advisory",
    body: "West winds 20-30 mph with gusts up to 45 mph expected through the evening.",
    severity: "advisory",
    region: "Bay Area",
    issued: hoursAgo(3),
    expires: hoursAhead(9),
    source: "NWS Bay Area",
  },
  {
    id: "a3",
    title: "Air Quality Watch",
    body: "Fine particulate levels expected to reach moderate levels tomorrow. Sensitive groups take precautions.",
    severity: "info",
    region: "Bay Area",
    issued: hoursAgo(6),
    expires: hoursAhead(24),
    source: "Bay Area AQMD",
  },
];

function hoursAgo(h: number) {
  const d = new Date();
  d.setHours(d.getHours() - h);
  return d.toISOString();
}
function hoursAhead(h: number) {
  const d = new Date();
  d.setHours(d.getHours() + h);
  return d.toISOString();
}
