# English Word Memorization App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a gamified English vocabulary memorization SPA for Chinese high school students (Gaokao ~3500 words).

**Architecture:** Single-page application using Svelte 5 with runes, Vite bundler, svelte-spa-router for hash-based routing. All state lives in Svelte stores that auto-sync to localStorage. Pure logic (SM-2 algorithm, badge definitions) lives in isolated lib modules. Study sessions use a transient session store atop persistent user/word stores.

**Tech Stack:** Svelte 5, Vite, svelte-spa-router, vanilla CSS with custom properties, localStorage

## Global Constraints

- **Zero purple in color palette** — primary `#0EA5E9` (sky blue), secondary `#F97316` (coral orange), success `#10B981` (emerald), danger `#EF4444` (rose)
- **Bilingual UI** — all navigation/labels in Chinese + English (e.g., "首页 / Home")
- **Responsive** — bottom nav bar on mobile (<768px), left sidebar on desktop (≥768px)
- **LocalStorage first** — data persists in browser, architecture supports future cloud sync
- **No external CSS framework** — plain CSS with custom properties for theming
- **No icon library** — inline SVG icons only
- **Font** — `system-ui` with `Noto Sans SC` fallback for CJK
- **SM-2 spaced repetition** — 6 mastery stages (0-5), ease factor min 1.3
- **XP formula:** Level N requires `level × 100 + (level-1) × 50` cumulative XP
- **No backend** — fully client-side, deploy as static files

---

## File Structure

```
english-study/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.js                # Svelte mount point
│   ├── App.svelte             # Root: nav + router
│   ├── pages/
│   │   ├── Home.svelte
│   │   ├── Study.svelte       # Mode selector + session wrapper
│   │   ├── Dictionary.svelte
│   │   └── Achievements.svelte
│   ├── components/
│   │   ├── Nav.svelte
│   │   ├── StreakWidget.svelte
│   │   ├── XPBar.svelte
│   │   ├── DailyGoalRing.svelte
│   │   ├── WordCountSummary.svelte
│   │   ├── WordCard.svelte
│   │   ├── QuizChoice.svelte
│   │   ├── TypingInput.svelte
│   │   ├── ModeSelector.svelte
│   │   ├── Session.svelte
│   │   ├── SessionSummary.svelte
│   │   ├── BadgeGrid.svelte
│   │   ├── XPPopup.svelte
│   │   ├── BadgeUnlock.svelte
│   │   └── Toast.svelte
│   ├── stores/
│   │   ├── user.js
│   │   ├── words.js
│   │   ├── session.js
│   │   └── settings.js
│   ├── lib/
│   │   ├── words.json          # Sample Gaokao words (100 for dev, expandable)
│   │   ├── sm2.js
│   │   ├── storage.js
│   │   └── badges.js
│   └── styles/
│       ├── global.css          # Reset, design tokens, typography
│       └── animations.css      # XP popup, badge unlock, transitions
└── public/
    └── favicon.svg
```

---

### Task 1: Project scaffold + design tokens

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/App.svelte` (minimal shell)
- Create: `src/styles/global.css`
- Create: `public/favicon.svg`

**Interfaces:**
- Consumes: (none — foundation task)
- Produces: `global.css` with CSS custom properties consumed by all components

- [ ] **Step 1: Create package.json**

```json
{
  "name": "english-study",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "svelte-spa-router": "^4.0.1"
  },
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^5.0.0",
    "svelte": "^5.0.0",
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 2: Create vite.config.js**

```js
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  build: {
    target: 'es2020'
  }
});
```

- [ ] **Step 3: Create svelte.config.js**

```js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  preprocess: vitePreprocess()
};
```

- [ ] **Step 4: Create index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>单词达人 - English Study</title>
  <link rel="icon" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/src/styles/global.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 5: Create src/styles/global.css with design tokens**

```css
:root {
  --color-primary: #0EA5E9;
  --color-primary-hover: #0284C7;
  --color-secondary: #F97316;
  --color-secondary-hover: #EA580C;
  --color-success: #10B981;
  --color-success-hover: #059669;
  --color-danger: #EF4444;
  --color-danger-hover: #DC2626;
  --color-warning: #F59E0B;
  --color-bg: #F8FAFC;
  --color-card: #FFFFFF;
  --color-text: #0F172A;
  --color-text-secondary: #64748B;
  --color-border: #E2E8F0;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --font-family: 'Noto Sans SC', system-ui, -apple-system, sans-serif;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  font-family: var(--font-family);
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-text);
  background: var(--color-bg);
  -webkit-font-smoothing: antialiased;
}

#app {
  height: 100%;
}

button {
  cursor: pointer;
  border: none;
  font-family: inherit;
  font-size: inherit;
}

input {
  font-family: inherit;
  font-size: inherit;
}
```

- [ ] **Step 6: Create src/main.js**

```js
import App from './App.svelte';
import { mount } from 'svelte';

const app = mount(App, {
  target: document.getElementById('app')
});

export default app;
```

- [ ] **Step 7: Create minimal App.svelte (placeholder)**

```svelte
<script>
  import Router from 'svelte-spa-router';
  import Nav from './components/Nav.svelte';
  import Home from './pages/Home.svelte';
  import Study from './pages/Study.svelte';
  import Dictionary from './pages/Dictionary.svelte';
  import Achievements from './pages/Achievements.svelte';

  const routes = {
    '/': Home,
    '/study': Study,
    '/dictionary': Dictionary,
    '/achievements': Achievements,
  };
</script>

<div class="app-shell">
  <Nav />
  <main class="main-content">
    <Router {routes} />
  </main>
</div>

<style>
  .app-shell {
    display: flex;
    height: 100%;
  }
  .main-content {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    padding-bottom: 80px; /* space for mobile nav */
  }
  @media (min-width: 768px) {
    .main-content {
      padding-bottom: 24px;
    }
  }
</style>
```

- [ ] **Step 8: Create favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#0EA5E9"/>
  <text x="16" y="23" text-anchor="middle" font-size="20" fill="white" font-family="sans-serif" font-weight="bold">E</text>
</svg>
```

- [ ] **Step 9: Install dependencies and verify dev server starts**

```bash
npm install
npm run dev
```

Expected: Vite dev server starts on localhost, page shows "E" favicon and empty shell.

---

### Task 2: Storage abstraction + SM-2 algorithm

**Files:**
- Create: `src/lib/storage.js`
- Create: `src/lib/sm2.js`

**Interfaces:**
- Consumes: nothing from Task 1
- Produces: `storage.js` exports `{ get, set, remove, STORAGE_KEYS }`, `sm2.js` exports `{ createMasteryRecord, processAnswer, getIntervalByStage, STAGES }`

- [ ] **Step 1: Create src/lib/storage.js**

```js
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
```

- [ ] **Step 2: Create src/lib/sm2.js**

```js
export const STAGES = [
  { id: 0, label: '未学', labelEn: 'New', interval: null },
  { id: 1, label: '学习中', labelEn: 'Learning', interval: 0.007 },  // ~10 min
  { id: 2, label: '复习中', labelEn: 'Reviewing', interval: 1 },     // 1 day
  { id: 3, label: '巩固中', labelEn: 'Consolidating', interval: 3 }, // 3 days
  { id: 4, label: '熟悉', labelEn: 'Familiar', interval: 7 },       // 7 days
  { id: 5, label: '已掌握', labelEn: 'Mastered', interval: 30 },    // 30 days
];

export function createMasteryRecord() {
  return {
    stage: 0,
    ease: 2.5,
    interval: 1,
    repetitions: 0,
    nextReview: new Date().toISOString().split('T')[0],
    history: []
  };
}

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + Math.ceil(days));
  return d.toISOString().split('T')[0];
}

/**
 * Process an answer according to SM-2 algorithm.
 * @param {object} record - mastery record
 * @param {boolean} correct - whether the answer was correct
 * @returns {object} updated mastery record
 */
export function processAnswer(record, correct) {
  const updated = { ...record, history: [...record.history, correct].slice(-10) };

  if (correct) {
    updated.repetitions += 1;
    if (updated.stage < 5) {
      updated.stage += 1;
    }
    // SM-2: interval = interval * ease
    updated.interval = Math.max(1, Math.round(updated.interval * updated.ease));
    // Cap at 365 days
    updated.interval = Math.min(365, updated.interval);
  } else {
    updated.repetitions = 0;
    updated.stage = Math.max(1, updated.stage - 1);
    updated.ease = Math.max(1.3, updated.ease - 0.2);
    updated.interval = 1;
  }

  updated.nextReview = daysFromNow(updated.stage === 0 ? 0 : updated.interval);
  return updated;
}

export function getIntervalByStage(stage) {
  const s = STAGES.find(s => s.id === stage);
  return s ? s.interval : null;
}
```

- [ ] **Step 3: Verify SM-2 logic works (manual or import test)**

```js
// Run this in browser console or a temporary test script
import { createMasteryRecord, processAnswer } from './src/lib/sm2.js';

let r = createMasteryRecord();
console.assert(r.stage === 0, 'starts at stage 0');

r = processAnswer(r, true);
console.assert(r.stage === 1, 'correct advances to stage 1');
console.assert(r.repetitions === 1, 'repetitions incremented');

r = processAnswer(r, false);
console.assert(r.stage === 0, 'wrong resets to stage 0');
console.assert(r.ease < 2.5, 'ease factor decreased');
```

---

### Task 3: Word data + words store

**Files:**
- Create: `src/lib/words.json` (100 sample Gaokao words)
- Create: `src/stores/words.js`

**Interfaces:**
- Consumes: `storage.js` (STORAGE_KEYS), `sm2.js` (createMasteryRecord, processAnswer)
- Produces: words store with `{ list, getMastery, getDueWords, recordResult, getStats, load, save }`

- [ ] **Step 1: Create words.json with 100 sample Gaokao words**

Each entry:
```json
{
  "word": "abandon",
  "phonetic": "/əˈbændən/",
  "meaning": "v. 放弃，抛弃",
  "example": "They had to abandon the game due to rain.",
  "translation": "因为下雨，他们不得不放弃比赛。",
  "difficulty": 2
}
```
Include words at varied difficulty (1-5). Include all parts of speech. File should be a JSON array.

- [ ] **Step 2: Create src/stores/words.js**

```js
import { writable } from 'svelte/store';
import rawWords from '../lib/words.json';
import { createMasteryRecord, processAnswer } from '../lib/sm2.js';
import { get, set, STORAGE_KEYS } from '../lib/storage.js';

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
    save() {
      update(state => {
        set(STORAGE_KEYS.WORD_MASTERY, state.mastery);
        return state;
      });
    },
    getDueWords() {
      ensureLoaded();
      let state;
      unsubscribe: const unsub = subscribe(s => { state = s; }); unsub();
      const today = new Date().toISOString().split('T')[0];
      return state.words.filter(w =>
        state.mastery[w.word].nextReview <= today
      );
    },
    recordResult(word, correct) {
      update(state => {
        const mastery = {
          ...state.mastery,
          [word]: processAnswer(state.mastery[word], correct)
        };
        set(STORAGE_KEYS.WORD_MASTERY, mastery);
        return { ...state, mastery };
      });
    },
    getStats() {
      ensureLoaded();
      let state;
      const unsub = subscribe(s => { state = s; }); unsub();
      const stages = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      for (const w of state.words) {
        stages[state.mastery[w.word].stage] = (stages[state.mastery[w.word].stage] || 0) + 1;
      }
      return { total: state.words.length, stages };
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
```

- [ ] **Step 3: Verify the store loads and computes due words**

```bash
# After building, open browser console:
import { wordsStore } from './src/stores/words.js';
wordsStore.load();
wordsStore.getDueWords();  # should return words with nextReview <= today
wordsStore.getStats();     # should show 100 total, all at stage 0
```

---

### Task 4: User store (XP, levels, streaks, badges)

**Files:**
- Create: `src/stores/user.js`
- Create: `src/lib/badges.js`

**Interfaces:**
- Consumes: `storage.js` (STORAGE_KEYS)
- Produces: user store with `{ xp, level, streak, lastStudyDate, dailyProgress, dailyGoal, unlockedBadges, addXP, recordStudy, resetStreak, getLevelProgress }`

- [ ] **Step 1: Create src/lib/badges.js**

```js
export const BADGES = [
  { id: 'words_10',    name: '初露锋芒', nameEn: 'First Steps',     desc: '学习 10 个单词',       icon: 'star',    check: s => s.totalWordsLearned >= 10 },
  { id: 'words_100',   name: '百词斩',   nameEn: 'Century',         desc: '学习 100 个单词',      icon: 'stars',   check: s => s.totalWordsLearned >= 100 },
  { id: 'words_500',   name: '词汇达人', nameEn: 'Vocab Master',    desc: '学习 500 个单词',      icon: 'book',    check: s => s.totalWordsLearned >= 500 },
  { id: 'words_1000',  name: '千词大师', nameEn: 'Thousand Words',  desc: '学习 1000 个单词',     icon: 'trophy',  check: s => s.totalWordsLearned >= 1000 },
  { id: 'streak_3',    name: '三天打鱼', nameEn: '3-Day Streak',    desc: '连续学习 3 天',        icon: 'fire',    check: s => s.streak >= 3 },
  { id: 'streak_7',    name: '一周坚持', nameEn: 'Week Warrior',    desc: '连续学习 7 天',        icon: 'fire',    check: s => s.streak >= 7 },
  { id: 'streak_14',   name: '半月之星', nameEn: 'Fortnight Star',  desc: '连续学习 14 天',       icon: 'fire',    check: s => s.streak >= 14 },
  { id: 'streak_30',   name: '铁杆学霸', nameEn: 'Iron Scholar',   desc: '连续学习 30 天',       icon: 'flame',   check: s => s.streak >= 30 },
  { id: 'level_5',     name: '小学徒',   nameEn: 'Apprentice',      desc: '达到 5 级',            icon: 'level',   check: s => s.level >= 5 },
  { id: 'level_10',    name: '高手',     nameEn: 'Expert',          desc: '达到 10 级',           icon: 'level',   check: s => s.level >= 10 },
  { id: 'level_25',    name: '词霸',     nameEn: 'Lexicon King',    desc: '达到 25 级',           icon: 'crown',   check: s => s.level >= 25 },
  { id: 'perfect_day', name: '完美一天', nameEn: 'Perfect Day',     desc: '单次全对 (≥10 词)',    icon: 'perfect', check: s => s.perfectSessions >= 1 },
  { id: 'grand_slam',  name: '大满贯',   nameEn: 'Grand Slam',      desc: '全部单词第 5 阶段',     icon: 'grand',   check: s => s.allMastered },
];

export function checkNewBadges(userState, currentBadges) {
  const unlocked = [];
  for (const badge of BADGES) {
    if (!currentBadges.includes(badge.id) && badge.check(userState)) {
      unlocked.push(badge.id);
    }
  }
  return unlocked;
}
```

- [ ] **Step 2: Create src/stores/user.js**

```js
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
```

- [ ] **Step 3: Verify user store logic**

```js
// In browser console
import { userStore } from './src/stores/user.js';
userStore.load();
console.log(userStore.getLevelProgress());
// Expected: { level: 1, currentXp: 0, requiredXp: 100, progress: 0 }

userStore.addXP(100);
console.log(userStore.getLevelProgress().level); // 2
```

---

### Task 5: Settings store

**Files:**
- Create: `src/stores/settings.js`

**Interfaces:**
- Consumes: `storage.js` (STORAGE_KEYS)
- Produces: settings store with `{ theme, studyModeOrder, dailyGoal, reviewNewWordsPerSession, update }`

- [ ] **Step 1: Create src/stores/settings.js**

```js
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
```

---

### Task 6: Navigation + App shell

**Files:**
- Modify: `src/App.svelte`
- Create: `src/components/Nav.svelte`

**Interfaces:**
- Consumes: routes defined in Task 1's App.svelte
- Produces: working navigation with responsive bottom nav / sidebar

- [ ] **Step 1: Create src/components/Nav.svelte**

```svelte
<script>
  import { link } from 'svelte-spa-router';

  const items = [
    { path: '/', label: '首页', labelEn: 'Home', icon: 'home' },
    { path: '/study', label: '学习', labelEn: 'Study', icon: 'study' },
    { path: '/dictionary', label: '词典', labelEn: 'Dictionary', icon: 'dict' },
    { path: '/achievements', label: '成就', labelEn: 'Achievements', icon: 'achv' },
  ];

  // SVG icon paths
  const icons = {
    home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    study: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    dict: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    achv: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  };
</script>

<nav class="nav">
  <div class="nav-inner">
    {#each items as item}
      <a href={item.path} use:link class="nav-item" activeClass="active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d={icons[item.icon]} />
        </svg>
        <span class="nav-label">{item.label}</span>
      </a>
    {/each}
  </div>
</nav>

<style>
  .nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--color-card);
    border-top: 1px solid var(--color-border);
    z-index: 100;
  }
  .nav-inner {
    display: flex;
    justify-content: space-around;
    padding: 8px 0;
    max-width: 480px;
    margin: 0 auto;
  }
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: var(--color-text-secondary);
    gap: 2px;
    font-size: 0.75rem;
  }
  .nav-item.active {
    color: var(--color-primary);
  }
  .nav-icon {
    width: 24px;
    height: 24px;
  }
  :global(.active) .nav-icon {
    stroke-width: 2.5;
  }
  .nav-label {
    font-size: 0.65rem;
  }

  @media (min-width: 768px) {
    .nav {
      position: static;
      width: 200px;
      border-top: none;
      border-right: 1px solid var(--color-border);
    }
    .nav-inner {
      flex-direction: column;
      padding: 24px 12px;
      gap: 4px;
      max-width: none;
    }
    .nav-item {
      flex-direction: row;
      gap: 10px;
      padding: 10px 14px;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
    }
    .nav-item.active {
      background: var(--color-primary);
      color: white;
    }
    .nav-label {
      font-size: 0.875rem;
    }
  }
</style>
```

- [ ] **Step 2: Update App.svelte to integrate stores load + Nav**

Replace the App.svelte from Task 1 with the version that loads stores on mount and integrates Nav component. Keep the router structure from Step 7 of Task 1, but add `onMount` to load all stores.

- [ ] **Step 3: Verify navigation works**

```bash
npm run dev
# Open browser. Verify:
# - Bottom nav with 4 tabs visible on mobile width
# - Left sidebar on desktop width (≥768px)
# - Clicking tabs switches routes (pages show placeholder content)
# - Active tab is highlighted
```

---

### Task 7: Home page

**Files:**
- Create: `src/pages/Home.svelte`
- Create: `src/components/StreakWidget.svelte`
- Create: `src/components/XPBar.svelte`
- Create: `src/components/DailyGoalRing.svelte`
- Create: `src/components/WordCountSummary.svelte`

**Interfaces:**
- Consumes: `userStore`, `wordsStore`
- Produces: Home dashboard page

- [ ] **Step 1: Create StreakWidget.svelte**

Props: `{ streak: number }`. Display flame icon + "连续学习 {streak} 天" / "Consecutive {streak} days". Show different colors based on streak length.

```svelte
<script>
  let { streak = 0, lastStudyDate = null } = $props();
  $: isActive = lastStudyDate === new Date().toISOString().split('T')[0];
  $: colorClass = streak >= 30 ? 'streak-30' : streak >= 14 ? 'streak-14' : streak >= 7 ? 'streak-7' : 'streak-default';
</script>

<div class="streak-widget {colorClass}">
  <svg class="streak-icon" viewBox="0 0 24 24" width="32" height="32">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>
  </svg>
  <div class="streak-info">
    <div class="streak-count">{streak}</div>
    <div class="streak-label">连续学习 | Consecutive Days</div>
  </div>
  {#if !isActive && streak > 0}
    <div class="streak-reminder">今天还没学习 | Study today to keep your streak!</div>
  {/if}
</div>

<style>
  .streak-widget { display: flex; align-items: center; gap: 12px; padding: 16px; border-radius: var(--radius-lg); background: var(--color-card); box-shadow: var(--shadow-sm); }
  .streak-default .streak-icon { color: var(--color-warning); }
  .streak-7 .streak-icon { color: var(--color-secondary); }
  .streak-14 .streak-icon { color: var(--color-danger); }
  .streak-30 .streak-icon { color: var(--color-danger); filter: drop-shadow(0 0 8px rgba(239,68,68,0.5)); }
  .streak-count { font-size: 2rem; font-weight: 700; line-height: 1; }
  .streak-default .streak-count { color: var(--color-text); }
  .streak-30 .streak-count { color: var(--color-danger); }
  .streak-label { font-size: 0.75rem; color: var(--color-text-secondary); }
  .streak-reminder { font-size: 0.75rem; color: var(--color-secondary); margin-left: auto; text-align: right; }
</style>
```

- [ ] **Step 2: Create XPBar.svelte**

Props: `{ xp, level, progress }`. Show level label + progress bar toward next level.

- [ ] **Step 3: Create DailyGoalRing.svelte**

Props: `{ current, goal }`. SVG circular progress ring.

- [ ] **Step 4: Create WordCountSummary.svelte**

Props: `{ totalWords, stages }`. Show mini bar chart of words by mastery stage.

- [ ] **Step 5: Create Home.svelte**

Compose all widgets. On mount, load stores. Show "开始学习 / Start Study" button linking to `/study`.

```svelte
<script>
  import { onMount } from 'svelte';
  import { link } from 'svelte-spa-router';
  import { userStore } from '../stores/user.js';
  import { wordsStore } from '../stores/words.js';
  import StreakWidget from '../components/StreakWidget.svelte';
  import XPBar from '../components/XPBar.svelte';
  import DailyGoalRing from '../components/DailyGoalRing.svelte';
  import WordCountSummary from '../components/WordCountSummary.svelte';

  let userState = $state({ xp: 0, level: 1, streak: 0, lastStudyDate: null, dailyGoal: 20, totalWordsLearned: 0 });
  let stats = $state({ total: 0, stages: {} });
  let dailyProgress = $state(null);

  onMount(() => {
    userStore.load();
    wordsStore.load();
    userStore.subscribe(v => userState = v);
    wordsStore.subscribe(() => { stats = wordsStore.getStats(); });
    dailyProgress = userStore.getDailyProgress(new Date().toISOString().split('T')[0]);
  });

  const levelInfo = $derived(userStore.getLevelProgress());
  const todayStudied = $derived(dailyProgress?.wordsStudied || 0);
</script>

<div class="home">
  <h1 class="greeting">单词达人 | Word Master</h1>

  <StreakWidget streak={userState.streak} lastStudyDate={userState.lastStudyDate} />
  <XPBar xp={levelInfo.currentXp} level={levelInfo.level} progress={levelInfo.progress} required={levelInfo.requiredXp} />
  <DailyGoalRing current={todayStudied} goal={userState.dailyGoal} />
  <WordCountSummary totalWords={stats.total} stages={stats.stages} />

  <a href="/study" use:link class="start-button">
    开始学习 | Start Study
  </a>
</div>

<style>
  .home { max-width: 480px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }
  .greeting { font-size: 1.5rem; font-weight: 700; text-align: center; margin-bottom: 8px; }
  .start-button {
    display: block;
    text-align: center;
    padding: 16px;
    background: var(--color-primary);
    color: white;
    border-radius: var(--radius-lg);
    font-size: 1.125rem;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.2s;
  }
  .start-button:hover { background: var(--color-primary-hover); }
</style>
```

- [ ] **Step 6: Verify Home page renders**

```bash
npm run dev
# Navigate to /. Verify:
# - Streak shows 0 on first visit
# - XP bar shows Level 1, 0/100
# - Daily goal ring shows 0/20
# - Word count shows 0/100
# - Start Study button navigates to /study
```

---

### Task 8: Session store (ephemeral study session state)

**Files:**
- Create: `src/stores/session.js`

**Interfaces:**
- Consumes: `wordsStore`, `userStore`
- Produces: session store with `{ activeMode, wordQueue, currentIndex, correctCount, totalCount, startSession, answerCurrent, endSession, progress }`

- [ ] **Step 1: Create src/stores/session.js**

```js
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
      return state.active && state.currentIndex >= state.words.length;
    }
  };
}

export const sessionStore = createSessionStore();
```

---

### Task 9: Flashcard mode

**Files:**
- Create: `src/components/WordCard.svelte`

**Interfaces:**
- Consumes: word data object `{ word, phonetic, meaning, example, translation }`
- Produces: `WordCard` component with flip animation, know/forgot buttons

- [ ] **Step 1: Create WordCard.svelte**

```svelte
<script>
  let { word = null, onResult = () => {} } = $props();
  let flipped = $state(false);

  function handleResult(correct) {
    onResult(correct, 10);
  }

  $: if (word) flipped = false; // Reset flip on new word
</script>

{#if word}
  <div class="card-container" class:flipped>
    <div class="card-inner" onclick={() => { if (!flipped) flipped = true; }}>
      <!-- Front -->
      <div class="card-front">
        <div class="word-text">{word.word}</div>
        <div class="hint">点击翻转 | Tap to flip</div>
      </div>
      <!-- Back -->
      <div class="card-back">
        <div class="word-text">{word.word}</div>
        <div class="phonetic">{word.phonetic}</div>
        <div class="meaning">{word.meaning}</div>
        {#if word.example}
          <div class="example">{word.example}</div>
          <div class="translation">{word.translation}</div>
        {/if}
      </div>
    </div>
  </div>

  {#if flipped}
    <div class="actions">
      <button class="btn-forgot" onclick={() => handleResult(false)}>
        忘了 | Forgot
      </button>
      <button class="btn-knew" onclick={() => handleResult(true)}>
        知道 | Knew
      </button>
    </div>
  {/if}
{/if}

<style>
  .card-container {
    perspective: 1000px;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    aspect-ratio: 3 / 2;
    cursor: pointer;
  }
  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.4s ease;
    transform-style: preserve-3d;
  }
  .flipped .card-inner {
    transform: rotateY(180deg);
  }
  .card-front, .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: var(--radius-lg);
    background: var(--color-card);
    box-shadow: var(--shadow-md);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    text-align: center;
  }
  .card-back {
    transform: rotateY(180deg);
  }
  .word-text { font-size: 1.75rem; font-weight: 700; color: var(--color-text); }
  .phonetic { font-size: 1rem; color: var(--color-text-secondary); margin-top: 8px; }
  .meaning { font-size: 1.25rem; color: var(--color-text); margin-top: 12px; }
  .example { font-size: 0.875rem; color: var(--color-text-secondary); font-style: italic; margin-top: 16px; }
  .translation { font-size: 0.75rem; color: var(--color-text-secondary); margin-top: 4px; }
  .hint { font-size: 0.75rem; color: var(--color-text-secondary); margin-top: auto; }
  .actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-top: 20px;
  }
  .btn-forgot, .btn-knew {
    padding: 14px 32px;
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 1rem;
  }
  .btn-forgot { background: var(--color-danger); color: white; }
  .btn-knew { background: var(--color-success); color: white; }
  .btn-forgot:hover { background: var(--color-danger-hover); }
  .btn-knew:hover { background: var(--color-success-hover); }
</style>
```

- [ ] **Step 2: Test flashcard in isolation**

Add a temporary route or test page that passes a word object to WordCard and logs the `onResult` callback. Verify flip animation and button clicks.

---

### Task 10: Quiz mode + Typing mode

**Files:**
- Create: `src/components/QuizChoice.svelte`
- Create: `src/components/TypingInput.svelte`

**Interfaces:**
- Quiz: `{ word, allWords, onResult }` — shows 4 options, English word, pick correct Chinese
- Typing: `{ word, onResult }` — shows Chinese meaning, user types English

- [ ] **Step 1: Create QuizChoice.svelte**

```svelte
<script>
  let { word = null, allWords = [], onResult = () => {} } = $props();
  let selected = $state(null);
  let revealed = $state(false);

  let options = $derived.by(() => {
    if (!word || allWords.length < 4) return [];
    // Pick 3 distractors at similar difficulty
    const similar = allWords
      .filter(w => w.word !== word.word && Math.abs(w.difficulty - word.difficulty) <= 1)
      .sort(() => Math.random() - 0.5);
    const distractorCount = Math.min(3, similar.length);
    const distractors = similar.slice(0, distractorCount).map(w => w.meaning);
    const opts = [word.meaning, ...distractors].sort(() => Math.random() - 0.5);
    return opts;
  });

  let correctAnswer = $derived(word?.meaning || '');

  function select(opt) {
    if (revealed) return;
    selected = opt;
    revealed = true;
    const correct = opt === correctAnswer;
    setTimeout(() => {
      onResult(correct, 15);
    }, correct ? 1000 : 2000);
  }
</script>

{#if word}
  <div class="quiz">
    <div class="quiz-word">{word.word}</div>
    <div class="quiz-prompt">选择正确的中文释义 | Choose the correct meaning</div>
    <div class="options">
      {#each options as opt}
        <button
          class="option"
          class:selected-correct={revealed && opt === correctAnswer}
          class:selected-wrong={revealed && opt === selected && opt !== correctAnswer}
          class:faded={revealed && opt !== selected && opt !== correctAnswer}
          onclick={() => select(opt)}
          disabled={revealed}
        >
          {opt}
        </button>
      {/each}
    </div>
  </div>
{/if}

<style>
  .quiz { max-width: 400px; margin: 0 auto; text-align: center; }
  .quiz-word { font-size: 2rem; font-weight: 700; margin-bottom: 8px; }
  .quiz-prompt { font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 24px; }
  .options { display: flex; flex-direction: column; gap: 12px; }
  .option {
    padding: 16px;
    border-radius: var(--radius-md);
    background: var(--color-card);
    box-shadow: var(--shadow-sm);
    font-size: 1.125rem;
    text-align: center;
    transition: all 0.2s;
    border: 2px solid var(--color-border);
  }
  .option:hover:not(:disabled) { border-color: var(--color-primary); }
  .selected-correct { border-color: var(--color-success); background: #ECFDF5; }
  .selected-wrong { border-color: var(--color-danger); background: #FEF2F2; }
  .faded { opacity: 0.4; }
</style>
```

- [ ] **Step 2: Create TypingInput.svelte**

```svelte
<script>
  let { word = null, onResult = () => {} } = $props();
  let input = $state('');
  let checked = $state(false);
  let correct = $state(false);

  function check() {
    if (checked) return;
    checked = true;
    // Case-insensitive comparison
    const isCorrect = input.trim().toLowerCase() === word.word.toLowerCase();
    correct = isCorrect;
    const xp = isCorrect ? 20 + (word.difficulty >= 3 ? 5 : 0) : 0;
    setTimeout(() => {
      onResult(isCorrect, xp);
    }, 1500);
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') check();
  }

  $: if (word) { input = ''; checked = false; correct = false; }
</script>

{#if word}
  <div class="typing">
    <div class="typing-meaning">{word.meaning}</div>
    <div class="typing-hint">{word.phonetic}</div>
    <div class="input-row">
      <input
        type="text"
        bind:value={input}
        onkeydown={handleKeydown}
        placeholder="输入英文 | Type the word"
        disabled={checked}
        class:correct
        class:wrong={checked && !correct}
      />
      <button class="check-btn" onclick={check} disabled={checked}>
        检查 | Check
      </button>
    </div>
    {#if checked}
      <div class="result" class:correct class:wrong={!correct}>
        {#if correct}
          正确! | Correct!
        {:else}
                          正确拼写 | Correct spelling: {word.word}
        {/if}
      </div>
    {/if}
  </div>
{/if}

<style>
  .typing { max-width: 400px; margin: 0 auto; text-align: center; }
  .typing-meaning { font-size: 1.5rem; font-weight: 700; margin-bottom: 8px; }
  .typing-hint { font-size: 1rem; color: var(--color-text-secondary); margin-bottom: 24px; }
  .input-row { display: flex; gap: 8px; }
  input {
    flex: 1;
    padding: 14px;
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 1.125rem;
    outline: none;
    transition: border-color 0.2s;
  }
  input:focus { border-color: var(--color-primary); }
  input.correct { border-color: var(--color-success); background: #ECFDF5; }
  input.wrong { border-color: var(--color-danger); background: #FEF2F2; }
  .check-btn {
    padding: 14px 20px;
    background: var(--color-primary);
    color: white;
    border-radius: var(--radius-md);
    font-weight: 600;
  }
  .check-btn:disabled { opacity: 0.6; }
  .result { margin-top: 16px; font-weight: 600; }
  .result.correct { color: var(--color-success); }
  .result.wrong { color: var(--color-danger); }
</style>
```

---

### Task 11: Study page (mode selector + session wrapper)

**Files:**
- Create: `src/pages/Study.svelte`
- Create: `src/components/ModeSelector.svelte`
- Create: `src/components/Session.svelte`
- Create: `src/components/SessionSummary.svelte`

**Interfaces:**
- Consumes: `sessionStore`, `wordsStore`, `WordCard`, `QuizChoice`, `TypingInput`
- Produces: Full study flow from mode selection → session → summary

- [ ] **Step 1: Create ModeSelector.svelte**

```svelte
<script>
  let { onSelect = () => {} } = $props();
  const modes = [
    { id: 'flashcard', label: '单词卡', labelEn: 'Flashcard', desc: '翻转卡片，回忆词义 | Flip & recall meaning' },
    { id: 'quiz', label: '选择题', labelEn: 'Quiz', desc: '选出正确的中文释义 | Pick the correct meaning' },
    { id: 'typing', label: '拼写', labelEn: 'Typing', desc: '根据释义输入英文 | Type the English word' },
  ];
</script>

<div class="mode-selector">
  <h2 class="mode-heading">选择学习模式 | Choose Mode</h2>
  <div class="mode-cards">
    {#each modes as mode}
      <button class="mode-card" onclick={() => onSelect(mode.id)}>
        <div class="mode-card-badge">{mode.label}</div>
        <div class="mode-label-en">{mode.labelEn}</div>
        <div class="mode-desc">{mode.desc}</div>
      </button>
    {/each}
  </div>
</div>

<style>
  .mode-selector { max-width: 480px; margin: 0 auto; }
  .mode-heading { font-size: 1.25rem; font-weight: 700; text-align: center; margin-bottom: 20px; }
  .mode-cards { display: flex; flex-direction: column; gap: 12px; }
  .mode-card {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 24px; border-radius: var(--radius-lg);
    background: var(--color-card); box-shadow: var(--shadow-sm);
    border: 2px solid var(--color-border);
    transition: all 0.2s;
  }
  .mode-card:hover { border-color: var(--color-primary); box-shadow: var(--shadow-md); }
  .mode-card-badge {
    font-size: 1rem; font-weight: 700;
    background: var(--color-primary); color: white;
    padding: 4px 16px; border-radius: 999px;
  }
  .mode-label-en { font-size: 1.25rem; font-weight: 600; color: var(--color-text); margin-top: 8px; }
  .mode-desc { font-size: 0.875rem; color: var(--color-text-secondary); text-align: center; }
</style>
```

- [ ] **Step 2: Create Session.svelte**

Wraps the active study mode component. Passes current word, handles `onResult` by calling session store. Shows progress indicator.

- [ ] **Step 3: Create SessionSummary.svelte**

Props: `{ summary }`. Shows stats: words reviewed, accuracy%, XP earned, duration.

- [ ] **Step 4: Create Study.svelte**

Orchestrates flow: ModeSelector → Session → SessionSummary. On mode select, pulls due words from wordsStore and starts session.

```svelte
<script>
  import { onMount } from 'svelte';
  import { sessionStore } from '../stores/session.js';
  import { wordsStore } from '../stores/words.js';
  import ModeSelector from '../components/ModeSelector.svelte';
  import Session from '../components/Session.svelte';
  import SessionSummary from '../components/SessionSummary.svelte';
  import XPPopup from '../components/XPPopup.svelte';
  import BadgeUnlock from '../components/BadgeUnlock.svelte';

  let phase = $state('select'); // 'select' | 'session' | 'summary'
  let mode = $state(null);
  let summary = $state(null);
  let xpPopup = $state(null);
  let newBadge = $state(null);

  function handleModeSelect(selectedMode) {
    mode = selectedMode;
    const dueWords = wordsStore.getDueWords();
    const words = dueWords.length > 0 ? dueWords : wordsStore.getAllWords().slice(0, 10);
    sessionStore.startSession(selectedMode, words.map(w => w.word));
    phase = 'session';
  }

  function handleSessionEnd(result) {
    summary = result;
    phase = 'summary';
    if (result.xpEarned > 0) {
      xpPopup = { amount: result.xpEarned };
      setTimeout(() => { xpPopup = null; }, 2000);
    }
  }

  function handleRestart() {
    phase = 'select';
    mode = null;
    summary = null;
  }
</script>

<div class="study-page">
  {#if phase === 'select'}
    <ModeSelector onSelect={handleModeSelect} />
  {:else if phase === 'session'}
    <Session {mode} onEnd={handleSessionEnd} />
  {:else if phase === 'summary'}
    <SessionSummary {summary} onRestart={handleRestart} />
  {/if}

  {#if xpPopup}
    <XPPopup amount={xpPopup.amount} />
  {/if}
  {#if newBadge}
    <BadgeUnlock badge={newBadge} onClose={() => newBadge = null} />
  {/if}
</div>
```

- [ ] **Step 5: Verify study flow end-to-end**

```bash
npm run dev
# Navigate to /study. Verify:
# - 3 mode cards shown
# - Clicking a mode starts a session
# - Session shows words, accepts answers, advances
# - End of queue shows summary
# - Restart returns to mode selector
```

---

### Task 12: Dictionary page

**Files:**
- Create: `src/pages/Dictionary.svelte`

- [ ] **Step 1: Create Dictionary.svelte**

Search bar, filter by mastery stage, word list with details.

```svelte
<script>
  import { onMount } from 'svelte';
  import { wordsStore } from '../stores/words.js';
  import { STAGES } from '../lib/sm2.js';

  let searchQuery = $state('');
  let filterStage = $state(-1); // -1 = all
  let selectedWord = $state(null);
  let allWords = $state([]);

  onMount(() => {
    wordsStore.load();
    allWords = wordsStore.getAllWords();
  });

  let filteredWords = $derived.by(() => {
    let result = allWords;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(w =>
        w.word.toLowerCase().includes(q) ||
        w.meaning.includes(q)
      );
    }
    if (filterStage >= 0) {
      result = result.filter(w => w.mastery.stage === filterStage);
    }
    return result;
  });
</script>

<div class="dictionary">
  <input
    type="text"
    placeholder="搜索单词 | Search words..."
    bind:value={searchQuery}
    class="search-input"
  />

  <div class="filters">
    <button class="filter-btn" class:active={filterStage === -1} onclick={() => filterStage = -1}>
      全部 | All
    </button>
    {#each STAGES as s}
      <button class="filter-btn" class:active={filterStage === s.id} onclick={() => filterStage = s.id}>
        {s.label}
      </button>
    {/each}
  </div>

  {#if selectedWord}
    <div class="word-detail">
      <button class="back-btn" onclick={() => selectedWord = null}>← 返回 | Back</button>
      <div class="detail-word">{selectedWord.word}</div>
      <div class="detail-phonetic">{selectedWord.phonetic}</div>
      <div class="detail-meaning">{selectedWord.meaning}</div>
      <div class="detail-example">"{selectedWord.example}"</div>
      <div class="detail-translation">{selectedWord.translation}</div>
      <div class="detail-stage">
        掌握阶段 | Stage: {STAGES[selectedWord.mastery.stage].label} ({selectedWord.mastery.stage}/5)
      </div>
      <div class="detail-history">
        复习次数 | Reviews: {selectedWord.mastery.history.length}
        · 正确率 | Accuracy: {selectedWord.mastery.history.length > 0
          ? Math.round(selectedWord.mastery.history.filter(Boolean).length / selectedWord.mastery.history.length * 100) + '%'
          : 'N/A'}
      </div>
    </div>
  {:else}
    <div class="word-list">
      {#each filteredWords as w}
        <button class="word-item" onclick={() => selectedWord = w}>
          <span class="word">{w.word}</span>
          <span class="meaning">{w.meaning}</span>
          <span class="stage-dot" class:stage-{w.mastery.stage}></span>
        </button>
      {:else}
        <div class="empty">没有找到匹配的单词 | No words found</div>
      {/each}
    </div>
  {/if}
</div>
```

---

### Task 13: Achievements page

**Files:**
- Create: `src/pages/Achievements.svelte`
- Create: `src/components/BadgeGrid.svelte`

- [ ] **Step 1: Create BadgeGrid.svelte**

```svelte
<script>
  import { BADGES } from '../lib/badges.js';

  let { unlockedIds = [], onBadgeClick = () => {} } = $props();
</script>

<div class="badge-grid">
  {#each BADGES as badge}
    <button class="badge-card" class:unlocked={unlockedIds.includes(badge.id)} onclick={() => onBadgeClick(badge)}>
      <div class="badge-icon">{badge.icon}</div>
      <div class="badge-name">{badge.name}</div>
      <div class="badge-desc">{badge.desc}</div>
    </button>
  {/each}
</div>

<style>
  .badge-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  @media (min-width: 768px) { .badge-grid { grid-template-columns: repeat(6, 1fr); } }
  .badge-card {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 16px 8px; border-radius: var(--radius-md);
    background: var(--color-card); box-shadow: var(--shadow-sm);
    opacity: 0.35; filter: grayscale(1); transition: all 0.3s;
  }
  .badge-card.unlocked { opacity: 1; filter: none; }
  .badge-icon { font-size: 1.5rem; }
  .badge-name { font-size: 0.75rem; font-weight: 600; }
  .badge-desc { font-size: 0.625rem; color: var(--color-text-secondary); text-align: center; }
</style>
```

- [ ] **Step 2: Create Achievements.svelte**

Level progress tracker + badge grid.

---

### Task 14: Animations + global polish

**Files:**
- Create: `src/styles/animations.css`
- Create: `src/components/XPPopup.svelte`
- Create: `src/components/BadgeUnlock.svelte`
- Create: `src/components/Toast.svelte`

- [ ] **Step 1: Create animations.css**

```css
@keyframes float-up {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-60px) scale(1.2); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pop-in {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}

.float-up { animation: float-up 1.2s ease-out forwards; }
.pulse { animation: pulse 2s ease-in-out infinite; }
.slide-up { animation: slide-up 0.3s ease-out; }
.pop-in { animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

/* Page transitions */
.page-enter { animation: slide-up 0.25s ease-out; }
```

- [ ] **Step 2: Create XPPopup.svelte**

```svelte
<script>
  let { amount = 0 } = $props();
</script>

<div class="xp-popup float-up">
  +{amount} XP
</div>

<style>
  .xp-popup {
    position: fixed; top: 40%; left: 50%; transform: translateX(-50%);
    font-size: 2rem; font-weight: 800;
    color: var(--color-secondary);
    text-shadow: 0 2px 8px rgba(249,115,22,0.3);
    pointer-events: none;
    z-index: 200;
  }
</style>
```

- [ ] **Step 3: Create BadgeUnlock.svelte**

```svelte
<script>
  let { badge = null, onClose = () => {} } = $props();
</script>

{#if badge}
  <div class="overlay" onclick={onClose}>
    <div class="modal pop-in" onclick={(e) => e.stopPropagation()}>
      <div class="modal-icon">🏆</div>
      <div class="modal-subtitle">新成就解锁! | Achievement Unlocked!</div>
      <div class="modal-name">{badge.name} | {badge.nameEn}</div>
      <div class="modal-desc">{badge.desc}</div>
      <button class="modal-btn" onclick={onClose}>太棒了! | Awesome!</button>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center; z-index: 300;
  }
  .modal {
    background: var(--color-card); border-radius: var(--radius-lg);
    padding: 32px; text-align: center; max-width: 320px; width: 90%;
  }
  .modal-icon { font-size: 3rem; margin-bottom: 8px; }
  .modal-subtitle { font-size: 0.875rem; color: var(--color-secondary); font-weight: 600; margin-bottom: 8px; }
  .modal-name { font-size: 1.25rem; font-weight: 700; margin-bottom: 8px; }
  .modal-desc { font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 20px; }
  .modal-btn {
    padding: 12px 32px; background: var(--color-primary); color: white;
    border-radius: var(--radius-md); font-weight: 600;
  }
</style>
```

- [ ] **Step 4: Create Toast.svelte**

```svelte
<script>
  let { message = '', type = 'info', onClose = () => {} } = $props();
</script>

{#if message}
  <div class="toast toast-{type} slide-up" onclick={onClose}>
    {message}
  </div>
{/if}

<style>
  .toast {
    position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
    padding: 12px 24px; border-radius: var(--radius-md);
    font-size: 0.875rem; font-weight: 500;
    z-index: 250; cursor: pointer; white-space: nowrap;
    box-shadow: var(--shadow-md);
  }
  .toast-info { background: var(--color-primary); color: white; }
  .toast-error { background: var(--color-danger); color: white; }
  .toast-success { background: var(--color-success); color: white; }
  @media (min-width: 768px) { .toast { bottom: 24px; } }
</style>
```

- [ ] **Step 5: Wire animations to page transitions in App.svelte**

---

### Task 15: Final integration + edge cases

**Files:**
- Modify: `src/App.svelte` (first-visit detection)
- Modify: all pages (final wiring)

- [ ] **Step 1: Add first-visit welcome flow**

In App.svelte `onMount`, check if user has any XP. If not, show a welcome overlay explaining the app. After first study session, this overlay never shows again.

- [ ] **Step 2: Handle localStorage edge cases**

- In `storage.js`, catch `QuotaExceededError` and dispatch a toast event
- In App.svelte, listen for storage errors and show Toast
- Add empty states for all pages (no words, all mastered, no badges)

- [ ] **Step 3: Add "all mastered" check**

In `wordsStore.getStats()`, if all 3500 words are at stage 5, set `userStore.allMastered = true` to trigger the "大满贯" badge.

- [ ] **Step 4: Verify complete flow**

```bash
npm run dev
# Full walkthrough:
# 1. First visit → welcome message
# 2. Home shows 0 state (streak 0, level 1, 0/20 daily)
# 3. Study → pick mode → session → summary
# 4. Verify XP accumulates, level progresses, streak updates
# 5. Dictionary → search works, filter by stage
# 6. Achievements → badges unlock as conditions met
# 7. Refresh page → all progress persists
# 8. Mobile viewport → bottom nav, touch-friendly
# 9. Desktop viewport → sidebar, max-width content
```

- [ ] **Step 5: Build production bundle**

```bash
npm run build
# Verify output in dist/ is under 200KB total
```

---

## Spec Coverage Check

| Spec Section | Task(s) |
|---|---|
| Color palette (no purple) | Task 1 (global.css variables) |
| Layout / Navigation | Task 1, Task 6 (Nav.svelte, App.svelte) |
| Flashcard mode | Task 9 (WordCard) |
| Quiz mode | Task 10 (QuizChoice) |
| Typing mode | Task 10 (TypingInput) |
| XP / leveling | Task 4 (user store) |
| Streaks | Task 4 (user store) |
| Badges (13 total) | Task 4 (badges.js + user store) |
| SM-2 spaced repetition | Task 2 (sm2.js), Task 3 (words store) |
| localStorage schema | Task 2 (storage.js), Task 4 (user store) |
| Data model | Tasks 2, 3, 4, 5 (all stores) |
| Component tree | Tasks 1, 6, 7, 11, 12, 13 |
| Store architecture | Tasks 3, 4, 5, 8 |
| Persistence strategy | Tasks 2, 3, 4, 5 |
| Word list | Task 3 (words.json) |
| Error & edge case handling | Task 15 |
| Tech stack (svelte-spa-router) | Task 1 (deps), Task 6 (routing) |
| Animations | Task 14 |
| First visit flow | Task 15 |
