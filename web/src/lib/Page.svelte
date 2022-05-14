<script lang="ts">
  export let page: any;
</script>

{@html page.content || ''}

<svelte:head>
  <title>{page.meta?.title || page.title}</title>
  {#if page.meta?.description}
    <meta name="description" content={page.meta.description} />
  {/if}
</svelte:head>
