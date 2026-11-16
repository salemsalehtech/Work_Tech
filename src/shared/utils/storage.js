// Safe localStorage access: private mode, full storage or bad JSON never break the app.
const PREFIX = 'worktech:';

export function loadState(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveState(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage is unavailable or full: the app keeps working without persistence.
  }
}
