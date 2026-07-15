import { writable } from 'svelte/store';
import { get, set, STORAGE_KEYS } from '../lib/storage.js';

const DEFAULT_SETTINGS = {
  theme: 'default',
  studyModeOrder: ['flashcard', 'quiz', 'typing'],
  dailyGoal: 20,
  reviewNewWordsPerSession: 5
};

function createSettingsStore() {
  const { subscribe, update } = writable({ ...DEFAULT_SETTINGS });

  let _loaded = false;

  return {
    subscribe,
    load() {
      if (_loaded) return;
      const saved = get(STORAGE_KEYS.SETTINGS);
      if (saved) {
        update(() => ({ ...DEFAULT_SETTINGS, ...saved }));
      }
      _loaded = true;
    },
    updateSetting(key, value) {
      update(state => {
        const next = { ...state, [key]: value };
        set(STORAGE_KEYS.SETTINGS, next);
        return next;
      });
    },
    reset() {
      update(() => {
        set(STORAGE_KEYS.SETTINGS, { ...DEFAULT_SETTINGS });
        return { ...DEFAULT_SETTINGS };
      });
    }
  };
}

export const settingsStore = createSettingsStore();
