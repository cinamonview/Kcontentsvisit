// Saved (F-07) and visited (F-06) spots, kept on the device with AsyncStorage.
// There is no login in phase 1, so nothing is sent to a server.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const SAVED_KEY = 'trail.saved';
const VISITED_KEY = 'trail.visited';

type Trail = {
  saved: Set<number>;
  visited: Set<number>;
  toggleSaved: (spotId: number) => void;
  toggleVisited: (spotId: number) => void;
};

const TrailContext = createContext<Trail | null>(null);

async function loadIds(key: string): Promise<Set<number>> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return new Set(raw ? (JSON.parse(raw) as number[]) : []);
  } catch {
    return new Set();
  }
}

function persist(key: string, ids: Set<number>) {
  AsyncStorage.setItem(key, JSON.stringify([...ids])).catch(() => {
    // Storage can fail (e.g. full disk); the in-memory state still works for this session.
  });
}

function toggle(set: Set<number>, id: number) {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

/** Wrap the app with this (like a Provider/InheritedWidget in Flutter). */
export function TrailProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [visited, setVisited] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadIds(SAVED_KEY).then(setSaved);
    loadIds(VISITED_KEY).then(setVisited);
  }, []);

  const toggleSaved = useCallback((id: number) => {
    setSaved((prev) => {
      const next = toggle(prev, id);
      persist(SAVED_KEY, next);
      return next;
    });
  }, []);

  const toggleVisited = useCallback((id: number) => {
    setVisited((prev) => {
      const next = toggle(prev, id);
      persist(VISITED_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ saved, visited, toggleSaved, toggleVisited }),
    [saved, visited, toggleSaved, toggleVisited],
  );
  return <TrailContext.Provider value={value}>{children}</TrailContext.Provider>;
}

export function useTrail() {
  const trail = useContext(TrailContext);
  if (!trail) throw new Error('useTrail must be used inside TrailProvider');
  return trail;
}
