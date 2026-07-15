<script>
  import { onMount, onDestroy } from 'svelte';
  import Nav from './components/Nav.svelte';
  import Home from './pages/Home.svelte';
  import Study from './pages/Study.svelte';
  import Dictionary from './pages/Dictionary.svelte';
  import Achievements from './pages/Achievements.svelte';
  import Toast from './components/Toast.svelte';
  import { userStore } from './stores/user.js';
  import { wordsStore } from './stores/words.js';
  import { settingsStore } from './stores/settings.js';
  import { on } from './lib/notifications.js';
  import './styles/animations.css';

  const routes = {
    '/': Home, '/study': Study,
    '/dictionary': Dictionary, '/achievements': Achievements,
  };

  let currentRoute = $state('/');
  let showWelcome = $state(false);
  let toast = $state({ message: '', type: 'info' });
  let unsubs = [];

  function updateRoute() {
    const hash = window.location.hash;
    currentRoute = hash.startsWith('#/') ? hash.slice(1) : '/';
  }

  let Page = $derived(routes[currentRoute] || Home);

  onMount(() => {
    userStore.load();
    wordsStore.load();
    settingsStore.load();

    updateRoute();
    window.addEventListener('hashchange', updateRoute);

    const unsub = userStore.subscribe(state => {
      if (state.xp === 0 && state.totalWordsLearned === 0) {
        showWelcome = true;
      }
      unsub();
    });

    unsubs.push(on('storage:error', (data) => {
      toast = { message: data.message, type: 'error' };
    }));
  });

  onDestroy(() => {
    window.removeEventListener('hashchange', updateRoute);
  });

  function handleWelcomeClose() {
    showWelcome = false;
    window.location.hash = '#/study';
  }

  function handleToastClose() {
    toast = { message: '', type: 'info' };
  }
</script>

<div class="app-shell">
  <Nav />
  <main class="main-content">
    {#if Page}
      {@const Comp = Page}
      <Comp />
    {/if}
  </main>

  {#if showWelcome}
    <div class="overlay" onclick={handleWelcomeClose} onkeydown={(e) => { if (e.key === 'Escape' || e.key === 'Enter') handleWelcomeClose(); }} role="dialog" aria-modal="true" tabindex="-1">
      <div class="welcome-modal pop-in" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="document">
        <div class="modal-icon">🎉</div>
        <h2 class="welcome-title">欢迎来到单词达人<br />Welcome to Word Master</h2>
        <p class="welcome-desc">每天学习英语单词，备战高考！<br />Study English words daily, prepare for Gaokao!</p>
        <div class="welcome-features">
          <div class="feature">
            <span class="feature-icon">📇</span>
            <span class="feature-text">闪卡模式 | Flashcards</span>
          </div>
          <div class="feature">
            <span class="feature-icon">❓</span>
            <span class="feature-text">选择题 | Quiz</span>
          </div>
          <div class="feature">
            <span class="feature-icon">⌨️</span>
            <span class="feature-text">拼写输入 | Typing</span>
          </div>
          <div class="feature">
            <span class="feature-icon">🔥</span>
            <span class="feature-text">连续学习 | Streaks</span>
          </div>
          <div class="feature">
            <span class="feature-icon">⭐</span>
            <span class="feature-text">经验升级 | XP & Levels</span>
          </div>
          <div class="feature">
            <span class="feature-icon">🏆</span>
            <span class="feature-text">成就徽章 | Badges</span>
          </div>
        </div>
        <button class="welcome-btn" onclick={handleWelcomeClose}>
          开始学习 | Start Learning
        </button>
      </div>
    </div>
  {/if}

  {#if toast.message}
    <Toast message={toast.message} type={toast.type} onClose={handleToastClose} />
  {/if}
</div>

<style>
  .app-shell {
    display: flex;
    height: 100%;
  }
  .main-content {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    padding-bottom: 80px; /* space for mobile nav */
  }
  @media (min-width: 768px) {
    .main-content {
      padding-bottom: 24px;
    }
  }

  /* Welcome overlay — matches BadgeUnlock style */
  .overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center; z-index: 300;
  }
  .welcome-modal {
    background: var(--color-card); border-radius: var(--radius-lg);
    padding: 32px 24px; text-align: center; max-width: 360px; width: 90%;
    max-height: 90vh; overflow-y: auto;
  }
  .modal-icon { font-size: 3rem; margin-bottom: 8px; }
  .welcome-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 8px; line-height: 1.4; }
  .welcome-desc { font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 20px; }
  .welcome-features {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 24px;
    text-align: left;
  }
  .feature {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    background: var(--color-bg);
    border-radius: var(--radius-md);
    font-size: 0.8rem;
  }
  .feature-icon { font-size: 1.1rem; flex-shrink: 0; }
  .feature-text { color: var(--color-text); line-height: 1.2; }
  .welcome-btn {
    padding: 14px 40px; background: var(--color-primary); color: white;
    border-radius: var(--radius-md); font-weight: 600; font-size: 1rem;
    transition: background 0.2s;
  }
  .welcome-btn:hover { background: var(--color-primary-hover); }
</style>
