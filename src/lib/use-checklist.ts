import { useEffect, useState, useSyncExternalStore } from "react";
import { initialChecklist, type ChecklistItem } from "./mock/emergency";

const STORAGE_KEY = "mausam.checklist.v1";

type State = ChecklistItem[];

let state: State = initialChecklist;
const listeners = new Set<() => void>();

function load(): State {
  if (typeof window === "undefined") return initialChecklist;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialChecklist;
    const doneIds = new Set<string>(JSON.parse(raw));
    return initialChecklist.map((i) => ({ ...i, done: doneIds.has(i.id) }));
  } catch {
    return initialChecklist;
  }
}

function persist(next: State) {
  if (typeof window === "undefined") return;
  const doneIds = next.filter((i) => i.done).map((i) => i.id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(doneIds));
}

function setState(next: State) {
  state = next;
  persist(next);
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function getSnapshot() {
  return state;
}
function getServerSnapshot() {
  return initialChecklist;
}

let hydrated = false;

export function useChecklist() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [, force] = useState(0);

  useEffect(() => {
    if (!hydrated) {
      hydrated = true;
      state = load();
      listeners.forEach((l) => l());
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        state = load();
        listeners.forEach((l) => l());
        force((n) => n + 1);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = (id: string) => {
    setState(state.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  };

  return { items, toggle };
}
