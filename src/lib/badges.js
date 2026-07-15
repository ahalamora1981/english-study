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
