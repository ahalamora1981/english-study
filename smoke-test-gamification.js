/**
 * Smoke test for gamification pure functions.
 * Tests XP/level calculations and badge logic in isolation.
 * Run: node smoke-test-gamification.js  (or with bun)
 */

// ===== Pure functions (extracted from user.js for test isolation) =====

function calcLevel(totalXp) {
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

// ===== Badge definitions and check logic =====

const BADGES = [
  { id: 'words_10',    check: s => s.totalWordsLearned >= 10 },
  { id: 'words_100',   check: s => s.totalWordsLearned >= 100 },
  { id: 'words_500',   check: s => s.totalWordsLearned >= 500 },
  { id: 'words_1000',  check: s => s.totalWordsLearned >= 1000 },
  { id: 'streak_3',    check: s => s.streak >= 3 },
  { id: 'streak_7',    check: s => s.streak >= 7 },
  { id: 'streak_14',   check: s => s.streak >= 14 },
  { id: 'streak_30',   check: s => s.streak >= 30 },
  { id: 'level_5',     check: s => s.level >= 5 },
  { id: 'level_10',    check: s => s.level >= 10 },
  { id: 'level_25',    check: s => s.level >= 25 },
  { id: 'perfect_day', check: s => s.perfectSessions >= 1 },
  { id: 'grand_slam',  check: s => s.allMastered },
];

function checkNewBadges(userState, currentBadges) {
  const unlocked = [];
  for (const badge of BADGES) {
    if (!currentBadges.includes(badge.id) && badge.check(userState)) {
      unlocked.push(badge.id);
    }
  }
  return unlocked;
}

// ===== Streak calculation logic (from recordStudy) =====

function calcStreak(lastStudyDate, prevStreak) {
  if (!lastStudyDate) return 1;
  const last = new Date(lastStudyDate);
  const curr = new Date();
  const today = curr.toISOString().slice(0, 10);
  // For testing, we pass today explicitly
  return null; // placeholder
}

// ===== Tests =====

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${label}`);
  } else {
    failed++;
    console.error(`  FAIL: ${label}`);
  }
}

// --- Level 1 ---
console.log('\n=== Level calculations ===');

// Level 1: 0 XP
assert(calcLevel(0) === 1, 'calcLevel(0) = 1');
assert(calcLevel(50) === 1, 'calcLevel(50) = 1');
assert(calcLevel(99) === 1, 'calcLevel(99) = 1');

// Level 1 → 2 transition: 100 XP needed
assert(calcLevel(100) === 2, 'calcLevel(100) = 2');
assert(calcLevel(150) === 2, 'calcLevel(150) = 2');

// Level 2→3: next requirement = 2*100 + 1*50 = 250, cumulative = 100, so 350 total
assert(calcLevel(249) === 2, 'calcLevel(249) = 2');
assert(calcLevel(250) === 2, 'calcLevel(250) = 2 (need 350 for lv3)');
assert(calcLevel(350) === 3, 'calcLevel(350) = 3');

// Level 3→4: req = 3*100 + 2*50 = 400, cumulative = 100+250=350, total = 750
assert(calcLevel(749) === 3, 'calcLevel(749) = 3');
assert(calcLevel(750) === 4, 'calcLevel(750) = 4');

// Level 4→5: req = 4*100 + 3*50 = 550, cumulative = 100+250+400=750, total = 1300
assert(calcLevel(1300) === 5, 'calcLevel(1300) = 5');

// --- Level Progress ---
console.log('\n=== Level progress ===');

let p = calcLevelProgress(0);
assert(p.level === 1 && p.currentXp === 0 && p.requiredXp === 100 && p.progress === 0,
  'calcLevelProgress(0) = {level:1, current:0, required:100, progress:0}');

p = calcLevelProgress(50);
assert(p.level === 1 && p.currentXp === 50 && p.requiredXp === 100 && p.progress === 0.5,
  'calcLevelProgress(50) = {level:1, current:50, progress:0.5}');

p = calcLevelProgress(100);
assert(p.level === 2 && p.currentXp === 0, 'calcLevelProgress(100) = {level:2, current:0}');

p = calcLevelProgress(350);
assert(p.level === 3 && p.currentXp === 0, 'calcLevelProgress(350) = {level:3, current:0}');

p = calcLevelProgress(400);
assert(p.level === 3 && p.currentXp === 50 && p.requiredXp === 400,
  'calcLevelProgress(400) = {level:3, current:50, required:400}');

// --- Badge checks ---
console.log('\n=== Badge logic ===');

const state = {
  xp: 0,
  level: 1,
  streak: 0,
  totalWordsLearned: 5,
  unlockedBadges: [],
  perfectSessions: 0,
  allMastered: false
};

let badges = checkNewBadges(state, []);
assert(badges.length === 0, '5 words, 0 streak, level 1 → no badges');

// Word badges
const state2 = { ...state, totalWordsLearned: 10 };
badges = checkNewBadges(state2, []);
assert(badges.includes('words_10') && badges.length === 1, '10 words → words_10 badge');

const state3 = { ...state, totalWordsLearned: 100 };
badges = checkNewBadges(state3, []);
assert(badges.includes('words_10') && badges.includes('words_100') && badges.length === 2,
  '100 words → words_10 + words_100');

// Already has words_10, only gets new ones
badges = checkNewBadges(state3, ['words_10']);
assert(badges.includes('words_100') && !badges.includes('words_10') && badges.length === 1,
  '100 words with words_10 already → only words_100');

// Streak badges
const state4 = { ...state, streak: 7 };
badges = checkNewBadges(state4, []);
assert(badges.includes('streak_3') && badges.includes('streak_7') && badges.length === 2,
  'streak 7 → streak_3 + streak_7');

// Level badges
const state5 = { ...state, level: 10, unlockedBadges: [] };
badges = checkNewBadges(state5, []);
assert(badges.includes('level_5') && badges.includes('level_10') && badges.length === 2,
  'level 10 → level_5 + level_10');

// Perfect session badge
const state6 = { ...state, perfectSessions: 1 };
badges = checkNewBadges(state6, []);
assert(badges.includes('perfect_day') && badges.length === 1,
  'perfectSessions >= 1 → perfect_day');

// Grand slam badge
const state7 = { ...state, allMastered: true };
badges = checkNewBadges(state7, []);
assert(badges.includes('grand_slam') && badges.length === 1,
  'allMastered → grand_slam');

// --- 13 badges total ---
assert(BADGES.length === 13, '13 badge definitions total');

// --- Threshold checks ---
// words_1000 needs 1000 words
const state8 = { ...state, totalWordsLearned: 1000 };
badges = checkNewBadges(state8, []);
assert(badges.includes('words_1000'), '1000 words → words_1000');
assert(badges.includes('words_500'), '1000 words → words_500');

// level_25
const state9 = { ...state, level: 25 };
badges = checkNewBadges(state9, []);
assert(badges.includes('level_25'), 'level 25 → level_25');

// streak_30
const state10 = { ...state, streak: 30 };
badges = checkNewBadges(state10, []);
assert(badges.includes('streak_30'), 'streak 30 → streak_30');

// --- Edge cases ---
assert(calcLevel(-1) === 1, 'calcLevel(-1) = 1 (negative XP clamps to level 1)');

// Large XP value
assert(calcLevel(10000) > 10, 'calcLevel(10000) > 10');

p = calcLevelProgress(10000);
assert(p.level > 1 && p.currentXp >= 0 && p.progress >= 0 && p.progress < 1,
  'calcLevelProgress(10000) produces valid progress ratio');

// Badge: no false positives for already unlocked
badges = checkNewBadges(state3, ['words_10', 'words_100', 'words_500', 'words_1000',
  'streak_3', 'streak_7', 'streak_14', 'streak_30',
  'level_5', 'level_10', 'level_25',
  'perfect_day', 'grand_slam']);
assert(badges.length === 0, 'all badges already unlocked → no new badges');

// ===== Summary =====
console.log('\n======================');
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('======================');

if (failed > 0) {
  process.exit(1);
}
