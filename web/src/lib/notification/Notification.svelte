<script lang="ts">
  import {onMount} from 'svelte';
  import {fade} from 'svelte/transition';
  import {notification} from './notification';

  function clear() {
    notification.set(null);
  }

  onMount(() => {
    const unSub = notification.subscribe((value) => {
      if (value) {
        setTimeout(clear, value.duration || 5000);
      }
    });

    return () => {
      unSub();
    };
  });
</script>

{#if $notification}
  <aside transition:fade={{ duration: 200 }}>
    <main>
      {#if $notification.type === 'success'}
        <img src="/images/notification/success.svg" alt="Success" width="32" height="32">
      {:else if $notification.type === 'error'}
        <img src="/images/notification/error.svg" alt="Error" width="32" height="32">
      {:else}
        <img src="/images/notification/info.svg" alt="Info" width="32" height="32">
      {/if}
      <section>
        <h1>{$notification.title || 'Notifikacija'}</h1>
        <p>{$notification.content}</p>
      </section>
    </main>
    <hr>
    <footer>
      {#if $notification.click}
        <button on:click={$notification.click}>{$notification.action}</button>
      {/if}
      <button on:click={clear}>Obriši</button>
    </footer>
  </aside>
{/if}

<style>
    aside {
        position: fixed;
        z-index: 99;
        top: 0;
        right: 0;
        margin: 1rem;
        display: flex;
        background: white;
        overflow: hidden;
        border-radius: 1rem;
    }

    main {
        display: flex;
        align-items: center;
        padding: 1rem 1rem 1rem 1.5rem;
    }

    img {
        margin-right: 1rem;
        flex-shrink: 0;
    }

    section {
        font-size: .875rem;
        max-width: 40ch;
    }

    h1 {
        margin: 0 0 .15rem;
        font-size: inherit;
        font-weight: bold;
    }

    p {
        margin: 0;
        font-size: inherit;
    }

    hr {
        margin: 0;
        border: none;
        border-right: 1px solid var(--fg-3);
    }

    footer {
        display: flex;
        flex-direction: column;
    }

    button {
        font-family: inherit;
        font-size: .75rem;
        padding: .5rem 1rem;
        background: none;
        font-weight: bold;
        color: var(--primary);
        border: none;
        flex: 1;
    }

    button:hover,
    button:focus {
        background: red;
        color: black;
    }

    button + button {
        border-top: .1rem solid black;
    }
</style>
