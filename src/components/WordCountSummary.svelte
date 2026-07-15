<script>
  import { STAGES } from '../lib/sm2.js';
  let { totalWords = 100, stages = {} } = $props();

  const stageLabels = STAGES.map(s => s.label);
  const stageColors = [
    '#EF4444',
    '#F97316',
    '#F59E0B',
    '#10B981',
    '#06B6D4',
    '#6366F1'
  ];

  let maxCount = $derived(Math.max(...Object.values(stages), 1));
</script>

<div class="word-summary">
  <div class="ws-header">
    <span class="ws-title">词汇进度 | Vocabulary Progress</span>
    <span class="ws-total">{totalWords} 词 | Words</span>
  </div>
  <div class="ws-bars">
    {#each Array(6) as _, i}
      {@const count = stages[i] || 0}
      {@const barPct = (count / maxCount) * 100}
      <div class="ws-bar-item">
        <div class="ws-bar-label">{stageLabels[i]}</div>
        <div class="ws-bar-track">
          <div
            class="ws-bar-fill"
            style="width: {barPct}%; background: {stageColors[i]}"
          ></div>
        </div>
        <div class="ws-bar-count">{count}</div>
      </div>
    {/each}
  </div>
</div>

<style>
  .word-summary {
    padding: 16px;
    border-radius: var(--radius-lg);
    background: var(--color-card);
    box-shadow: var(--shadow-sm);
  }
  .ws-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  .ws-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
  }
  .ws-total {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
  }
  .ws-bars {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .ws-bar-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ws-bar-label {
    width: 40px;
    font-size: 0.7rem;
    color: var(--color-text-secondary);
    text-align: right;
    flex-shrink: 0;
  }
  .ws-bar-track {
    flex: 1;
    height: 10px;
    background: var(--color-bg);
    border-radius: 99px;
    overflow: hidden;
  }
  .ws-bar-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.4s ease;
    min-width: 0;
  }
  .ws-bar-count {
    width: 28px;
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--color-text-secondary);
    text-align: right;
    flex-shrink: 0;
  }
</style>
