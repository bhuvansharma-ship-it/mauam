import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useChecklist } from "@/lib/use-checklist";

describe("useChecklist", () => {
  it("exposes items with expected shape", () => {
    const { result } = renderHook(() => useChecklist());
    expect(result.current.items.length).toBeGreaterThan(0);
    for (const i of result.current.items) {
      expect(i).toHaveProperty("id");
      expect(i).toHaveProperty("text");
      expect(typeof i.done).toBe("boolean");
    }
  });

  it("toggle() flips done and persists to localStorage", () => {
    const { result } = renderHook(() => useChecklist());
    const first = result.current.items[0];
    const originally = first.done;
    act(() => result.current.toggle(first.id));
    const after = result.current.items.find((x) => x.id === first.id)!;
    expect(after.done).toBe(!originally);

    const stored = JSON.parse(window.localStorage.getItem("aurora.checklist.v1") ?? "[]");
    expect(Array.isArray(stored)).toBe(true);
  });

  it("shares state across two hook instances", () => {
    const a = renderHook(() => useChecklist());
    const b = renderHook(() => useChecklist());
    const target = a.result.current.items[1];
    act(() => a.result.current.toggle(target.id));
    const bItem = b.result.current.items.find((x) => x.id === target.id)!;
    expect(bItem.done).toBe(a.result.current.items.find((x) => x.id === target.id)!.done);
  });
});
