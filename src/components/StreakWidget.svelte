<script>
  let { streak = 0, lastStudyDate = null } = $props();
  let isActive = $derived(lastStudyDate === new Date().toISOString().split('T')[0]);
  let colorClass = $derived(streak >= 30 ? 'streak-30' : streak >= 14 ? 'streak-14' : streak >= 7 ? 'streak-7' : 'streak-default');
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
