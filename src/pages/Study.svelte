<script>
  import { sessionStore } from '../stores/session.js';
  import { wordsStore } from '../stores/words.js';
  import ModeSelector from '../components/ModeSelector.svelte';
  import Session from '../components/Session.svelte';
  import SessionSummary from '../components/SessionSummary.svelte';
  import XPPopup from '../components/XPPopup.svelte';

  let phase = $state('select'); // 'select' | 'session' | 'summary'
  let mode = $state(null);
  let summary = $state(null);
  let xpPopup = $state(null);

  function handleModeSelect(selectedMode) {
    mode = selectedMode;
    const dueWords = wordsStore.getDueWords();
    const words = dueWords.length > 0 ? dueWords : wordsStore.getAllWords().slice(0, 10);
    sessionStore.startSession(selectedMode, words.map(w => w.word));
    phase = 'session';
  }

  function handleSessionEnd(result) {
    summary = result;
    phase = 'summary';
    if (result.xpEarned > 0) {
      xpPopup = { amount: result.xpEarned };
      setTimeout(() => { xpPopup = null; }, 2000);
    }
  }

  function handleRestart() {
    phase = 'select';
    mode = null;
    summary = null;
  }
</script>

<div class="study-page">
  {#if phase === 'select'}
    <ModeSelector onSelect={handleModeSelect} />
  {:else if phase === 'session'}
    <Session {mode} onEnd={handleSessionEnd} />
  {:else if phase === 'summary'}
    <SessionSummary {summary} onRestart={handleRestart} />
  {/if}

  {#if xpPopup}
    <XPPopup amount={xpPopup.amount} />
  {/if}
</div>

<style>
  .study-page { padding: 20px 0; }
</style>
