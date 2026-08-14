// Простой in-memory кэш с TTL
export function createCache<T>(ttlMs: number) {
  const store = new Map<string, { value: T; expiresAt: number }>();

  return {
    get(key: string): T | undefined {
      const entry = store.get(key);
      if (!entry) return undefined;
      if (Date.now() > entry.expiresAt) {
        store.delete(key);
        return undefined;
      }
      return entry.value;
    },
    set(key: string, value: T): void {
      store.set(key, { value, expiresAt: Date.now() + ttlMs });
    },
  };
}
