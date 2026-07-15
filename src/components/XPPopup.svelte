<script>
  let { amount = 0 } = $props();
</script>

<div class="xp-popup">
  <span class="xp-icon">+{amount}</span>
  <span class="xp-label">XP</span>
</div>

<style>
  .xp-popup {
    position: fixed; top: 24px; left: 50%; transform: translateX(-50%);
    display: flex; align-items: center; gap: 4px;
    padding: 12px 24px; border-radius: var(--radius-md);
    background: var(--color-success); color: white;
    font-weight: 700; font-size: 1.25rem;
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
    animation: xp-fade 2s ease forwards;
    z-index: 200;
  }
  @keyframes xp-fade {
    0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    15% { opacity: 1; transform: translateX(-50%) translateY(0); }
    70% { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  }
</style>
