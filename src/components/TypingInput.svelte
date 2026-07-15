<script>
  let { word = null, onResult = () => {} } = $props();
  let input = $state('');
  let checked = $state(false);
  let correct = $state(false);

  $effect(() => {
    if (word) {
      input = '';
      checked = false;
      correct = false;
    }
  });

  function check() {
    if (checked) return;
    checked = true;
    // Case-insensitive comparison
    const isCorrect = input.trim().toLowerCase() === word.word.toLowerCase();
    correct = isCorrect;
    const xp = isCorrect ? 20 + (word.difficulty >= 3 ? 5 : 0) : 0;
    setTimeout(() => {
      onResult(isCorrect, xp);
    }, 1500);
  }

  function handleKeydown(e) {
    if (e.key === 'Enter') check();
  }
</script>

{#if word}
  <div class="typing">
    <div class="typing-meaning">{word.meaning}</div>
    <div class="typing-hint">{word.phonetic}</div>
    <div class="input-row">
      <input
        type="text"
        bind:value={input}
        onkeydown={handleKeydown}
        placeholder="输入英文 | Type the word"
        disabled={checked}
        class:correct
        class:wrong={checked && !correct}
      />
      <button class="check-btn" onclick={check} disabled={checked}>
        检查 | Check
      </button>
    </div>
    {#if checked}
      <div class="result" class:correct class:wrong={!correct}>
        {#if correct}
          正确! | Correct!
        {:else}
          正确拼写 | Correct spelling: {word.word}
        {/if}
      </div>
    {/if}
  </div>
{/if}

<style>
  .typing { max-width: 400px; margin: 0 auto; text-align: center; }
  .typing-meaning { font-size: 1.5rem; font-weight: 700; margin-bottom: 8px; }
  .typing-hint { font-size: 1rem; color: var(--color-text-secondary); margin-bottom: 24px; }
  .input-row { display: flex; gap: 8px; }
  input {
    flex: 1;
    padding: 14px;
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 1.125rem;
    outline: none;
    transition: border-color 0.2s;
  }
  input:focus { border-color: var(--color-primary); }
  input.correct { border-color: var(--color-success); background: #ECFDF5; }
  input.wrong { border-color: var(--color-danger); background: #FEF2F2; }
  .check-btn {
    padding: 14px 20px;
    background: var(--color-primary);
    color: white;
    border-radius: var(--radius-md);
    font-weight: 600;
  }
  .check-btn:disabled { opacity: 0.6; }
  .result { margin-top: 16px; font-weight: 600; }
  .result.correct { color: var(--color-success); }
  .result.wrong { color: var(--color-danger); }
</style>
