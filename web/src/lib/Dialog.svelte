<script>
  import {fade} from 'svelte/transition';
  import Button from './Button.svelte';
  import {clickOutside} from './clickOutside';

  /**
   * Toggles Dialog on/off
   * @type {boolean}
   */
  export let opened = false;

  /**
   * Should the confirmation be shown
   * @type {boolean}
   */
  export let showConfirmation = true;

  /**
   * Specify dialog title
   * @type {string}
   */
  export let title = '';

  /**
   * Specify dialog subtitle
   * @type {string}
   */
  export let subtitle = '';

  /**
   * Specify confirm label
   * @type {string}
   */
  export let confirm = 'Confirm';

  /**
   * Speficy confirm button type
   * @type {"button" | "submit"}
   */
  export let confirmType = 'button';

  export let confirmHref = '';

  /**
   * Specify cancel label
   * @type {string}
   */
  export let cancel = 'Cancel';

  export function open() {
    opened = true;
  }

  function closeOnEscape(event) {
    if (event.key === 'Escape' && opened) {
      close();
    }
  }

  export function close() {
    opened = false;
  }

  function handleClickOutside(event) {
    opened = false;
  }

  $: if (opened) {
    try {
      document.body.classList.add('scroll-disabled');
    } catch (e) {}
  } else {
    try {
      document.body.classList.remove('scroll-disabled');
    } catch (e) {}
  }
</script>

{#if opened}
  <div class="dialog-backdrop" transition:fade={{duration: 200}}>
    <div class="dialog" use:clickOutside on:click_outside={handleClickOutside}>
      <div class="dialog-header p-a-s">
        <div class="flex-wrapper">
          <h1 class="dialog-title">{title}</h1>
          <button on:click={close} class="dialog-close">
            <img src="icons/close.svg" alt="Zatvori" />
          </button>
        </div>
        {#if subtitle}
          <p class="subtitle">{subtitle}</p>
        {/if}
      </div>

      {#if $$slots.content}
        <div class="dialog-content p-a-s">
          <slot name="content" />
        </div>
      {/if}

      {#if showConfirmation}
        <div class="flex jc-end p-a-s">
          <div class="m-r-s">
            <Button color="primary" on:click={close}>{cancel}</Button>
          </div>
          {#if confirm}
            <Button href={confirmHref} type={confirmType}>{confirm}</Button>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<svelte:window on:keydown={closeOnEscape}/>

<style>
    .dialog {
        position: absolute;
        top: 50%;
        left: 50%;
        background-color: white;
        transform: translate(-50%, -50%);
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
        border-radius: 8px;
    }

    .dialog-backdrop {
        z-index: 10;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .flex-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        position: relative;
        padding: 20px;
    }

    .dialog-title {
        width: 100%;
        text-align: center;
    }

    .subtitle {
        padding: 0 20px;
    }

    .dialog-content {
      margin-top: 20px;
      padding: 20px;
    }
    .dialog-close {
        border: none;
        background-color: transparent;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        transition: 0.2s;
        position: absolute;
        top: 0;
        right: 0;
    }
    .dialog-close:hover {
        background-color: rgba(0, 0, 0, 0.08);
    }

    @media (max-width: 900px) {
        .dialog {
            width: 80%;
        }
    }

    @media (max-width: 600px) {
        .dialog {
            width: calc(100vw - 40px);
        }
    }
</style>
