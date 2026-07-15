<script>
  let { onSelect = () => {} } = $props();
  const modes = [
    { id: 'flashcard', label: '单词卡', labelEn: 'Flashcard', desc: '翻转卡片，回忆词义 | Flip & recall meaning' },
    { id: 'quiz', label: '选择题', labelEn: 'Quiz', desc: '选出正确的中文释义 | Pick the correct meaning' },
    { id: 'typing', label: '拼写', labelEn: 'Typing', desc: '根据释义输入英文 | Type the English word' },
  ];
</script>

<div class="mode-selector">
  <h2 class="mode-heading">选择学习模式 | Choose Mode</h2>
  <div class="mode-cards">
    {#each modes as mode}
      <button class="mode-card" onclick={() => onSelect(mode.id)}>
        <div class="mode-card-badge">{mode.label}</div>
        <div class="mode-label-en">{mode.labelEn}</div>
        <div class="mode-desc">{mode.desc}</div>
      </button>
    {/each}
  </div>
</div>

<style>
  .mode-selector { max-width: 480px; margin: 0 auto; }
  .mode-heading { font-size: 1.25rem; font-weight: 700; text-align: center; margin-bottom: 20px; }
  .mode-cards { display: flex; flex-direction: column; gap: 12px; }
  .mode-card {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 24px; border-radius: var(--radius-lg);
    background: var(--color-card); box-shadow: var(--shadow-sm);
    border: 2px solid var(--color-border);
    transition: all 0.2s;
  }
  .mode-card:hover { border-color: var(--color-primary); box-shadow: var(--shadow-md); }
  .mode-card-badge {
    font-size: 1rem; font-weight: 700;
    background: var(--color-primary); color: white;
    padding: 4px 16px; border-radius: 999px;
  }
  .mode-label-en { font-size: 1.25rem; font-weight: 600; color: var(--color-text); margin-top: 8px; }
  .mode-desc { font-size: 0.875rem; color: var(--color-text-secondary); text-align: center; }
</style>
