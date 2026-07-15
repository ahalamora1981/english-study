<script>
  let { word = null, allWords = [], onResult = () => {} } = $props();
  let selected = $state(null);
  let revealed = $state(false);

  let options = $derived.by(() => {
    if (!word || allWords.length < 4) return [];
    // Pick 3 distractors at similar difficulty
    const similar = allWords
      .filter(w => w.word !== word.word && Math.abs(w.difficulty - word.difficulty) <= 1)
      .sort(() => Math.random() - 0.5);
    const distractorCount = Math.min(3, similar.length);
    const distractors = similar.slice(0, distractorCount).map(w => w.meaning);
    const opts = [word.meaning, ...distractors].sort(() => Math.random() - 0.5);
    return opts;
  });

  let correctAnswer = $derived(word?.meaning || '');

  function select(opt) {
    if (revealed) return;
    selected = opt;
    revealed = true;
    const correct = opt === correctAnswer;
    setTimeout(() => {
      onResult(correct, 15);
    }, correct ? 1000 : 2000);
  }
</script>

{#if word}
  <div class="quiz">
    <div class="quiz-word">{word.word}</div>
    <div class="quiz-prompt">选择正确的中文释义 | Choose the correct meaning</div>
    <div class="options">
      {#each options as opt}
        <button
          class="option"
          class:selected-correct={revealed && opt === correctAnswer}
          class:selected-wrong={revealed && opt === selected && opt !== correctAnswer}
          class:faded={revealed && opt !== selected && opt !== correctAnswer}
          onclick={() => select(opt)}
          disabled={revealed}
        >
          {opt}
        </button>
      {/each}
    </div>
  </div>
{/if}

<style>
  .quiz { max-width: 400px; margin: 0 auto; text-align: center; }
  .quiz-word { font-size: 2rem; font-weight: 700; margin-bottom: 8px; }
  .quiz-prompt { font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 24px; }
  .options { display: flex; flex-direction: column; gap: 12px; }
  .option {
    padding: 16px;
    border-radius: var(--radius-md);
    background: var(--color-card);
    box-shadow: var(--shadow-sm);
    font-size: 1.125rem;
    text-align: center;
    transition: all 0.2s;
    border: 2px solid var(--color-border);
  }
  .option:hover:not(:disabled) { border-color: var(--color-primary); }
  .selected-correct { border-color: var(--color-success); background: #ECFDF5; }
  .selected-wrong { border-color: var(--color-danger); background: #FEF2F2; }
  .faded { opacity: 0.4; }
</style>
