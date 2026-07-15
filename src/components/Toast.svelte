<script>
  let { message = '', type = 'info', onClose = () => {} } = $props();
</script>

{#if message}
  <div class="toast toast-{type} slide-up" onclick={onClose}>
    {message}
  </div>
{/if}

<style>
  .toast {
    position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
    padding: 12px 24px; border-radius: var(--radius-md);
    font-size: 0.875rem; font-weight: 500;
    z-index: 250; cursor: pointer; white-space: nowrap;
    box-shadow: var(--shadow-md);
  }
  .toast-info { background: var(--color-primary); color: white; }
  .toast-error { background: var(--color-danger); color: white; }
  .toast-success { background: var(--color-success); color: white; }
  @media (min-width: 768px) { .toast { bottom: 24px; } }
</style>
