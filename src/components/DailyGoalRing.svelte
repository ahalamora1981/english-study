<script>
  let { current = 0, goal = 20 } = $props();
  let pct = $derived(goal > 0 ? Math.min(current / goal, 1) : 0);
  let circumference = $derived(2 * Math.PI * 40);
</script>

<div class="goal-ring">
  <svg viewBox="0 0 100 100" class="ring-svg">
    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-bg)" stroke-width="8" />
    <circle
      cx="50" cy="50" r="40"
      fill="none"
      stroke="var(--color-success)"
      stroke-width="8"
      stroke-linecap="round"
      stroke-dasharray={circumference}
      stroke-dashoffset={circumference * (1 - pct)}
      transform="rotate(-90 50 50)"
      class="ring-progress"
    />
  </svg>
  <div class="ring-center">
    <span class="ring-current">{current}</span>
    <span class="ring-divider">/</span>
    <span class="ring-goal">{goal}</span>
  </div>
  <div class="ring-label">今日目标 | Daily Goal</div>
</div>

<style>
  .goal-ring {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    border-radius: var(--radius-lg);
    background: var(--color-card);
    box-shadow: var(--shadow-sm);
  }
  .ring-svg {
    width: 80px;
    height: 80px;
  }
  .ring-progress {
    transition: stroke-dashoffset 0.5s ease;
  }
  .ring-center {
    position: absolute;
    display: flex;
    align-items: baseline;
    gap: 2px;
    margin-top: -60px;
  }
  .ring-current {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-success);
  }
  .ring-divider {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
  .ring-goal {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
  .ring-label {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    margin-top: 4px;
  }
</style>
