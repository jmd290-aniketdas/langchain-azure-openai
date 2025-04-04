import { useEffect, useState } from "react";

export default function useLocalStorage<T>(
  keyName: string,
  defaultValue: T
): [T, (newValue: T) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const value = window.localStorage.getItem(keyName);

      if (value) {
        setStoredValue(JSON.parse(value));
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, []);

  const setValue = (newValue: T) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {}
    setStoredValue(newValue);
  };

  return [storedValue, setValue, loading];
}
