import { useCallback, useEffect, useState } from "react";

/** State synced to localStorage. Reads after mount so server and first client render match. */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw));
    } catch {
      /* corrupted value — fall back to the initial value */
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or disabled — keep working in memory */
    }
  }, [key, value, loaded]);

  const set = useCallback((next) => setValue(next), []);
  return [value, set, loaded];
}
