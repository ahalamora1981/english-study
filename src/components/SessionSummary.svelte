<script>
  let { summary = null, onRestart = () => {} } = $props();
</script>

<div class="summary">
  <h2 class="summary-heading">学习总结 | Session Summary</h2>

  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-value">{summary.totalWords}</div>
      <div class="stat-label">复习单词<br />Words Reviewed</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{summary.accuracy}%</div>
      <div class="stat-label">正确率<br />Accuracy</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">+{summary.xpEarned}</div>
      <div class="stat-label">获得经验<br />XP Earned</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{summary.duration}分钟</div>
      <div class="stat-label">用时<br />Duration</div>
    </div>
  </div>

  <button class="restart-btn" onclick={onRestart}>
    继续学习 | Study Again
  </button>
</div>

<style>
  .summary { max-width: 480px; margin: 0 auto; text-align: center; }
  .summary-heading { font-size: 1.25rem; font-weight: 700; margin-bottom: 24px; }
  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 32px; }
  .stat-card {
    padding: 20px; border-radius: var(--radius-lg);
    background: var(--color-card); box-shadow: var(--shadow-sm);
    border: 1px solid var(--color-border);
  }
  .stat-value { font-size: 1.75rem; font-weight: 700; color: var(--color-primary); line-height: 1.2; }
  .stat-label { font-size: 0.75rem; color: var(--color-text-secondary); margin-top: 4px; line-height: 1.4; }
  .restart-btn {
    padding: 14px 32px; background: var(--color-primary); color: white;
    border-radius: var(--radius-md); font-weight: 600; font-size: 1rem;
    transition: background 0.2s;
  }
  .restart-btn:hover { background: var(--color-primary-hover); }
</style>
