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
