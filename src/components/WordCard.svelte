<script>
  let { word = null, onResult = () => {} } = $props();
  let flipped = $state(false);

  function handleResult(correct) {
    onResult(correct, 10);
  }

  $: if (word) flipped = false; // Reset flip on new word
</script>

{#if word}
  <div class="card-container" class:flipped>
    <div class="card-inner" onclick={() => { if (!flipped) flipped = true; }}>
      <!-- Front -->
      <div class="card-front">
        <div class="word-text">{word.word}</div>
        <div class="hint">点击翻转 | Tap to flip</div>
      </div>
      <!-- Back -->
      <div class="card-back">
        <div class="word-text">{word.word}</div>
        <div class="phonetic">{word.phonetic}</div>
        <div class="meaning">{word.meaning}</div>
        {#if word.example}
          <div class="example">{word.example}</div>
          <div class="translation">{word.translation}</div>
        {/if}
      </div>
    </div>
  </div>

  {#if flipped}
    <div class="actions">
      <button class="btn-forgot" onclick={() => handleResult(false)}>
        忘了 | Forgot
      </button>
      <button class="btn-knew" onclick={() => handleResult(true)}>
        知道 | Knew
      </button>
    </div>
  {/if}
{/if}

<style>
  .card-container {
    perspective: 1000px;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    aspect-ratio: 3 / 2;
    cursor: pointer;
  }
  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.4s ease;
    transform-style: preserve-3d;
  }
  .flipped .card-inner {
    transform: rotateY(180deg);
  }
  .card-front, .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: var(--radius-lg);
    background: var(--color-card);
    box-shadow: var(--shadow-md);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    text-align: center;
  }
  .card-back {
    transform: rotateY(180deg);
  }
  .word-text { font-size: 1.75rem; font-weight: 700; color: var(--color-text); }
  .phonetic { font-size: 1rem; color: var(--color-text-secondary); margin-top: 8px; }
  .meaning { font-size: 1.25rem; color: var(--color-text); margin-top: 12px; }
  .example { font-size: 0.875rem; color: var(--color-text-secondary); font-style: italic; margin-top: 16px; }
  .translation { font-size: 0.75rem; color: var(--color-text-secondary); margin-top: 4px; }
  .hint { font-size: 0.75rem; color: var(--color-text-secondary); margin-top: auto; }
  .actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-top: 20px;
  }
  .btn-forgot, .btn-knew {
    padding: 14px 32px;
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 1rem;
  }
  .btn-forgot { background: var(--color-danger); color: white; }
  .btn-knew { background: var(--color-success); color: white; }
  .btn-forgot:hover { background: var(--color-danger-hover); }
  .btn-knew:hover { background: var(--color-success-hover); }
</style>
