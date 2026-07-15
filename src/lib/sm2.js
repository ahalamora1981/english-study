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
