# English Word Memorization App (英语单词背诵)

**Date:** 2026-07-15
**Target:** Chinese high school students (Gaokao)
**Tech Stack:** Svelte 5 SPA, Vite, localStorage
**Design Style:** Modern, flat, no purple

---

## 1. Product Overview

A gamified web app for memorizing Gaokao English vocabulary (~3500 words). Users study through three modes (flashcard, multiple choice, spelling), earn XP, level up, maintain streaks, and collect badges. Progress is stored locally with an architecture that supports future cloud sync.

### Pain Points Addressed

- Gaokao vocabulary is massive (~3500 words) — students need structured, low-friction daily practice
- Existing apps are either too serious (boring) or too childish — targeting teens with modern flat design
- No internet required after initial load — works on school computers and mobile data

---

## 2. Audience

- **Primary:** Chinese high school students (15–18) preparing for Gaokao
- **Secondary:** Any Chinese English learner needing structured vocabulary practice
- **Technical level:** Low — must work on any modern browser without installation

---

## 3. Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| **Primary** | Sky Blue | `#0EA5E9` | Buttons, links, primary actions, active nav |
| **Secondary** | Coral Orange | `#F97316` | XP display, badges, gamification accents |
| **Success** | Emerald | `#10B981` | Correct answers, progress fills, completion |
| **Danger** | Rose | `#EF4444` | Wrong answers, resets, errors |
| **Warning** | Amber | `#F59E0B` | Streak-at-risk, nearly-there states |
| **BG page** | Slate 50 | `#F8FAFC` | Page background |
| **BG card** | White | `#FFFFFF` | Cards, modals, content containers |
| **Text primary** | Slate 900 | `#0F172A` | Headings, body text |
| **Text secondary** | Slate 500 | `#64748B` | Subtitles, hints, meta |

No gradients on solid elements. Flat fills with subtle shadow on interactive cards.

---

## 4. Layout & Navigation

### Responsive Breakpoints

- **Mobile (< 768px):** Bottom tab bar with 4 items
- **Desktop (≥ 768px):** Left fixed sidebar, main content right

### Navigation Items

| Icon | Label | Page | Purpose |
|------|-------|------|---------|
| 🏠 | 首页 / Home | Home | Dashboard: streak, XP, daily goal, quick-start |
| 📖 | 学习 / Study | Study | Mode selector + active study session |
| 📚 | 词典 / Dictionary | Dictionary | Browse/search all words by mastery stage |
| 🏆 | 成就 / Achievements | Achievements | Badge grid + level progression |

### Page Details

#### Home
- Streak flame icon + day count + "连续学习 N 天"
- XP bar showing current level + progress to next
- Circular daily goal progress ring (e.g., 12/20 words)
- Large "开始学习 / Start Study" button
- Quick stats: words mastered, session history

#### Study
- First visit → mode picker (three cards: 单词卡 / 选择题 / 拼写)
- During session → active study interface per mode
- End-of-session summary: XP earned, words reviewed, accuracy %

#### Dictionary
- Search bar at top (search English or Chinese)
- Filter tabs: 全部 / 学习中 / 已掌握 / 收藏
- Card list with word, phonetic, meaning, mastery stage indicator
- Tap → detail view with example sentence, translation, study history

#### Achievements
- Badge grid (3 columns on mobile, 6 on desktop)
- Badge states: locked (gray), unlocked (colored), new (pulse animation)
- "Next to unlock" section at top
- Level progress tracker with milestone markers

---

## 5. Study Modes

### A. Flashcard Mode (单词卡)

```
[Front]                    [Back]
┌──────────────────┐      ┌──────────────────┐
│                  │      │                  │
│    abandon       │      │   abandon        │
│                  │      │   /əˈbændən/     │
│   [Tap to flip]  │      │                  │
│                  │      │   v. 放弃，抛弃   │
│                  │      │                  │
│                  │      │   "They had to   │
│                  │      │   abandon the    │
│                  │      │    game due to   │
│                  │      │    rain."        │
│                  │      │                  │
│                  │      │   ┌────┐ ┌────┐ │
│                  │      │   │忘了│ │知道 │ │
│                  │      │   └────┘ └────┘ │
└──────────────────┘      └──────────────────┘

> **Note:** Emoji icons shown above are placeholders for development. Final build uses inline SVG icons.
```

- Tap card to flip
- Two buttons on back: "忘了 / Forgot" (stage reset) and "知道了 / Knew" (progress + XP)
- Swipe left/right gesture on mobile

### B. Quiz Mode (选择题)

- Show English word, 4 Chinese options
- One correct, three distractors from other words at similar difficulty
- Option buttons styled as large cards
- Correct → green glow + XP animation. Wrong → red flash + reveal correct answer
- Auto-advance after 1.5s on correct, 3s on wrong

### C. Typing Mode (拼写)

- Show Chinese meaning + phonetic hint
- Input field for English spelling
- Case-insensitive but spelling-exact
- Correct → green + XP. Wrong → show correct spelling, highlight wrong letters
- Bonus XP for first-try correct (+5 extra)

---

## 6. Gamification System

### Experience Points (XP)

| Action | XP | Notes |
|--------|----|-------|
| Flashcard correct | +10 | Per word |
| Quiz correct | +15 | Per question |
| Typing correct | +20 | Per word |
| Daily login | +5 | Once per day |
| 7-day streak | +50 | Bonus |
| 14-day streak | +100 | Bonus |
| 30-day streak | +200 | Bonus |

### Leveling Formula

```
totalXP = level × 100 + (level-1) × 50
```

| Level | Total XP Needed | Cumulative |
|-------|----------------|------------|
| 1 | 100 | 100 |
| 2 | 250 | 350 |
| 3 | 450 | 800 |
| 5 | 950 | 1,950 |
| 10 | 1,950 | 5,450 |
| 25 | 4,950 | 32,450 |

### Streaks

- Tracked by `lastStudyDate`
- Study today → streak continues (display: 🔥 N days)
- Gap of 1+ day → streak resets to 0
- Streak shown prominently on home screen
- If daily goal met → streak day counts even if session was short

### Badges (13 total)

**Word Count (4):**
- 初露锋芒: Learn 10 words
- 百词斩: Learn 100 words
- 词汇达人: Learn 500 words
- 千词大师: Learn 1,000 words

**Streak (4):**
- 三天打鱼: 3-day streak
- 一周坚持: 7-day streak
- 半月之星: 14-day streak
- 铁杆学霸: 30-day streak

**Level (3):**
- 小学徒: Reach level 5
- 高手: Reach level 10
- 词霸: Reach level 25

**Special (2):**
- 完美一天: Perfect session (all answers correct, ≥10 words)
- 大满贯: Master all 3500 words at stage 5

---

## 7. Spaced Repetition (SM-2)

Each word has a mastery record:

```
{
  "stage": 0-5,        // Current mastery stage
  "ease": 2.5,         // Ease factor (min 1.3)
  "interval": 1,       // Days until next review
  "repetitions": 0,    // Consecutive correct answers
  "nextReview": "date", // ISO date string
  "history": []        // Last 10 results (true/false)
}
```

### Stages

| Stage | Label | Interval | Criteria |
|-------|-------|----------|----------|
| 0 | 未学 / New | — | Never reviewed |
| 1 | 学习中 / Learning | 10 min | Just started |
| 2 | 复习中 / Reviewing | 1 day | Correct once |
| 3 | 巩固中 / Consolidating | 3 days | Correct 2-3x |
| 4 | 熟悉 / Familiar | 7 days | Consistent recall |
| 5 | 已掌握 / Mastered | 30 days | Automatic |

### Algorithm

- **Correct answer:** `interval = interval × ease`, `repetitions++`, advance stage
- **Wrong answer:** `repetitions = 0`, `stage = max(1, stage - 1)`, `ease = max(1.3, ease - 0.2)`
- **Quality rating (3-point):** Student selects "Knew" (quality 3) or "Forgot" (quality 0)

---

## 8. Data Model

### localStorage Schema

```json
{
  "user": {
    "xp": 0,
    "level": 1,
    "streak": 0,
    "lastStudyDate": null,
    "dailyGoal": 20,
    "totalWordsLearned": 0,
    "unlockedBadges": []
  },
  "dailyProgress": {
    "2026-07-15": {
      "wordsStudied": 15,
      "correctAnswers": 12,
      "sessionCount": 1,
      "xpEarned": 180
  },
  "wordMastery": {
    "abandon": {
      "stage": 0,
      "ease": 2.5,
      "interval": 1,
      "repetitions": 0,
      "nextReview": "2026-07-15",
      "history": []
    }
  },
  "settings": {
    "theme": "default",
    "studyModeOrder": ["flashcard", "quiz", "typing"],
    "dailyGoal": 20,
    "reviewNewWordsPerSession": 5
  }
}
```

---

## 9. Architecture

### Component Tree

```
App.svelte
├── Nav.svelte                  # Bottom bar / sidebar
├── [Page Router]
│   ├── Home.svelte
│   │   ├── StreakWidget
│   │   ├── XPBar
│   │   ├── DailyGoalRing
│   │   └── WordCountSummary
│   ├── Study.svelte
│   │   ├── ModeSelector
│   │   ├── Session.svelte
│   │   │   ├── WordCard       (flashcard mode)
│   │   │   ├── QuizChoice     (quiz mode)
│   │   │   └── TypingInput    (typing mode)
│   │   └── SessionSummary
│   ├── Dictionary.svelte
│   │   ├── SearchBar
│   │   ├── MasteryFilter
│   │   └── WordDetail
~3500 words sourced from the Gaokao syllabus (教育部高考英语大纲词汇表). The word list is compiled into a structured JSON file, imported statically at build time — no runtime fetch needed. Fields indexed by word (key) for O(1) lookup.

If the full 3500-word list cannot be fully sourced before development starts, ship with a representative subset (~500 high-frequency Gaokao words) that grows to the full list over the first iterations. The data schema supports incremental addition.

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
└── Toast.svelte                # Notification toasts
```

### Store Architecture

```
stores/
├── user.js       →  user state (xp, level, streak, daily)
│   - load()         hydrate from localStorage
│   - addXP(n)       increment, check level-up
│   - recordStudy()  update streak + daily progress
│   - save()         persist to localStorage
├── words.js      →  word list + mastery data
│   - load()         hydrate from localStorage + word list
│   - getDueWords()  words past nextReview
│   - recordResult(wordId, correct)  update SM-2 params
│   - getStats()     counts by stage
│   - save()         persist mastery to localStorage
├── session.js    →  current study session (ephemeral)
│   - startSession(mode, words)
│   - answerCurrent(result)  record + advance
│   - endSession()           compute summary
└── settings.js   →  user preferences
    - load/save
    - set(key, value)
```

### Persistence Strategy

- Stores auto-save to localStorage on every meaningful change (debounced 500ms)
- On page load, all stores hydrate from localStorage
- `words.json` (the Gaokao word list) is bundled as a static import — never mutated. Only mastery data mutates.
- Cloud-ready: persistence is abstracted behind `storage.js` with `get/set/delete` primitives. A future sync layer would implement the same interface against an API.

---

## 10. Word List

~3500 words sourced from the Gaokao syllabus. Each entry:

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


---

## 11. Error & Edge Case Handling

| Scenario | Behavior |
|----------|----------|
| First visit | Auto-create default progress data, show welcome tip |
| localStorage full | Catch `QuotaExceededError`, show toast "存储空间不足" |
| All words mastered | Congratulatory screen, offer "重新开始" reset |
| No words due for review | Pull new words only. If none left, show "全部已掌握！" |
| Session interrupted | Per-word results saved immediately. Session summary lost (acceptable) |
| localStorage unavailable | Show error with instructions to enable it |
| Empty search results | "没有找到匹配的单词" with friendly illustration |
| Daily goal changed mid-day | Recalculate percentage, don't reset today's progress |

---

## 12. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Svelte 5** | Reactive runes perfect for gamification state, tiny bundle |
| Bundler | **Vite** | Fast dev, optimized production builds |
| CSS | **Plain CSS with custom properties** | Flat design doesn't need a framework. CSS vars for theming |
| Storage | **localStorage** via `storage.js` | Simple, sufficient for MVP |
| **Router** | **svelte-spa-router** | Hash-based SPA routing with route guards |
| Icons | **Inline SVG sprites** | No icon library dependency |
| Font | **system-ui / Noto Sans SC** | Fast loading, CJK support |
| Deployment | **Static files (any host)** | `npm run build` → `dist/` → deploy |

---

## 13. Out of Scope (MVP)

These are explicitly deferred to keep the first build focused:

- User accounts / cloud sync
- AI-generated distractors for quiz mode
- Pronunciation audio (TTS)
- Social features (leaderboards, friend challenges)
- Custom word lists / import
- Anki export/import
- Dark mode

---

## 14. Success Metrics

| Metric | Target |
|--------|--------|
| Words reviewed per day (active user) | ≥20 |
| Day-7 retention | ≥40% |
| Average session duration | 8-15 minutes |
| Words mastered (stage 5) after 30 days | ≥200 |
