<script>
  let { xp = 0, level = 1, progress = 0, required = 100 } = $props();
  let pct = $derived(Math.min(Math.round(progress * 100), 100));
</script>

<div class="xp-bar">
  <div class="xp-header">
    <span class="xp-level">Level {level}</span>
    <span class="xp-numbers">{xp} / {required} XP</span>
  </div>
  <div class="xp-track">
    <div class="xp-fill" style="width: {pct}%"></div>
  </div>
</div>

<style>
  .xp-bar {
    padding: 16px;
    border-radius: var(--radius-lg);
    background: var(--color-card);
    box-shadow: var(--shadow-sm);
  }
  .xp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  .xp-level {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
  }
  .xp-numbers {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
  }
  .xp-track {
    height: 10px;
    background: var(--color-bg);
    border-radius: 99px;
    overflow: hidden;
  }
  .xp-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--color-primary), #38BDF8);
    border-radius: 99px;
    transition: width 0.4s ease;
  }
</style>
