let offset = 0;
let synced = false;

export async function syncTime(): Promise<void> {
  try {
    const localBefore = Date.now();
    const response = await fetch("https://time.google.com", {
      method: "HEAD",
      cache: "no-store",
    });
    const localAfter = Date.now();
    const dateHeader = response.headers.get("Date");
    if (!dateHeader) return;

    const serverTime = new Date(dateHeader).getTime();
    const localMid = (localBefore + localAfter) / 2;
    offset = serverTime - localMid;
    synced = true;
  } catch {
    // Fallback: use local clock (offset stays 0)
  }
}

export function getNow(): Date {
  return new Date(Date.now() + offset);
}

export function isSynced(): boolean {
  return synced;
}
