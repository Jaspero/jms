<script context="module" lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
	import Page from '$lib/Page.svelte';
	export let page: any;
</script>

<Page {page} />