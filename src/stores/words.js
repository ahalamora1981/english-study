import { writable } from 'svelte/store';
import rawWords from '../lib/words.json';
import { createMasteryRecord, processAnswer } from '../lib/sm2.js';
import { get, set, STORAGE_KEYS } from '../lib/storage.js';
import { userStore } from './user.js';

function createWordsStore() {
  const { subscribe, update } = writable({
    words: rawWords,
    mastery: {}  // { word: { stage, ease, interval, repetitions, nextReview, history } }
  });

  let loaded = false;

  function ensureLoaded() {
    if (loaded) return;
    update(state => {
      const saved = get(STORAGE_KEYS.WORD_MASTERY) || {};
      const mastery = {};
      for (const w of rawWords) {
        mastery[w.word] = saved[w.word] || createMasteryRecord();
      }
      loaded = true;
      return { words: rawWords, mastery };
    });
  }

  return {
    subscribe,
    load() { ensureLoaded(); },
    getDueWords() {
      ensureLoaded();
      let state;
      const unsub = subscribe(s => { state = s; }); unsub();
      const today = new Date().toISOString().split('T')[0];
      return state.words.filter(w =>
        state.mastery[w.word].nextReview <= today
      );
    },
    recordResult(word, correct) {
      ensureLoaded();
      update(state => {
        const mastery = {
          ...state.mastery,
          [word]: processAnswer(state.mastery[word], correct)
        };
        return { ...state, mastery };
      });
      // persist outside update callback
      let currentMastery;
      const unsub = subscribe(s => { currentMastery = s.mastery; }); unsub();
      set(STORAGE_KEYS.WORD_MASTERY, currentMastery);
    },
    getStats() {
      ensureLoaded();
      let state;
      const unsub = subscribe(s => { state = s; }); unsub();
      const stages = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      for (const w of state.words) {
        stages[state.mastery[w.word].stage] = (stages[state.mastery[w.word].stage] || 0) + 1;
      }
      // Check if all words are mastered (stage 5) — trigger grand slam badge
      const total = state.words.length;
      if (total > 0 && stages[5] === total) {
        userStore.setAllMastered();
      }
      return { total, stages };
    },
    getByWord(word) {
      ensureLoaded();
      let state;
      const unsub = subscribe(s => { state = s; }); unsub();
      return state.words.find(w => w.word === word) || null;
    },
    getAllWords() {
      ensureLoaded();
      let state;
      const unsub = subscribe(s => { state = s; }); unsub();
      return state.words.map(w => ({
        ...w,
        mastery: state.mastery[w.word]
      }));
    }
  };
}

export const wordsStore = createWordsStore();
