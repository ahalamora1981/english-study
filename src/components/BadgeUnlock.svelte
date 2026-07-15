<script>
  let { badge = null, onClose = () => {} } = $props();
</script>

{#if badge}
  <div class="overlay" onclick={onClose}>
    <div class="modal pop-in" onclick={(e) => e.stopPropagation()}>
      <div class="modal-icon">🏆</div>
      <div class="modal-subtitle">新成就解锁! | Achievement Unlocked!</div>
      <div class="modal-name">{badge.name} | {badge.nameEn}</div>
      <div class="modal-desc">{badge.desc}</div>
      <button class="modal-btn" onclick={onClose}>太棒了! | Awesome!</button>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center; z-index: 300;
  }
  .modal {
    background: var(--color-card); border-radius: var(--radius-lg);
    padding: 32px; text-align: center; max-width: 320px; width: 90%;
  }
  .modal-icon { font-size: 3rem; margin-bottom: 8px; }
  .modal-subtitle { font-size: 0.875rem; color: var(--color-secondary); font-weight: 600; margin-bottom: 8px; }
  .modal-name { font-size: 1.25rem; font-weight: 700; margin-bottom: 8px; }
  .modal-desc { font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 20px; }
  .modal-btn {
    padding: 12px 32px; background: var(--color-primary); color: white;
    border-radius: var(--radius-md); font-weight: 600;
  }
</style>
