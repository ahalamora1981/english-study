<script>
  import { onMount } from 'svelte';
  import { sessionStore } from '../stores/session.js';
  import { wordsStore } from '../stores/words.js';
  import WordCard from './WordCard.svelte';
  import QuizChoice from './QuizChoice.svelte';
  import TypingInput from './TypingInput.svelte';

  let { mode = null, onEnd = () => {} } = $props();

  let currentWord = $state(null);
  let progress = $state({ current: 0, total: 0 });

  function readSessionProgress() {
    let state;
    const unsub = sessionStore.subscribe(s => { state = s; }); unsub();
    return state;
  }

  function updateFromStore() {
    const wordStr = sessionStore.getCurrentWord();
    currentWord = wordStr ? wordsStore.getByWord(wordStr) : null;
    const state = readSessionProgress();
    progress = { current: state.currentIndex + 1, total: state.words.length };
  }

  onMount(() => {
    updateFromStore();
  });

  function handleResult(correct, xp) {
    sessionStore.answerCurrent(correct, xp);
    sessionStore.advance();

    // After advancing, check completion. advance() sets active=false on the
    // last word, which makes isComplete() unavailable — fall back to checking
    // whether getCurrentWord() returns null.
    if (sessionStore.isComplete() || !sessionStore.getCurrentWord()) {
      const summary = sessionStore.endSession();
      if (summary) onEnd(summary);
    } else {
      updateFromStore();
    }
  }

  let allWords = $derived(wordsStore.getAllWords());
</script>

<div class="session">
  <div class="progress">
    <span class="progress-text">
      {progress.current} / {progress.total}
    </span>
    <div class="progress-track">
      <div class="progress-fill" style="width: {progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%"></div>
    </div>
  </div>

  {#if currentWord}
    {#if mode === 'flashcard'}
      <WordCard word={currentWord} onResult={handleResult} />
    {:else if mode === 'quiz'}
      <QuizChoice word={currentWord} allWords={allWords} onResult={handleResult} />
    {:else if mode === 'typing'}
      <TypingInput word={currentWord} onResult={handleResult} />
    {/if}
  {/if}
</div>

<style>
  .session { max-width: 480px; margin: 0 auto; }
  .progress { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
  .progress-text { font-size: 0.875rem; font-weight: 600; color: var(--color-text-secondary); white-space: nowrap; min-width: 60px; }
  .progress-track { flex: 1; height: 8px; background: var(--color-bg); border-radius: 99px; overflow: hidden; }
  .progress-fill { height: 100%; background: var(--color-primary); border-radius: 99px; transition: width 0.3s ease; }
</style>
