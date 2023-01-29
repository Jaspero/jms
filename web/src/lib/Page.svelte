<script lang="ts">
  import {BASE_TITLE, DELIMITER, URL} from '$lib/consts/title.const.ts';
  import {browser} from '$app/environment';

  export let page: any;

  $: title = ( page.meta?.title || page.title) + (BASE_TITLE ? ` ${DELIMITER} ${BASE_TITLE}` : '');

  $: if (page.scripts && browser) {
    (page.scripts || []).forEach((s: string) => {
      const script = document.createElement('script');

      script.setAttribute('async', 'true');
      script.setAttribute('defer', 'true');
      script.setAttribute('type', 'module');

      script.src = s;

      document.head.appendChild(script);
    });
  }
</script>

{@html page.content || ''}

<svelte:head>
  <title>{title}</title>
  <meta property="og:title" content="{title}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="{URL + page.id}" />
  <meta name="twitter:title" content="{title}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="{URL + page.id}" />
  {#if page.meta?.description}
    <meta name="description" content={page.meta.description} />
    <meta property="og:description" content="{page.meta.description}" />
    <meta name="twitter:description" content={page.meta.description} />
  {/if}
  {#if page.meta?.image}
    <meta property="og:image" content="{page.meta.image}" />
    <meta name="twitter:image" content={page.meta.image} />
  {/if}
</svelte:head>
