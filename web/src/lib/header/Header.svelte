<script lang="ts">
	import { auth } from '$lib/firebase-client';
	import { signOut } from "firebase/auth";
	import {goto} from '$app/navigation';
	import {isLoggedIn} from '../../routes/settings';

	export let links: Array<{label: string; link: string}>;

	function logOut() {
		signOut(auth)
			.then(() => {
			goto('/sign-in')
		}).catch((error) => {
			console.error(error);
		});
	}
</script>

<header>
	<nav>
		<ul>
			{#each links as link}
				<li>
					<a href={link.link}>{link.label}</a>
				</li>
			{/each}
			{#if $isLoggedIn}
				<li class='sing-out'>
					<a href='' on:click|preventDefault={logOut}>sign out</a>
				</li>
			{/if}
		</ul>
	</nav>
</header>

<style>
	header {
		width: 100%;
		height: 60px;
	}

	nav	{
		width: 100%;
		height: 100%;
		background: black;
	}

	ul {
		display: flex;
		align-items: center;
		height: 100%;
		justify-content: center;
	}

	li {
		list-style: none;
		margin: 0 10px;
		color: white;
	}
</style>