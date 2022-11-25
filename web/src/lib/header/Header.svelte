<script lang="ts">
	import { auth } from '$lib/firebase-client';
	import { signOut } from "firebase/auth";
	import {goto} from '$app/navigation';
	import {isLoggedIn} from '../firebase-client';

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
				{#if $isLoggedIn}
				{#each links as link}
					<li>
						<a href={link.link}>{link.label}</a>
					</li>
				{/each}
				<li class='sing-out'>
					<a href='/' on:click|preventDefault={logOut}>sign out</a>
				</li>
					<li class="profile">
						<a href="/profile">
							<img src="icons/profile.svg" alt="">
						</a>
					</li>
					{:else}
					<li>
						<a href="/sign-in">Sign in</a>
					</li>
					<li>
						<a href="/sign-up">Sign up</a>
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
