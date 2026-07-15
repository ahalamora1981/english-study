import { writable, derived } from 'svelte/store';
import { get, set, STORAGE_KEYS } from '../lib/storage.js';
import { checkNewBadges } from '../lib/badges.js';

const DEFAULT_USER = {
  xp: 0,
  level: 1,
  streak: 0,
  lastStudyDate: null,
  dailyGoal: 20,
  totalWordsLearned: 0,
  unlockedBadges: [],
  perfectSessions: 0,
  allMastered: false
};

function calcLevel(totalXp) {
  // Level N requires: N*100 + (N-1)*50 cumulative
  let level = 1;
  let required = 100;
  let accumulated = 0;
  while (totalXp >= accumulated + required) {
    accumulated += required;
    level++;
    required = level * 100 + (level - 1) * 50;
  }
  return level;
}

function calcLevelProgress(totalXp) {
  let level = 1;
  let required = 100;
  let accumulated = 0;
  while (totalXp >= accumulated + required) {
    accumulated += required;
    level++;
    required = level * 100 + (level - 1) * 50;
  }
  return {
    level,
    currentXp: totalXp - accumulated,
    requiredXp: required,
    progress: (totalXp - accumulated) / required
  };
}

function createUserStore() {
  const { subscribe, update } = writable({ ...DEFAULT_USER });

  let _loaded = false;

  return {
    subscribe,
    load() {
      if (_loaded) return;
      const saved = get(STORAGE_KEYS.USER);
      if (saved) {
        update(() => ({ ...DEFAULT_USER, ...saved }));
      }
      _loaded = true;
    },
    save() {
      update(state => {
        set(STORAGE_KEYS.USER, {
          xp: state.xp,
          level: state.level,
          streak: state.streak,
          lastStudyDate: state.lastStudyDate,
          dailyGoal: state.dailyGoal,
          totalWordsLearned: state.totalWordsLearned,
          unlockedBadges: state.unlockedBadges,
          perfectSessions: state.perfectSessions,
          allMastered: state.allMastered
        });
        return state;
      });
    },
    addXP(amount) {
      update(state => {
        const newXp = state.xp + amount;
        const newLevel = calcLevel(newXp);
        const result = { ...state, xp: newXp, level: newLevel };
        // Check new badges
        const newBadges = checkNewBadges(result, result.unlockedBadges);
        if (newBadges.length > 0) {
          result.unlockedBadges = [...result.unlockedBadges, ...newBadges];
        }
        set(STORAGE_KEYS.USER, result);
        return result;
      });
    },
    recordStudy(today, wordsStudied, correctAnswers, totalAnswers) {
      update(state => {
        const result = { ...state };

        // Streak
        if (state.lastStudyDate) {
          const last = new Date(state.lastStudyDate);
          const curr = new Date(today);
          const diffDays = Math.floor((curr - last) / (1000 * 60 * 60 * 24));
          result.streak = diffDays <= 1 ? state.streak + 1 : 1;
        } else {
          result.streak = 1;
        }
        result.lastStudyDate = today;

        // Daily progress
        const key = STORAGE_KEYS.DAILY_PROGRESS;
        const daily = get(key) || {};
        const todayEntry = daily[today] || { wordsStudied: 0, correctAnswers: 0, totalAnswers: 0, xpEarned: 0 };
        todayEntry.wordsStudied += wordsStudied;
        todayEntry.correctAnswers += correctAnswers;
        todayEntry.totalAnswers += totalAnswers;
        daily[today] = todayEntry;
        set(key, daily);

        // Total learned
        result.totalWordsLearned = (state.totalWordsLearned || 0) + wordsStudied;

        // Perfect session check
        if (totalAnswers >= 10 && correctAnswers === totalAnswers) {
          result.perfectSessions = (state.perfectSessions || 0) + 1;
        }

        // Check new badges
        const newBadges = checkNewBadges(result, result.unlockedBadges);
        if (newBadges.length > 0) {
          result.unlockedBadges = [...result.unlockedBadges, ...newBadges];
        }

        set(STORAGE_KEYS.USER, result);
        return result;
      });
    },
    getLevelProgress() {
      let state;
      const unsub = subscribe(s => { state = s; }); unsub();
      return calcLevelProgress(state.xp);
    },
    getDailyProgress(today) {
      const daily = get(STORAGE_KEYS.DAILY_PROGRESS) || {};
      return daily[today] || null;
    }
  };
}

export const userStore = createUserStore();
