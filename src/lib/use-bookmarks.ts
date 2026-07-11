import { useEffect, useState, useCallback } from "react";
import type { Article } from "./mock/news";

const KEY = "ag:bookmarks";
const KEY_PAYLOAD = "ag:bookmarks:payload";

type Store = Record<string, Article>;

function readStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY_PAYLOAD) || "{}") as Store;
  } catch {
    return {};
  }
}

export function useBookmarks() {
  const [ids, setIds] = useState<string[]>([]);
  const [store, setStore] = useState<Store>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {}
    setStore(readStore());
  }, []);

  const persistIds = (next: string[]) => {
    setIds(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };

  const persistStore = (next: Store) => {
    setStore(next);
    try {
      localStorage.setItem(KEY_PAYLOAD, JSON.stringify(next));
    } catch {}
  };

  const toggle = useCallback((id: string, article?: Article) => {
    setIds((prev) => {
      const has = prev.includes(id);
      const next = has ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      const current = readStore();
      if (has) delete current[id];
      else if (article) current[id] = article;
      try {
        localStorage.setItem(KEY_PAYLOAD, JSON.stringify(current));
      } catch {}
      setStore(current);
      return next;
    });
  }, []);

  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const articles = useCallback(
    () => ids.map((id) => store[id]).filter((a): a is Article => Boolean(a)),
    [ids, store],
  );

  return { ids, has, toggle, set: persistIds, setStore: persistStore, articles };
}
