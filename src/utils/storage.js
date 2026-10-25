// Native robust browser storage using IndexedDB with fallback to localStorage
// This prevents QuotaExceededError (5MB limit) when storing multiple high-res product photos.

const DB_NAME = "monolith_app_db";
const STORE_NAME = "app_data";

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB not available"));
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getPersistentItem(key, defaultValue = null) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        if (req.result !== undefined && req.result !== null) {
          resolve(req.result);
        } else {
          // Fallback to localStorage
          try {
            const ls = localStorage.getItem(key);
            resolve(ls ? JSON.parse(ls) : defaultValue);
          } catch {
            resolve(defaultValue);
          }
        }
      };
      req.onerror = () => {
        try {
          const ls = localStorage.getItem(key);
          resolve(ls ? JSON.parse(ls) : defaultValue);
        } catch {
          resolve(defaultValue);
        }
      };
    });
  } catch {
    try {
      const ls = localStorage.getItem(key);
      return ls ? JSON.parse(ls) : defaultValue;
    } catch {
      return defaultValue;
    }
  }
}

export async function setPersistentItem(key, value) {
  // 1. Save to IndexedDB (virtually unlimited capacity)
  try {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put(value, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn("IndexedDB set failed:", err);
  }

  // 2. Safe attempt to save to localStorage as quick fallback (only if size allows)
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // QuotaExceededError is harmlessly caught here because IndexedDB already holds the data
    console.warn(`localStorage quota exceeded for ${key}, but safely stored in IndexedDB.`);
  }
}
