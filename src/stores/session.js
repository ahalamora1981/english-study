import { writable, derived } from 'svelte/store';
import { wordsStore } from './words.js';
import { userStore } from './user.js';

function createSessionStore() {
  const { subscribe, set, update } = writable({
    active: false,
    mode: null,          // 'flashcard' | 'quiz' | 'typing'
    words: [],           // words for this session
    currentIndex: 0,
    correctCount: 0,
    totalAnswered: 0,
    xpEarned: 0,
    startTime: null,
    endTime: null
  });

  return {
    subscribe,

    startSession(mode, wordList) {
      set({
        active: true,
        mode,
        words: wordList,
        currentIndex: 0,
        correctCount: 0,
        totalAnswered: 0,
        xpEarned: 0,
        startTime: Date.now(),
        endTime: null
      });
    },

    getCurrentWord() {
      let state;
      const unsub = subscribe(s => { state = s; }); unsub();
      if (!state.active || state.currentIndex >= state.words.length) return null;
      return state.words[state.currentIndex];
    },

    answerCurrent(correct, xpAmount) {
      update(state => {
        if (!state.active || state.currentIndex >= state.words.length) return state;

        const word = state.words[state.currentIndex];
        wordsStore.recordResult(word, correct);

        const newState = {
          ...state,
          totalAnswered: state.totalAnswered + 1,
          xpEarned: state.xpEarned + (correct ? xpAmount : 0)
        };
        if (correct) newState.correctCount = state.correctCount + 1;

        return newState;
      });
    },

    advance() {
      update(state => {
        if (state.currentIndex >= state.words.length - 1) {
          // End of queue
          return { ...state, active: false, endTime: Date.now() };
        }
        return { ...state, currentIndex: state.currentIndex + 1 };
      });
    },

    endSession() {
      let state;
      const unsub = subscribe(s => { state = s; }); unsub();

      if (!state.active && state.totalAnswered === 0) return null;

      const today = new Date().toISOString().split('T')[0];
      userStore.recordStudy(
        today,
        state.totalAnswered,
        state.correctCount,
        state.totalAnswered
      );
      userStore.addXP(state.xpEarned);

      const summary = {
        totalWords: state.totalAnswered,
        correctCount: state.correctCount,
        accuracy: state.totalAnswered > 0
          ? Math.round(state.correctCount / state.totalAnswered * 100)
          : 0,
        xpEarned: state.xpEarned,
        duration: state.startTime ? Math.round((Date.now() - state.startTime) / 60000) : 0
      };

      set({
        active: false,
        mode: null,
        words: [],
        currentIndex: 0,
        correctCount: 0,
        totalAnswered: 0,
        xpEarned: 0,
        startTime: null,
        endTime: null
      });

      return summary;
    },

    isComplete() {
      let state;
      const unsub = subscribe(s => { state = s; }); unsub();
      // True if session is still active and past the last word, or if it ended after advancing past the last word
      return state.active && state.currentIndex >= state.words.length
        || (!state.active && state.totalAnswered > 0 && state.words.length > 0 && state.currentIndex >= state.words.length - 1);
    }
  };
}

export const sessionStore = createSessionStore();
