<script lang="ts">
  import {BASE_TITLE, DELIMITER, URL} from '$lib/consts/title.const.ts';

  export let page: any;

  let title = page.meta?.title || page.title;

  if (BASE_TITLE) {
    title += ` ${DELIMITER} ${BASE_TITLE}`;
  }
</script>

{@html page.content || ''}

{#each page.scripts as script}
  <script async defer src={script}></script>
{/each}

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
