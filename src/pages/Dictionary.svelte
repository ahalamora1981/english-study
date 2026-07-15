<script>
  import { onMount } from 'svelte';
  import { wordsStore } from '../stores/words.js';
  import { STAGES } from '../lib/sm2.js';

  let searchQuery = $state('');
  let filterStage = $state(-1); // -1 = all
  let selectedWord = $state(null);
  let allWords = $state([]);

  onMount(() => {
    wordsStore.load();
    allWords = wordsStore.getAllWords();
  });

  let filteredWords = $derived.by(() => {
    let result = allWords;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(w =>
        w.word.toLowerCase().includes(q) ||
        w.meaning.includes(q)
      );
    }
    if (filterStage >= 0) {
      result = result.filter(w => w.mastery.stage === filterStage);
    }
    return result;
  });
</script>

<div class="dictionary">
  <h1 class="page-title">词典 | Dictionary</h1>

  <input
    type="text"
    placeholder="搜索单词 | Search words..."
    bind:value={searchQuery}
    class="search-input"
  />

  <div class="filters">
    <button class="filter-btn" class:active={filterStage === -1} onclick={() => filterStage = -1}>
      全部 | All
    </button>
    {#each STAGES as s}
      <button class="filter-btn" class:active={filterStage === s.id} onclick={() => filterStage = s.id}>
        {s.label}
      </button>
    {/each}
  </div>

  {#if selectedWord}
    <div class="word-detail">
      <button class="back-btn" onclick={() => selectedWord = null}>← 返回 | Back</button>
      <div class="detail-word">{selectedWord.word}</div>
      <div class="detail-phonetic">{selectedWord.phonetic}</div>
      <div class="detail-label">释义 | Meaning</div>
      <div class="detail-meaning">{selectedWord.meaning}</div>
      <div class="detail-label">例句 | Example</div>
      <div class="detail-example">"{selectedWord.example}"</div>
      <div class="detail-label">翻译 | Translation</div>
      <div class="detail-translation">{selectedWord.translation}</div>
      <div class="detail-stage">
        掌握阶段 | Stage: {STAGES[selectedWord.mastery.stage].label} ({selectedWord.mastery.stage}/5)
      </div>
      <div class="detail-history">
        复习次数 | Reviews: {selectedWord.mastery.history.length}
        · 正确率 | Accuracy: {selectedWord.mastery.history.length > 0
          ? Math.round(selectedWord.mastery.history.filter(Boolean).length / selectedWord.mastery.history.length * 100) + '%'
          : 'N/A'}
      </div>
    </div>
  {:else}
    <div class="word-list">
      {#each filteredWords as w}
        <button class="word-item" onclick={() => selectedWord = w}>
          <span class="word">{w.word}</span>
          <span class="meaning">{w.meaning}</span>
          <span class="stage-dot stage-{w.mastery.stage}"></span>
        </button>
      {:else}
        <div class="empty">没有找到匹配的单词 | No words found</div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .dictionary {
    max-width: 480px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .page-title {
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 4px;
  }
  .search-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-card);
    color: var(--color-text);
    outline: none;
    transition: border-color 0.2s;
  }
  .search-input:focus {
    border-color: var(--color-primary);
  }
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .filter-btn {
    padding: 6px 14px;
    border-radius: var(--radius-sm);
    background: var(--color-card);
    border: 1px solid var(--color-border);
    font-size: 0.8rem;
    transition: all 0.2s;
    color: var(--color-text-secondary);
  }
  .filter-btn.active {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
  .word-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .word-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    background: var(--color-card);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    text-align: left;
    transition: box-shadow 0.2s;
  }
  .word-item:hover {
    box-shadow: var(--shadow-md);
  }
  .word {
    font-weight: 600;
    color: var(--color-text);
    flex-shrink: 0;
  }
  .meaning {
    flex: 1;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .stage-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .stage-0 { background: #D1D5DB; }
  .stage-1 { background: #FBBF24; }
  .stage-2 { background: #F97316; }
  .stage-3 { background: #3B82F6; }
  .stage-4 { background: #8B5CF6; }
  .stage-5 { background: #10B981; }
  .empty {
    text-align: center;
    padding: 40px 16px;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
  }
  .word-detail {
    padding: 20px;
    background: var(--color-card);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .back-btn {
    align-self: flex-start;
    padding: 8px 16px;
    background: var(--color-bg);
    border-radius: var(--radius-sm);
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    transition: background 0.2s;
  }
  .back-btn:hover {
    background: var(--color-border);
  }
  .detail-word {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-text);
  }
  .detail-phonetic {
    font-size: 1rem;
    color: var(--color-text-secondary);
  }
  .detail-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-secondary);
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .detail-meaning {
    font-size: 1.1rem;
    color: var(--color-text);
  }
  .detail-example {
    font-style: italic;
    color: var(--color-text);
    padding: 8px 12px;
    background: var(--color-bg);
    border-radius: var(--radius-sm);
    border-left: 3px solid var(--color-primary);
  }
  .detail-translation {
    color: var(--color-text-secondary);
  }
  .detail-stage {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-primary);
    padding-top: 8px;
    border-top: 1px solid var(--color-border);
  }
  .detail-history {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
  }
</style>
