import { describe, expect, it } from "vitest";
import { assessAdvisory, condition, haversineKm } from "../../src/lib/travel.pure";

describe("condition()", () => {
  it("maps known WMO codes", () => {
    expect(condition(0)).toBe("Clear sky");
    expect(condition(95)).toBe("Thunderstorm");
    expect(condition(75)).toBe("Heavy snow");
  });
  it("falls back to Unknown", () => {
    expect(condition(1234)).toBe("Unknown");
  });
});

describe("haversineKm()", () => {
  it("returns 0 for identical points", () => {
    expect(haversineKm({ lat: 12.97, lon: 77.59 }, { lat: 12.97, lon: 77.59 })).toBe(0);
  });
  it("approximates Delhi→Mumbai (~1160 km)", () => {
    const d = haversineKm({ lat: 28.6, lon: 77.2 }, { lat: 19.07, lon: 72.87 });
    expect(d).toBeGreaterThan(1100);
    expect(d).toBeLessThan(1200);
  });
  it("approximates London→Paris (~340 km)", () => {
    const d = haversineKm({ lat: 51.5, lon: -0.12 }, { lat: 48.86, lon: 2.35 });
    expect(d).toBeGreaterThan(300);
    expect(d).toBeLessThan(380);
  });
});

const base = {
  tempC: 22,
  tempMaxC: 25,
  tempMinC: 15,
  precipMm: 0,
  windKph: 8,
  windGustKph: 12,
  weatherCode: 1,
};

describe("assessAdvisory()", () => {
  it("returns safe for a calm clear day", () => {
    const r = assessAdvisory(base);
    expect(r.level).toBe("safe");
    expect(r.reasons).toHaveLength(0);
    expect(r.tips.length).toBeGreaterThan(0);
  });

  it("returns danger for a thunderstorm", () => {
    const r = assessAdvisory({ ...base, weatherCode: 95 });
    expect(r.level).toBe("danger");
    expect(r.headline).toMatch(/postpone/i);
    expect(r.reasons.join(" ")).toMatch(/Thunderstorm/);
  });

  it("returns warning for damaging gusts alone", () => {
    const r = assessAdvisory({ ...base, windGustKph: 80 });
    expect(r.level).toBe("warning");
    expect(r.reasons.join(" ")).toMatch(/gusts/);
  });

  it("flags extreme heat", () => {
    const r = assessAdvisory({ ...base, tempMaxC: 42 });
    expect(r.level).toBe("warning");
    expect(r.tips.join(" ")).toMatch(/hydrate/i);
  });

  it("flags extreme cold", () => {
    const r = assessAdvisory({ ...base, tempMinC: -15 });
    expect(r.level).toBe("warning");
    expect(r.tips.join(" ")).toMatch(/frostbite|black ice/i);
  });

  it("caution for light hot day", () => {
    const r = assessAdvisory({ ...base, tempMaxC: 36 });
    expect(r.level).toBe("caution");
  });

  it("compounds heavy rain + high winds to danger", () => {
    const r = assessAdvisory({
      ...base,
      weatherCode: 82,
      precipMm: 30,
      windGustKph: 75,
    });
    expect(r.level).toBe("danger");
  });
});
