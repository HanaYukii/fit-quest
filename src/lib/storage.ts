import { AppState, DEFAULT_STATE, UserProfile, AppSettings } from "./types";

const STORAGE_KEY = "fit-quest:v1"; // legacy key, kept for migration
const STORAGE_KEY_V2 = "fit-quest:v2";

type AnyParsed = {
  schemaVersion?: number;
  profile?: UserProfile | null;
  settings?: Partial<AppSettings>;
};

function migrate(parsed: AnyParsed | null): AppState {
  if (!parsed) return DEFAULT_STATE;
  if (parsed.schemaVersion === 2) {
    return {
      ...DEFAULT_STATE,
      ...(parsed as AppState),
      settings: {
        ...DEFAULT_STATE.settings,
        ...(parsed.settings ?? {}),
      },
    };
  }
  if (parsed.schemaVersion === 1) {
    // v1 tasks used a different schema (category vs pillar/family). We keep
    // the profile and settings the user set up, but reset task history and
    // achievements so the new generator/streak rules start from a clean slate.
    return {
      ...DEFAULT_STATE,
      profile: parsed.profile ?? null,
      settings: {
        ...DEFAULT_STATE.settings,
        ...(parsed.settings ?? {}),
      },
    };
  }
  return DEFAULT_STATE;
}

export function loadState(): AppState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const rawV2 = window.localStorage.getItem(STORAGE_KEY_V2);
    if (rawV2) return migrate(JSON.parse(rawV2));
    const rawV1 = window.localStorage.getItem(STORAGE_KEY);
    if (rawV1) {
      const migrated = migrate(JSON.parse(rawV1));
      // Write v2 forward so we stop reading the old key next time.
      window.localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(migrated));
      window.localStorage.removeItem(STORAGE_KEY);
      return migrated;
    }
    return DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(state));
  } catch {
    // quota / disabled — silent
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY_V2);
  window.localStorage.removeItem(STORAGE_KEY);
}

export function exportStateAsJSON(state: AppState): string {
  return JSON.stringify(state, null, 2);
}

export function importStateFromJSON(json: string): AppState | null {
  try {
    const parsed = JSON.parse(json) as AnyParsed;
    if (typeof parsed !== "object" || !parsed) return null;
    if (parsed.schemaVersion !== 1 && parsed.schemaVersion !== 2) return null;
    return migrate(parsed);
  } catch {
    return null;
  }
}
