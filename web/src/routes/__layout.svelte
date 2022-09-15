<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({fetch}) => {
		const {headerLinks} = await (await fetch('/settings')).json();
		return {
			props: {
				links: headerLinks
			}
		};
	}
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
	
	export let links: Array<{label: string; link: string;}>;

	$: mainClass = $page.url.pathname.slice(1) ? $page.url.pathname.slice(1) : 'home';
</script>

<Header {links} />

<main data-sveltekit-prefetch class={mainClass}>
	<slot />
</main>

<style></style>
