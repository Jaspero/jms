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
	import { onMount } from 'svelte'
	import { auth } from '$lib/firebase-client';
	import {onAuthStateChanged } from "firebase/auth";
	import { goto } from '$app/navigation';
	import {isLoggedIn} from './settings';
	import '../app.css';

	export let links: Array<{label: string; link: string;}>;

	$: mainClass = $page.url.pathname.slice(1) ? $page.url.pathname.slice(1) : 'home';

	onMount(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				const uid = user.uid;
				isLoggedIn.update(() => true );
				console.log(user);
			} else {
				console.log('not logged in')
				isLoggedIn.update(() => false );
			}
		});
	})

</script>

<Header {links} />

<main data-sveltekit-prefetch class={mainClass}>
	<slot />
</main>

<style>

</style>
