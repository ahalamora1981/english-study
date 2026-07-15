<script>
  import { onMount } from 'svelte';
  import { userStore } from '../stores/user.js';
  import XPBar from '../components/XPBar.svelte';
  import BadgeGrid from '../components/BadgeGrid.svelte';

  let userState = $state({ xp: 0, level: 1, streak: 0, lastStudyDate: null, dailyGoal: 20, totalWordsLearned: 0, unlockedBadges: [] });
  let levelInfo = $state({ level: 1, currentXp: 0, requiredXp: 100, progress: 0 });

  onMount(() => {
    userStore.load();
    userStore.subscribe(v => { userState = v; });
    levelInfo = userStore.getLevelProgress();
  });

  function handleBadgeClick(badge) {
    // badge click handler — could show detail in the future
  }
</script>

<div class="achievements">
  <h1 class="page-title">成就 | Achievements</h1>

  <div class="level-section">
    <h2 class="section-title">等级进度 | Level Progress</h2>
    <XPBar
      xp={levelInfo.currentXp}
      level={levelInfo.level}
      progress={levelInfo.progress}
      required={levelInfo.requiredXp}
    />
    <div class="quick-stats">
      <div class="stat-item">
        <span class="stat-value">{userState.totalWordsLearned}</span>
        <span class="stat-label">已学单词 | Words Learned</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{userState.streak}</span>
        <span class="stat-label">连续天数 | Day Streak</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{userState.unlockedBadges.length}</span>
        <span class="stat-label">已获成就 | Badges Earned</span>
      </div>
    </div>
  </div>

  <div class="badge-section">
    <h2 class="section-title">成就徽章 | Badges</h2>
    <BadgeGrid
      unlockedIds={userState.unlockedBadges}
      onBadgeClick={handleBadgeClick}
    />
  </div>
</div>

<style>
  .achievements {
    max-width: 480px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .page-title {
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 4px;
  }
  .section-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-text);
    margin-bottom: 8px;
  }
  .level-section {
    display: flex;
    flex-direction: column;
  }
  .quick-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 12px;
  }
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 14px 8px;
    background: var(--color-card);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
  }
  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primary);
  }
  .stat-label {
    font-size: 0.7rem;
    color: var(--color-text-secondary);
    text-align: center;
    margin-top: 2px;
  }
  .badge-section {
    display: flex;
    flex-direction: column;
  }
</style>
