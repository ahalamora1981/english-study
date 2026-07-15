<script>
  import { onMount, onDestroy } from 'svelte';

  let activeRoute = $state('/');

  function updateRoute() {
    const hash = window.location.hash;
    activeRoute = hash.startsWith('#/') ? hash.slice(1) : '/';
  }

  onMount(() => {
    updateRoute();
    window.addEventListener('hashchange', updateRoute);
  });

  onDestroy(() => {
    window.removeEventListener('hashchange', updateRoute);
  });

  const items = [
    { path: '/', label: '首页', labelEn: 'Home', icon: 'home' },
    { path: '/study', label: '学习', labelEn: 'Study', icon: 'study' },
    { path: '/dictionary', label: '词典', labelEn: 'Dictionary', icon: 'dict' },
    { path: '/achievements', label: '成就', labelEn: 'Achievements', icon: 'achv' },
  ];

  const icons = {
    home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    study: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    dict: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    achv: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  };
</script>

<nav class="nav">
  <div class="nav-inner">
    {#each items as item}
      <a href="#{item.path}" class="nav-item" class:active={activeRoute === item.path}>
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d={icons[item.icon]} />
        </svg>
        <span class="nav-label">{item.label}</span>
      </a>
    {/each}
  </div>
</nav>

<style>
  .nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--color-card);
    border-top: 1px solid var(--color-border);
    z-index: 100;
  }
  .nav-inner {
    display: flex;
    justify-content: space-around;
    padding: 8px 0;
    max-width: 480px;
    margin: 0 auto;
  }
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: var(--color-text-secondary);
    gap: 2px;
    font-size: 0.75rem;
  }
  .nav-item.active {
    color: var(--color-primary);
  }
  .nav-icon {
    width: 24px;
    height: 24px;
  }
  .nav-item.active .nav-icon {
    stroke-width: 2.5;
  }
  .nav-label {
    font-size: 0.65rem;
  }

  @media (min-width: 768px) {
    .nav {
      position: static;
      width: 200px;
      border-top: none;
      border-right: 1px solid var(--color-border);
    }
    .nav-inner {
      flex-direction: column;
      padding: 24px 12px;
      gap: 4px;
      max-width: none;
    }
    .nav-item {
      flex-direction: row;
      gap: 10px;
      padding: 10px 14px;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
    }
    .nav-item.active {
      background: var(--color-primary);
      color: white;
    }
    .nav-label {
      font-size: 0.875rem;
    }
  }
</style>
