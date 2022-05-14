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
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
	
	export let links: Array<{label: string; link: string;}>;
</script>

<Header {links} />

<main>
	<slot />
</main>

<style></style>
