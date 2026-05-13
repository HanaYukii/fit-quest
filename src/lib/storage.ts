import { AppState, DEFAULT_STATE } from "./types";

const STORAGE_KEY = "fit-quest:v1";

export function loadState(): AppState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as AppState;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      settings: { ...DEFAULT_STATE.settings, ...(parsed.settings ?? {}) },
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded or storage disabled — silently ignore.
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function exportStateAsJSON(state: AppState): string {
  return JSON.stringify(state, null, 2);
}

export function importStateFromJSON(json: string): AppState | null {
  try {
    const parsed = JSON.parse(json);
    if (typeof parsed !== "object" || !parsed) return null;
    if (parsed.schemaVersion !== 1) return null;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      settings: { ...DEFAULT_STATE.settings, ...(parsed.settings ?? {}) },
    };
  } catch {
    return null;
  }
}
