// ============================================
// IN-MEMORY КЭШ С TTL
// ============================================

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

// ============================================
// PERSISTENT КЭШ (in-memory + localStorage)
// ============================================

/**
 * Кэш с TTL, который переживает перезагрузку страницы через localStorage.
 * При чтении: сначала in-memory, потом localStorage.
 * При записи: записывает в оба.
 * При истечении TTL: удаляет из обоих.
 */
export function createPersistentCache<T>(ttlMs: number, storageKey: string) {
  const memStore = new Map<string, { value: T; expiresAt: number }>();

  function readFromStorage(key: string): { value: T; expiresAt: number } | undefined {
    try {
      const raw = localStorage.getItem(`${storageKey}:${key}`);
      if (!raw) return undefined;
      const entry = JSON.parse(raw) as { value: T; expiresAt: number };
      if (Date.now() > entry.expiresAt) {
        localStorage.removeItem(`${storageKey}:${key}`);
        return undefined;
      }
      return entry;
    } catch {
      return undefined;
    }
  }

  function writeToStorage(key: string, value: T, expiresAt: number): void {
    try {
      localStorage.setItem(`${storageKey}:${key}`, JSON.stringify({ value, expiresAt }));
    } catch {
      // localStorage переполнен — игнорируем
    }
  }

  return {
    get(key: string): T | undefined {
      // Сначала in-memory
      const memEntry = memStore.get(key);
      if (memEntry) {
        if (Date.now() > memEntry.expiresAt) {
          memStore.delete(key);
          return undefined;
        }
        return memEntry.value;
      }

      // Потом localStorage
      const lsEntry = readFromStorage(key);
      if (lsEntry) {
        memStore.set(key, lsEntry); // поднимаем в in-memory
        return lsEntry.value;
      }

      return undefined;
    },

    set(key: string, value: T): void {
      const expiresAt = Date.now() + ttlMs;
      memStore.set(key, { value, expiresAt });
      writeToStorage(key, value, expiresAt);
    },
  };
}
