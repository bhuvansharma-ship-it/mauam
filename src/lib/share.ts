export async function shareOrCopy(data: { title: string; text?: string; url: string }) {
  try {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      await (navigator as Navigator & { share: (d: ShareData) => Promise<void> }).share(data);
      return "shared" as const;
    }
  } catch { /* ignore */ }
  try {
    await navigator.clipboard.writeText(data.url);
    return "copied" as const;
  } catch {
    return "failed" as const;
  }
}
