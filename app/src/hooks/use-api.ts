import { useEffect, useState } from 'react';

type Result<T> = { key: string; data?: T; error?: Error };

/**
 * Runs an api/ call and keeps its result in state.
 * (Similar to a FutureBuilder in Flutter.) Pass the inputs the call depends on as `deps`.
 * While a new call is running, the previous data stays on screen.
 */
export function useApi<T>(load: () => Promise<T>, deps: readonly unknown[]) {
  const key = JSON.stringify(deps);
  const [result, setResult] = useState<Result<T>>();

  useEffect(() => {
    let cancelled = false;
    load().then(
      (data) => !cancelled && setResult({ key, data }),
      (error: Error) => !cancelled && setResult({ key, error }),
    );
    return () => {
      cancelled = true;
    };
    // `load` is a new function every render; `key` captures what it depends on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const current = result?.key === key;
  return { data: result?.data, error: current ? result?.error : undefined, loading: !current };
}
