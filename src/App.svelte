<script>
  import { onMount } from 'svelte';
  import Router from 'svelte-spa-router';
  import Nav from './components/Nav.svelte';
  import Home from './pages/Home.svelte';
  import Study from './pages/Study.svelte';
  import Dictionary from './pages/Dictionary.svelte';
  import Achievements from './pages/Achievements.svelte';
  import { userStore } from './stores/user.js';
  import { wordsStore } from './stores/words.js';
  import { settingsStore } from './stores/settings.js';

  const routes = {
    '/': Home,
    '/study': Study,
    '/dictionary': Dictionary,
    '/achievements': Achievements,
  };

  onMount(() => {
    userStore.load();
    wordsStore.load();
    settingsStore.load();
  });
</script>

<div class="app-shell">
  <Nav />
  <main class="main-content">
    <Router {routes} />
  </main>
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
</style>
