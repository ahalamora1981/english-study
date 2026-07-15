<nav class="nav">
  <div class="nav-header">
    <a href="/" class="logo">单词达人</a>
  </div>
  <div class="nav-links">
    <a href="/" class="nav-link">Home</a>
    <a href="/study" class="nav-link">Study</a>
    <a href="/dictionary" class="nav-link">Dictionary</a>
    <a href="/achievements" class="nav-link">Achievements</a>
  </div>
</nav>

<style>
  .nav {
    width: 220px;
    background: var(--color-card);
    border-right: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    padding: 16px;
  }
  .nav-header {
    margin-bottom: 24px;
  }
  .logo {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-primary);
    text-decoration: none;
  }
  .nav-links {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .nav-link {
    padding: 10px 12px;
    border-radius: var(--radius-sm);
    color: var(--color-text-secondary);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.2s, color 0.2s;
  }
  .nav-link:hover {
    background: var(--color-bg);
    color: var(--color-primary);
  }
</style>
