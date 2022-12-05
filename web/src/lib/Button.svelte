<script lang="ts">
  export let type: 'submit' | 'button' = 'button';

  /**
   * Specify if button should
   * take all available width
   */
  export let wfull = false;

  /**
   * Specify button color
   */
  export let color: 'accent' | 'primary' = 'accent';
  export let href = '';
  export let loading = false;
  export let appearance = 'filled';
</script>

{#if href}
  <a {href} class:w-full={wfull} class:loading class="{color} {appearance}" on:click>
    <slot />
  </a>
{:else}
  <button {type} class:w-full={wfull} class:loading class="{color} {appearance}" on:click>
    <slot />
  </button>
{/if}

<style>
  button,
  a {
      display: inline-block;
      text-align: center;
      color: white;
      font-size: 1rem;
      height: 40px;
      line-height: 40px;
      padding: 0 1rem;
      border-radius: 8px;
      border: none;
  }
  .outlined.primary {
      color: #e04644;
      border: 1px solid #e04644;
  }
  .outlined.accent {
      color: #4DA456;
      border: 1px solid #4DA456;
  }
  .filled.primary {
      background-color: #e04644;
  }
  .filled.accent {
      background-color: #303230;
      margin-top: 20px;
  }

  .loading {
      position: relative;
      background: none;
      pointer-events: none;
      user-select: none;
      color: transparent;
  }

  .loading::before {
      content: '';
      position: absolute;
      top: calc(50% - 0.75rem);
      right: calc(50% - 0.75rem);
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      border-width: 2px;
      border-style: solid;
      border-color: white transparent;
      animation: 0.7s loading linear infinite;
  }

  .w-full {
      width: 100%;
  }

  @keyframes loading {
      to {
          transform: rotate(360deg);
      }
  }
</style>
