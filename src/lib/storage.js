export const STORAGE_KEYS = {
  USER: 'english_study_user',
  WORD_MASTERY: 'english_study_word_mastery',
  DAILY_PROGRESS: 'english_study_daily',
  SETTINGS: 'english_study_settings'
};

function serialize(value) {
  return JSON.stringify(value);
}

function deserialize(str) {
  try { return JSON.parse(str); }
  catch { return null; }
}

export function get(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? deserialize(raw) : null;
  } catch {
    return null;
  }
}

export function set(key, value) {
  try {
    localStorage.setItem(key, serialize(value));
    return true;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded');
    }
    return false;
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch { /* ignore */ }
}
