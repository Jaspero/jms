<script lang="ts">
  import Page from '$lib/Page.svelte';
  import type { PageData } from './$types';

  export let page: PageData;
</script>

<Page {page} />
