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
    userStore.subscribe(v => { userState = v; });
    wordsStore.subscribe(() => { stats = wordsStore.getStats(); });
    dailyProgress = userStore.getDailyProgress(new Date().toISOString().split('T')[0]);
  });

  let levelInfo = $derived(userStore.getLevelProgress());
  let todayStudied = $derived(dailyProgress?.wordsStudied || 0);
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
  .home {
    max-width: 480px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .greeting {
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 8px;
  }
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
